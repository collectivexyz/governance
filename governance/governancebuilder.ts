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
import { Builder, ContractAddress } from './builder';

import { ContractAbi } from './contractabi';

export class GovernanceBuilder extends ContractAbi implements Builder {
  static ABI_NAME = 'GovernanceBuilder.json';

  constructor(abiPath: string, contractAddress: string, provider: ethers.providers.Provider, wallet: ethers.Wallet) {
    super(abiPath, GovernanceBuilder.ABI_NAME, contractAddress, provider, wallet);
  }

  async name(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async version(): Promise<number> {
    const version = await this.contract.number();
    return version;
  }

  async aGovernance(): Promise<GovernanceBuilder> {
    this.logger.info('Governance Builder Started');
    const tx = await this.contract.aGovernance();
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withName(name: string): Promise<GovernanceBuilder> {
    this.logger.info(`withName ${name}`);
    const encodedName = ethers.utils.formatBytes32String(name);
    const tx = await this.contract.withName(encodedName);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withUrl(url: string): Promise<GovernanceBuilder> {
    this.logger.info(`withUrl ${url}`);
    const tx = await this.contract.withUrl(url);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withDescription(desc: string): Promise<GovernanceBuilder> {
    this.logger.info(`withDescription ${desc}`);
    const tx = await this.contract['withDescription(string)'](desc);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withSupervisor(supervisor: string): Promise<GovernanceBuilder> {
    this.logger.info(`withSupervisor ${supervisor}`);
    const tx = await this.contract.withSupervisor(supervisor);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withVoterClassAddress(voterClass: string): Promise<GovernanceBuilder> {
    this.logger.info(`withVoterClass ${voterClass}`);
    const tx = await this.contract.withVoterClassAddress(voterClass);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async withMinimumDuration(duration: number): Promise<GovernanceBuilder> {
    this.logger.info(`withMinimumDuration ${duration}`);
    const tx = await this.contract.withMinimumDuration(duration);
    const txReceipt = await tx.wait();
    this.logger.info(txReceipt);
    return this;
  }

  async build(): Promise<string> {
    this.logger.info('Building Governance');
    const buildTx = await this.contract.build();
    const txReceipt = await buildTx.wait();
    this.logger.info(txReceipt);
    const event = txReceipt.events.find((e: Event) => 'GovernanceContractCreated' === e.event);
    const governance = event?.args['governance'];
    if (governance) {
      return governance;
    }
    throw new Error('Unknown Governance created');
  }

  async discoverContract(txId: string): Promise<ContractAddress> {
    const tx = await this.provider.getTransaction(txId);
    if (!tx.blockNumber) {
      throw new Error(`Block not known for txId: ${txId}`);
    }
    this.logger.info(`Fetch ${tx.blockNumber}`);
    const eventFilter = this.contract.filters.GovernanceContractCreated();
    const eventArray: Event[] = await this.contract.queryFilter(eventFilter, tx.blockNumber);
    let governanceAddress = '';
    let storageAddress = '';
    let metaAddress = '';
    let timelockAddress = '';
    eventArray
      .filter((e) => e.transactionHash === txId)
      .forEach((e) => {
        if (e.args) {
          governanceAddress = e.args['governance'];
          storageAddress = e.args['_storage'];
          timelockAddress = e.args['timeLock'];
          metaAddress = e.args['metaStorage'];
        }
      });
    if (governanceAddress && storageAddress && metaAddress && timelockAddress) {
      this.logger.info(
        `Found governance: ${governanceAddress}, storage: ${storageAddress}, meta: ${metaAddress}, timelock: ${timelockAddress}`
      );
      return {
        governanceAddress: governanceAddress,
        storageAddress: storageAddress,
        metaAddress: metaAddress,
        timelockAddress: timelockAddress,
      };
    }
    throw new Error('Discovery failed missing event data');
  }
}
