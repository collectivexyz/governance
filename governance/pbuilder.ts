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

interface PBuilder {
  /**
   * get the contract name
   * @returns string - contract anme
   */
  name(): Promise<string>;

  /**
   * get the contract version
   * @returns number - the version
   */
  version(): Promise<number>;

  /**
   * reset the proposal builder for this address
   *
   * @returns PBuilder - this contract
   */
  aProposal(): Promise<PBuilder>;

  /**
   * Add a choice to the proposal
   *
   * @param name choice name
   * @param description choice description
   * @param transactionId id of transaction to execute for choice
   *
   * @returns PBuilder - this contract
   */
  withChoice(name: string, description: string, transactionId: number): Promise<PBuilder>;

  /**
   * Add a transaction to the proposal
   *
   * @param target the address to execute
   * @param value the amount to transfer
   * @param signature the contract function signature
   * @param _calldata the calldata to pass to the executing signature
   * @param scheduleTime the time to execute the transaction
   *
   * @returns PBuilder - this contract
   */
  withTransaction(target: string, value: number, signature: string, _calldata: string, scheduleTime: number): Promise<PBuilder>;

  /**
   * set the proposal description
   * @returns PBuilder - this contract
   */
  withDescription(description: string, url: string): Promise<PBuilder>;

  /**
   * attach metadata to the proposal
   *
   * @param name the name for metadata
   * @param value the value for metadata
   *
   * @returns PBuilder - this contract
   */
  withMeta(name: string, value: string): Promise<PBuilder>;

  /**
   * set the quorum required for this proposal
   *
   * @param quorum the quorum required
   *
   * @returns PBuilder - this contract
   */
  withQuorum(quorum: number): Promise<PBuilder>;

  /**
   * set the delay for this proposal
   *
   * @param delay the delay to start voting
   *
   * @returns PBuilder - this contract
   */
  withDelay(delay: number): Promise<PBuilder>;

  /**
   * set the duration for this proposal
   *
   * @param duration the delay to start voting
   *
   * @returns PBuilder - this contract
   */
  withDuration(duration: number): Promise<PBuilder>;

  /**
   * Build the proposal with the configured settings.
   *
   * @returns number - The proposal id of the created proposal
   */
  build(): Promise<number>;
}

export { PBuilder };
