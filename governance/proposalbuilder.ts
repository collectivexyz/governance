// SPDX-License-Identifier: BSD-3-Clause
/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2023, collective
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

import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import { Wallet } from '../system/wallet';
import { ContractAbi } from '../system/contractabi';
import { parseIntOrThrow } from '../system/version';
import { PBuilder as Builder } from '../governance/pbuilder';

class ProposalBuilder extends ContractAbi implements Builder {
  static ABI_NAME = 'ProposalBuilder.json';

  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number, gasPriceGwei: string) {
    super(abiPath, ProposalBuilder.ABI_NAME, contractAddress, web3, wallet, gas, gasPriceGwei);
  }

  /**
   * get the contract name
   * @returns string - contract anme
   */
  async name(): Promise<string> {
    const name = await this.contract.methods.name().call();
    return name;
  }

  /**
   * get the contract version
   * @returns number - the version
   */
  async version(): Promise<number> {
    const version = await this.contract.methods.version().call();
    return parseIntOrThrow(version);
  }

  /**
   * reset the proposal builder for this address
   *
   * @returns Builder - this contract
   */
  async aProposal(): Promise<Builder> {
    this.logger.info('Proposal Builder Started');
    const tx = await this.contract.methods.aProposal().send();
    this.logger.info(tx);
    return this;
  }

  /**
   * Add a choice to the proposal
   *
   * @param name choice name
   * @param description choice description
   * @param transactionId id of transaction to execute for choice
   *
   * @returns Builder - this contract
   */
  async withChoice(name: string, description: string, transactionId: number): Promise<Builder> {
    this.logger.info(`withChoice ${name}, ${description}, ${transactionId}`);
    const encodedName = this.web3.utils.asciiToHex(name);
    const tx = await this.contract.methods.withChoice(encodedName, description, transactionId).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * Add a transaction to the proposal
   *
   * @param target the address to execute
   * @param value the amount to transfer
   * @param signature the contract function signature
   * @param _calldata the calldata to pass to the executing signature
   * @param scheduleTime the time to execute the transaction
   *
   * @returns Builder - this contract
   */
  async withTransaction(
    target: string,
    value: number,
    signature: string,
    _calldata: string,
    scheduleTime: number
  ): Promise<Builder> {
    this.logger.info(`withTransaction ${target}, ${value}, ${signature}, ${_calldata}, ${scheduleTime}`);
    const tx = await this.contract.methods.withTransaction(target, value, signature, _calldata, scheduleTime).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the proposal description
   * @returns Builder - this contract
   */
  async withDescription(description: string, url: string): Promise<Builder> {
    this.logger.info(`withDescription ${description}, ${url}`);
    const tx = await this.contract.methods.withDescription(description, url).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * attach metadata to the proposal
   *
   * @param name the name for metadata
   * @param value the value for metadata
   *
   * @returns Builder - this contract
   */
  async withMeta(name: string, value: string): Promise<Builder> {
    this.logger.info(`withMeta ${name}, ${value}`);
    const encodedName = this.web3.utils.asciiToHex(name);
    const tx = await this.contract.methods.withMeta(encodedName, value).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the quorum required for this proposal
   *
   * @param quorum the quorum required
   *
   * @returns Builder - this contract
   */
  async withQuorum(quorum: number): Promise<Builder> {
    this.logger.info(`withQuorum ${quorum}`);
    const tx = await this.contract.methods.withQuorum(quorum).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the delay for this proposal
   *
   * @param delay the delay to start voting
   *
   * @returns Builder - this contract
   */
  async withDelay(delay: number): Promise<Builder> {
    this.logger.info(`withDelay ${delay}`);
    const tx = await this.contract.methods.withDelay(delay).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the duration for this proposal
   *
   * @param duration the delay to start voting
   *
   * @returns Builder - this contract
   */
  async withDuration(duration: number): Promise<Builder> {
    this.logger.info(`withDuration ${duration}`);
    const tx = await this.contract.methods.withDuration(duration).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * Build the proposal with the configured settings.
   *
   * @returns number - The proposal id of the created proposal
   */
  async build(): Promise<number> {
    this.logger.info('Building Proposal');
    const buildTx = await this.contract.methods.build().send();
    this.logger.info(buildTx);

    const event: EventData = buildTx.events['ProposalBuild'];
    const proposalId = event.returnValues['proposalId'];
    if (proposalId) {
      return parseIntOrThrow(proposalId);
    }
    throw new Error('Unknown proposal created');
  }
}
export { ProposalBuilder };
