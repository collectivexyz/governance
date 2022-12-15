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
 * interface to Collective Governance contract
 */
interface Governance {
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
   * propose a new vote
   *
   * @returns number - The id of the proposal
   */
  propose(): Promise<number>;

  /**
   * propose a new vote with choices
   *
   * @param choiceCount The number of choices
   *
   * @returns number - The id of the proposal
   */
  choiceVote(choiceCount: number): Promise<number>;

  /**
   * set a choice for the choice vote
   * @param proposalId The id of the vote
   * @param choiceId The id of the choice
   * @param name The name for the choice
   * @param description The choice description
   * @param transactionId The transaction id to associate with the choice.  This transaction will execute if the given choice wins.
   */
  setChoice(proposalId: number, choiceId: number, name: string, description: string, transactionId: number): Promise<void>;

  /**
   * describe a vote
   * @param proposalId The id of the vote
   * @param description The description of the vote
   * @param url The url for the vote
   */
  describe(proposalId: number, description: string, url: string): Promise<void>;

  /**
   * Add custom metadata to a vote
   *
   * @param proposalId The id of the vote
   * @param name the name for the customized data
   * @param value the value of the customized data
   *
   * @returns number - the metadata id of the attached metadata
   */
  addMeta(proposalId: number, name: string, value: string): Promise<number>;

  /**
   * attach a transaction to the vote
   *
   * @param proposalId The id of the vote to attach to
   * @param target target address for the call
   * @param value value to be specified for the transaction, may be 0
   * @param signature function signature for the call
   * @param calldata abi encoded calldata for the transaction call
   * @param etaOfLock expected time when execution will be triggered for this transaction
   *
   * @returns number - The id of the attached transaction
   */
  attachTransaction(
    proposalId: number,
    target: string,
    value: number,
    signature: string,
    calldata: string,
    etaOfLock: number
  ): Promise<number>;

  /**
   * configure the specified vote
   *
   * @param proposalId The id of the vote
   * @param quorum The minimum quorum for this vote
   */
  configure(proposalId: number, quorum: number): Promise<void>;

  /**
   * configure a vote with delay settings
   *
   * @param proposalId The id of the vote
   * @param quorum The minimum quorum for the vote
   * @param requiredDelay The minimum required vote delay
   * @param requiredDuration The minimum required vote duration
   */
  configureWithDelay(proposalId: number, quorum: number, requiredDelay: number, requiredDuration: number): Promise<void>;

  /**
   * get the status of a given vote
   * @param proposalId The id of the vote
   * @returns boolean - True if vote is open
   */
  isOpen(proposalId: number): Promise<boolean>;

  /**
   * start voting
   *
   * @param proposalId The id of the vote
   */
  startVote(proposalId: number): Promise<void>;

  /**
   * end voting
   *
   * @param proposalId The id of the vote
   */
  endVote(proposalId: number): Promise<void>;

  /**
   * cancel a vote before it starts
   *
   * @param proposalId The id of the vote
   */
  cancel(proposalId: number): Promise<void>;

  /**
   * vote in favor
   *
   * @param proposalId The id of the vote
   */
  voteFor(proposalId: number): Promise<void>;

  /**
   * vote in favor with all shares
   *
   * @param proposalId the id of the choice vote
   * @param choiceId the id of the choice on the vote
   */
  voteChoice(proposalId: number, choiceId: number): Promise<void>;

  /**
   * vote in favor with the named token
   *
   * @param proposalId The id of the vote
   * @param tokenId the id of the token
   */
  voteForWithToken(proposalId: number, tokenId: number): Promise<void>;

  /**
   * vote against for all shares
   *
   * @param proposalId The id of the vote
   */
  voteAgainst(proposalId: number): Promise<void>;

  /**
   * vote against with named token
   *
   * @param proposalId The id of the vote
   * @param tokenId the id of the token
   */
  voteAgainstWithToken(proposalId: number, tokenId: number): Promise<void>;

  /**
   * abstain all shares
   *
   * @param proposalId The id of the vote
   */
  abstainFrom(proposalId: number): Promise<void>;

  /**
   * abstain for named token
   *
   * @param proposalId The id of the vote
   */
  abstainWithToken(proposalId: number, tokenId: number): Promise<void>;

  /**
   * undo for all shares
   *
   * @param proposalId The id of the vote
   */
  undoVote(proposalId: number): Promise<void>;

  /**
   * undo with the specified token
   *
   * @param proposalId The id of the vote
   * @param tokenId the id of the token
   */
  undoVoteWithToken(proposalId: number, tokenId: number): Promise<void>;

  /**
   * determine if the given vote succeeded
   *
   * @param proposalId The id of the vote
   * @returns boolean - True if the vote succeeded
   */
  voteSucceeded(proposalId: number): Promise<boolean>;
}

export { Governance };
