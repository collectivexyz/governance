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
import { Wallet } from '../system/wallet';
import { ContractAbi } from '../system/contractabi';

import { Vault } from '../treasury/vault';

/**
 * Treasury contract implementation
 */
export class Treasury extends ContractAbi implements Vault {
  static ABI_NAME = 'Vault.json';

  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number, gasPriceGwei: string) {
    super(abiPath, Treasury.ABI_NAME, contractAddress, web3, wallet, gas, gasPriceGwei);
  }

  /**
   * send a depsoit to the treasury
   *
   * @param quantity the amount to deposit
   */
  async deposit(quantity: number): Promise<void> {
    this.logger.info('deposit()');
    const tx = await this.contract.methods.deposit().send({ value: quantity });
    this.logger.info(tx);
  }

  /**
   * approve a withdrawal from the treasury
   *
   * @param to the recipient of the funds
   * @param quantity the amount to approve
   */
  async approve(to: string, quantity: number): Promise<void> {
    this.logger.info(`approve(${to}, ${quantity})`);
    const tx = await this.contract.methods.approve(to, quantity).send();
    this.logger.info(tx);
  }

  /**
   * approve a withdrawal from the treasury and sign in a single
   * transaction
   *
   * @param to the recipient of the funds
   * @param quantity the amount to approve
   * @param scheduleTime the time to schedule the withdrawal
   * @param signature the array of signatures
   */
  async approveMulti(to: string, quantity: number, scheduleTime: number, signature: string[]): Promise<void> {
    this.logger.info(`approveMulti(${to}, ${quantity}, ${scheduleTime}, ${signature})`);
    const tx = await this.contract.methods.approveMulti(to, quantity, scheduleTime, signature).send();
    this.logger.info(tx);
  }

  /**
   * withdraw available funds from the treasury to your account
   */
  async pay(): Promise<void> {
    this.logger.info('pay()');
    const tx = await this.contract.methods.pay().send();
    this.logger.info(tx);
  }

  /**
   * withdraw available funds from the treasury to the specified account
   *
   * @param to the destination account for the funds
   */
  async transferTo(to: string): Promise<void> {
    this.logger.info(`transferTo(${to})`);
    const tx = await this.contract.methods.transferTo(to).send();
    this.logger.info(tx);
  }

  /**
   * cancel approval for the recipient
   *
   * @param to the destination account for the funds
   */
  async cancel(to: string): Promise<void> {
    this.logger.info(`cancel(${to})`);
    const tx = await this.contract.methods.cancel(to).send();
    this.logger.info(tx);
  }

  /**
   * retrieve the approved balance for the specified account
   *
   * @param from the account to query
   */
  async balance(from: string): Promise<number> {
    this.logger.info(`balance(${from})`);
    const balance = await this.contract.methods.balance(from).call();
    this.logger.info(balance);
    return balance;
  }

  /**
   * retrieve the contract balance for the treasury
   */
  async treasuryBalance(): Promise<number> {
    this.logger.info('balance()');
    const balance = await this.contract.methods.balance().call();
    this.logger.info(balance);
    return balance;
  }
}
