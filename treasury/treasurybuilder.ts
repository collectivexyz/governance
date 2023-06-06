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

/**
 * Collective Treasury Builder
 */
export class TreasuryBuilder extends ContractAbi {
  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number, gasPriceGwei: string) {
    super(abiPath, 'TreasuryBuilder.json', contractAddress, web3, wallet, gas, gasPriceGwei);
  }

  /**
   * get the name of the contract
   * @returns string the name of the contract
   */
  async name(): Promise<string> {
    this.logger.debug('name()');
    const name = await this.contract.methods.name().call();
    this.logger.debug(name);
    return name;
  }

  /**
   * intialize and create a new treasury
   *
   * @returns TreasuryBuilder this treasury builder
   */
  async aTreasury(): Promise<TreasuryBuilder> {
    this.logger.info('aTreasury()');
    const tx = await this.contract.methods.aTreasury().send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the number of approvals for the treasury
   *
   * @param minimumApprovalRequirement the minumum number of approvals required to execute a transaction
   * @returns TreasuryBuilder this treasury builder
   */
  async withMinimumApprovalRequirement(minimumApprovalRequirement: number): Promise<TreasuryBuilder> {
    this.logger.info(`withMinimumApprovalRequirement(${minimumApprovalRequirement})`);
    const tx = await this.contract.methods.withMinimumApprovalRequirement(minimumApprovalRequirement).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * set the timelock delay for the treasury
   * @param timelockDelay the timelock delay in seconds
   * @returns TreasuryBuilder this treasury builder
   */
  async withTimeLockDelay(timelockDelay: number): Promise<TreasuryBuilder> {
    this.logger.info(`withTimeLockDelay(${timelockDelay})`);
    const tx = await this.contract.methods.withTimeLockDelay(timelockDelay).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * add an approver to the treasury
   * @param approver the approver to add
   * @returns TreasuryBuilder this treasury builder
   */
  async withApprover(approver: string): Promise<TreasuryBuilder> {
    this.logger.info(`withApprover(${approver})`);
    const tx = await this.contract.methods.withApprover(approver).send();
    this.logger.info(tx);
    return this;
  }

  /**
   * build the treasury
   * @returns string the address of the treasury
   */
  async build(): Promise<string> {
    this.logger.info('build()');
    const tx = await this.contract.methods.build().send();
    this.logger.info(tx);
    const event: EventData = tx.events['TreasuryCreated'];
    const classAddress = event.returnValues['treasury'];
    if (classAddress) {
      return classAddress;
    }
    throw new Error('Treasury not created');
  }
}
