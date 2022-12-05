// SPDX-License-Identifier: BSD-3-Clause
/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, collective
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ethers, Event } from 'ethers';

import { loadAbi, pathWithSlash } from '../system/abi';
import { LoggerFactory } from '../system/logging';
import { Governance } from './governance';

export class CollectiveGovernance implements Governance {
  private readonly logger = LoggerFactory.getLogger(module.filename);

  static ABI_NAME = 'Governance.json';
  static STRAT_NAME = 'VoteStrategy.json';

  public readonly contractAddress: string;

  protected readonly provider: ethers.providers.Provider;
  protected readonly wallet: ethers.Wallet;
  protected readonly contractAbi: any[];
  protected readonly contract: ethers.Contract;

  constructor(abiPath: string, contractAddress: string, provider: ethers.providers.Provider, wallet: ethers.Wallet) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.wallet = wallet;

    const govAbiFile = pathWithSlash(abiPath) + CollectiveGovernance.ABI_NAME;
    this.logger.info(`Loading ABI: ${govAbiFile}`);
    const govAbi = loadAbi(govAbiFile);

    const stratFile = pathWithSlash(abiPath) + CollectiveGovernance.STRAT_NAME;
    this.logger.info(`Loading ABI: ${stratFile}`);
    const stratAbi = loadAbi(stratFile);

    this.contractAbi = govAbi.concat(stratAbi);
    this.contract = new ethers.Contract(this.contractAddress, this.contractAbi, this.wallet);
  }

  async name(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async version(): Promise<number> {
    const version = await this.contract.version();
    return parseInt(version);
  }

  async propose(): Promise<number> {
    this.logger.debug('Propose new vote');
    const proposeTx = await this.contract.propose();
    const proposeTxReceipt = await proposeTx.wait();
    this.logger.info(proposeTxReceipt);
    const filter = this.contract.filters.ProposalCreated();
    const event = proposeTxReceipt.events.find((e: Event) => (filter.topics ? filter.topics[0] === e.event : false));
    const proposalId = event?.args['proposalId'];
    if (proposalId) {
      return parseInt(proposalId);
    }
    throw new Error('Unknown proposal created');
  }

  async choiceVote(choiceCount: number): Promise<number> {
    this.logger.debug(`Propose choice vote: ${choiceCount}`);
    const proposeTx = await this.contract.propose(choiceCount);
    const proposeTxReceipt = await proposeTx.wait();
    this.logger.info(proposeTxReceipt);
    const filter = this.contract.filters.ProposalCreated();
    const event = proposeTxReceipt.events.find((e: Event) => (filter.topics ? filter.topics[0] === e.event : false));
    const proposalId = event?.args['proposalId'];
    if (proposalId) {
      return parseInt(proposalId);
    }
    throw new Error('Unknown proposal created');
  }

  async setChoice(proposalId: number, choiceId: number, name: string, description: string, transactionId: number): Promise<void> {
    this.logger.info(`choice: ${proposalId}, ${choiceId}, ${name}, ${description}, ${transactionId}}`);
    const encodedName = ethers.utils.formatBytes32String(name);
    const tx = await this.contract.setChoice(proposalId, choiceId, encodedName, description, transactionId);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
  }

  async describe(proposalId: number, description: string, url: string): Promise<void> {
    this.logger.debug(`describe: ${proposalId}, ${description}, ${url}`);
    const tx = await this.contract.describe(proposalId, description, url);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
  }

  async addMeta(proposalId: number, name: string, value: string): Promise<number> {
    this.logger.debug(`addMeta: ${proposalId}, ${name}, ${value}`);
    const encodedName = ethers.utils.formatBytes32String(name);
    const tx = await this.contract.addMeta(proposalId, encodedName, value);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    const filter = this.contract.filters.ProposalMeta();
    const event = txReceipt.events.find((e: Event) => (filter.topics ? filter.topics[0] === e.event : false));
    const metaId = event?.args['metaId'];
    if (metaId) {
      return parseInt(metaId);
    }
    throw new Error(`Added Meta not found: ${proposalId}, ${name}`);
  }

  async attachTransaction(
    proposalId: number,
    target: string,
    value: number,
    signature: string,
    calldata: string,
    etaOfLock: number
  ): Promise<number> {
    this.logger.debug(`attach: ${proposalId}, ${target}, ${value}, ${signature}, ${calldata}, ${etaOfLock}`);
    const attachTx = await this.contract.attachTransaction(proposalId, target, value, signature, calldata, etaOfLock);
    const attachTxReceipt = await attachTx.wait();
    this.logger.info(attachTxReceipt);
    const filter = this.contract.filters.ProposalTransactionAttached();
    const event = attachTxReceipt.events.find((e: Event) => (filter.topics ? filter.topics[0] === e.event : false));
    const transactionId = event?.args['transactionId'];
    if (transactionId) {
      return parseInt(transactionId);
    }
    throw new Error(`Attached transactionId not found: ${proposalId}`);
  }

  async configure(proposalId: number, quorum: number): Promise<void> {
    this.logger.debug(`configure vote: ${proposalId}, ${quorum}`);
    const configureTx = await this.contract.configure(proposalId, quorum);
    const configureTxReceipt = await configureTx.wait();
    this.logger.info(configureTxReceipt);
  }

  async configureWithDelay(proposalId: number, quorum: number, requiredDelay: number, requiredDuration: number): Promise<void> {
    this.logger.debug(`configure vote: ${proposalId}, ${quorum}, ${requiredDelay}, ${requiredDuration}`);
    const configureTx = await this.contract.configure(proposalId, quorum, requiredDelay, requiredDuration);
    const configureTxReceipt = await configureTx.wait();
    this.logger.info(configureTxReceipt);
  }

  async isOpen(proposalId: number): Promise<boolean> {
    return await this.contract.isOpen(proposalId).call();
  }

  async startVote(proposalId: number): Promise<void> {
    this.logger.debug(`start vote: ${proposalId}`);
    const openTx = await this.contract.startVote(proposalId);
    const openTxReceipt = await openTx.wait();
    this.logger.info(openTxReceipt);
  }

  async endVote(proposalId: number): Promise<void> {
    this.logger.debug(`end vote: ${proposalId}`);
    const endTx = await this.contract.endVote(proposalId);
    const endTxReceipt = await endTx.wait();
    this.logger.info(endTxReceipt);
  }

  async cancel(proposalId: number): Promise<void> {
    this.logger.debug(`cancel: ${proposalId}`);
    const endTx = await this.contract.cancel(proposalId);
    const endTxReceipt = await endTx.wait();
    this.logger.info(endTxReceipt);
  }

  async voteFor(proposalId: number): Promise<void> {
    this.logger.debug(`vote for: ${proposalId}`);
    const voteTx = await this.contract.voteFor(proposalId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async voteChoice(proposalId: number, choiceId: number): Promise<void> {
    this.logger.debug(`vote choice: ${proposalId} – ${choiceId}`);
    const voteTx = await this.contract.voteChoice(proposalId, choiceId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async voteForWithTokenId(proposalId: number, tokenId: number): Promise<void> {
    this.logger.debug(`vote for with token: ${tokenId}`);
    const voteTx = await this.contract.voteFor(proposalId, tokenId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async voteAgainst(proposalId: number): Promise<void> {
    this.logger.debug('vote against');
    const voteTx = await this.contract.voteAgainst(proposalId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async voteAgainstWithTokenId(proposalId: number, tokenId: number): Promise<void> {
    this.logger.debug(`vote against with token: ${tokenId}`);
    const voteTx = await this.contract.voteAgainstWithTokenId(proposalId, tokenId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async abstainFromVote(proposalId: number): Promise<void> {
    this.logger.debug('abstain');
    const voteTx = await this.contract.abstainFromVote(proposalId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async abstainWithTokenId(proposalId: number, tokenId: number): Promise<void> {
    this.logger.debug(`abstain for ${tokenId}`);
    const voteTx = await this.contract.abstainWithTokenId(proposalId, tokenId);
    const voteTxReceipt = await voteTx.wait();
    this.logger.info(voteTxReceipt);
  }

  async voteSucceeded(proposalId: number): Promise<boolean> {
    return await this.contract.getVoteSucceeded(proposalId);
  }
}
