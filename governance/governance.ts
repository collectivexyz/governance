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
   * @return Promise<string> contract name
   */
  name(): Promise<string>;

  version(): Promise<number>;

  propose(): Promise<number>;

  choiceVote(choiceCount: number): Promise<number>;

  setChoice(proposalId: number, choiceId: number, name: string, description: string, transactionId: number): Promise<void>;

  describe(proposalId: number, description: string, url: string): Promise<void>;

  addMeta(proposalId: number, name: string, value: string): Promise<number>;

  attachTransaction(
    proposalId: number,
    target: string,
    value: number,
    signature: string,
    calldata: string,
    etaOfLock: number
  ): Promise<number>;

  configure(proposalId: number, quorum: number): Promise<void>;

  configureWithDelay(proposalId: number, quorum: number, requiredDelay: number, requiredDuration: number): Promise<void>;

  isOpen(proposalId: number): Promise<boolean>;

  startVote(proposalId: number): Promise<void>;

  endVote(proposalId: number): Promise<void>;

  cancel(proposalId: number): Promise<void>;

  voteFor(proposalId: number): Promise<void>;

  voteChoice(proposalId: number, choiceId: number): Promise<void>;

  voteForWithToken(proposalId: number, tokenId: number): Promise<void>;

  voteAgainst(proposalId: number): Promise<void>;

  voteAgainstWithToken(proposalId: number, tokenId: number): Promise<void>;

  abstainFrom(proposalId: number): Promise<void>;

  abstainWithToken(proposalId: number, tokenId: number): Promise<void>;

  voteSucceeded(proposalId: number): Promise<boolean>;
}

export { Governance };
