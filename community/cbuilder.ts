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

/**
 * Community Builder interface
 */
interface CBuilder {
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
   * reset the community class builder for this address
   * @returns Builder - this contract
   */
  aCommunity(): Promise<CBuilder>;

  /**
   * build an open community
   *
   * @returns Builder - this contract
   */
  asOpenCommunity(): Promise<CBuilder>;

  /**
   * build a pool community
   *
   * @returns Builder - this contract
   */
  asPoolCommunity(): Promise<CBuilder>;

  /**
   * build ERC-721 community
   *
   * @param project the token contract address
   *
   * @returns Builder - this contract
   */
  asErc721Community(project: string): Promise<CBuilder>;

  /**
   * build Closed ERC-721 community
   *
   * @param project the token contract address
   * @param tokenThreshold the number of tokens required to propose
   *
   * @returns Builder - this contract
   */
  asClosedErc721Community(project: string, tokenThreshold: number): Promise<CBuilder>;

  /**
   * append a voter for a pool community
   *
   * @param voter the wallet address
   *
   * @returns Builder - this contract
   */
  withVoter(voter: string): Promise<CBuilder>;

  /**
   * set the voting weight for each authorized voter
   *
   * @param weight the voting weight
   *
   * @returns Builder - this contract
   */
  withWeight(weight: number): Promise<CBuilder>;

  /**
   * set the minimum quorum for this community
   *
   * @param quorum the minimum quorum
   *
   * @returns Builder - this contract
   */
  withQuorum(quorum: number): Promise<CBuilder>;

  /**
   * set the minimum vote delay for the community
   *
   * @param delay - minimum vote delay in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  withMinimumVoteDelay(delay: number): Promise<CBuilder>;

  /**
   * set the maximum vote delay for the community
   *
   * @param delay - maximum vote delay in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  withMaximumVoteDelay(delay: number): Promise<CBuilder>;

  /**
   * set the minimum vote duration for the community
   *
   * @param duration - minimum vote duration in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  withMinimumVoteDuration(duration: number): Promise<CBuilder>;

  /**
   * set the maximum vote duration for the community
   *
   * @param duration - maximum vote duration in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  withMaximumVoteDuration(duration: number): Promise<CBuilder>;

  /**
   * Build the contract with the configured settings.
   *
   * @returns string - The address of the newly created contract
   */
  build(): Promise<string>;
}

export { CBuilder };
