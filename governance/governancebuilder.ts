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

import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import { Wallet } from '../system/wallet';
import { ContractAbi } from '../system/contractabi';
import { Builder, ContractAddress } from '../governance/builder';
import { parseIntOrThrow } from '../system/version';

/**
 * API Wrapper for GovernanceBuilder contract
 */
export class GovernanceBuilder extends ContractAbi implements Builder {
  static ABI_NAME = 'GovernanceBuilder.json';

  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number, gasPriceGwei: string) {
    super(abiPath, GovernanceBuilder.ABI_NAME, contractAddress, web3, wallet, gas, gasPriceGwei);
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
   * reset the governance builder to default state
   * @returns Builder - this contract
   */
  async aGovernance(): Promise<Builder> {
    this.logger.info('aGovernance()');
    const tx = await this.contract.methods.aGovernance().send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the name for the community contract
   *
   * @param name the community name
   * @returns Builder - this contract
   */
  async withName(name: string): Promise<Builder> {
    this.logger.info(`withName ${name}`);
    const encodedName = this.web3.utils.asciiToHex(name);
    const tx = await this.contract.methods.withName(encodedName).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the url on the contract
   *
   * @param url the community url
   * @returns Builder - this contract
   */
  async withUrl(url: string): Promise<Builder> {
    this.logger.info(`withUrl ${url}`);
    const tx = await this.contract.methods.withUrl(url).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the description on the contract
   *
   * @param desc the description
   * @returns Builder - this contract
   */
  async withDescription(desc: string): Promise<Builder> {
    this.logger.info(`withDescription ${desc}`);
    const tx = await this.contract.methods.withDescription(desc).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * Add a community supervisor address to the project.  It is okay to call this method
   * more than once.  Each supervisor is added.
   *
   * @param supervisor address for the supervisor account
   * @returns Builder - this contract
   */
  async withSupervisor(supervisor: string): Promise<Builder> {
    this.logger.info(`withSupervisor ${supervisor}`);
    const tx = await this.contract.methods.withSupervisor(supervisor).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the Community Class
   *
   * @param voterClass the address of the CommunityClass contract
   * @returns Builder - this contract
   */
  async withCommunityClassAddress(voterClass: string): Promise<Builder> {
    this.logger.info(`withCommunityClassAddress ${voterClass}`);
    const tx = await this.contract.methods.withCommunityClassAddress(voterClass).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * Build the contract with the configured settings.
   *
   * @returns string - The address of the newly created contract
   */
  async build(): Promise<string> {
    this.logger.info('Building Governance');
    const buildTx = await this.contract.methods.build().send();
    this.logger.info(buildTx);

    const event: EventData = buildTx.events['GovernanceContractCreated'];
    const governance = event.returnValues['governance'];
    if (governance) {
      return governance;
    }
    throw new Error('Unknown Governance created');
  }

  /**
   * Helper to discover the contract suite built by a previous invocation of this contract
   *
   * @param txId The transaction bearing the build call
   * @returns ContractAddress - The set of contracts constructed by the build
   */
  async discoverContract(txId: string): Promise<ContractAddress> {
    const tx = await this.web3.eth.getTransaction(txId);
    if (!tx.blockNumber) {
      throw new Error(`Block not known for txId: ${txId}`);
    }
    const eventArray = await this.contract.getPastEvents('GovernanceContractCreated', {
      fromBlock: tx.blockNumber,
      toBlock: tx.blockNumber,
    });
    let governanceAddress = '';
    let storageAddress = '';
    let metaAddress = '';
    let timelockAddress = '';
    eventArray.forEach((e) => {
      governanceAddress = e.returnValues['governance'];
      storageAddress = e.returnValues['_storage'];
      timelockAddress = e.returnValues['timeLock'];
      metaAddress = e.returnValues['metaStorage'];
    });
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
}
