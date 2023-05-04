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
import { ContractAbi } from '../system/contractabi';
import { Storage } from './storage';
import { parseIntOrThrow } from '../system/version';

/**
 * API Wrapper for CollectiveStorage contract
 */
export class CollectiveStorage extends ContractAbi implements Storage {
  static ABI_NAME = 'Storage.json';

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
   * get the current quorum required for a vote to pass
   *
   * @param proposalId The id of the vote
   * @returns number - the quorum
   */
  async quorumRequired(proposalId: number): Promise<number> {
    const quorum = await this.contract.methods.quorumRequired(proposalId).call();
    return parseIntOrThrow(quorum);
  }

  /**
   * get the delay for this vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds
   */
  async voteDelay(proposalId: number): Promise<number> {
    const delay = await this.contract.methods.voteDelay(proposalId).call();
    return parseIntOrThrow(delay);
  }

  /**
   * get the amount of time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds
   */
  async voteDuration(proposalId: number): Promise<number> {
    const duration = await this.contract.methods.voteDuration(proposalId).call();
    return parseIntOrThrow(duration);
  }

  /**
   * get the start time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds referenced from the unix epoch, January 1, 1970
   */
  async startTime(proposalId: number): Promise<number> {
    const timeStr = await this.contract.methods.startTime(proposalId).call();
    return parseIntOrThrow(timeStr);
  }

  /**
   * get the end time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds referenced from the unix epoch, January 1, 1970
   */
  async endTime(proposalId: number): Promise<number> {
    const timeStr = await this.contract.methods.endTime(proposalId).call();
    return parseIntOrThrow(timeStr);
  }

  /**
   * Get the winning choice for a choice vote
   *
   * @param proposalId The id of the vote
   * @returns number - The id of the winning choice
   */
  async getWinningChoice(proposalId: number): Promise<number> {
    const choiceNum = await this.contract.methods.getWinningChoice(proposalId).call();
    return parseIntOrThrow(choiceNum);
  }

  /**
   * get the number of choices for a choice vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of choices
   */
  async choiceCount(proposalId: number): Promise<number> {
    const choiceCount = await this.contract.methods.choiceCount(proposalId).call();
    return parseIntOrThrow(choiceCount);
  }

  /**
   * get the choice parameterization for a specific choice
   *
   * @param proposalId The id of the vote
   * @param choiceId The id of the choice
   *
   * @returns string - the name
   * @returns string - the description
   * @returns number - the transactionId
   * @returns number - the vote count
   */
  async getChoice(
    proposalId: number,
    choiceId: number
  ): Promise<{ name: string; description: string; transactionId: number; voteCount: number }> {
    const metaData = await this.contract.methods.getChoice(proposalId, choiceId).call();
    const decodedName = this.web3.utils.hexToAscii(metaData[0]);
    const transactionId = parseIntOrThrow(metaData[2]);
    const voteCount = parseIntOrThrow(metaData[3]);
    if (transactionId && voteCount) {
      return {
        name: decodedName,
        description: metaData[1],
        transactionId: transactionId,
        voteCount: voteCount,
      };
    }
    throw new Error('Choice returned invalid data');
  }
}
