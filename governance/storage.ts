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

/**
 * Interface for Collective Storage
 */
interface Storage {
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
   * get the current quorum required for a vote to pass
   *
   * @param proposalId The id of the vote
   * @returns number - the quorum
   */
  quorumRequired(proposalId: number): Promise<number>;

  /**
   * get the delay for this vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds
   */
  voteDelay(proposalId: number): Promise<number>;

  /**
   * get the amount of time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds
   */
  voteDuration(proposalId: number): Promise<number>;

  /**
   * get the start time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds referenced from the unix epoch, January 1, 1970
   */
  startTime(proposalId: number): Promise<number>;

  /**
   * get the end time for the vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of seconds referenced from the unix epoch, January 1, 1970
   */
  endTime(proposalId: number): Promise<number>;

  /**
   * Get the winning choice for a choice vote
   *
   * @param proposalId The id of the vote
   * @returns number - The id of the winning choice
   */
  getWinningChoice(proposalId: number): Promise<number>;

  /**
   * get the number of choices for a choice vote
   *
   * @param proposalId The id of the vote
   * @returns number - The number of choices
   */
  choiceCount(proposalId: number): Promise<number>;

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
  getChoice(
    proposalId: number,
    choiceId: number
  ): Promise<{ name: string; description: string; transactionId: number; voteCount: number }>;
}

export { Storage };
