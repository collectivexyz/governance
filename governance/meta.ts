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
 * Interface for the Collective Metadata Storage contract
 */
interface Meta {
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
   * Get the community name
   *
   * @returns string - The name
   */
  community(): Promise<string>;

  /**
   * Get the community description
   *
   * @returns string - the description
   */
  description(): Promise<string>;

  /**
   * Get the community url
   *
   * @returns string - the url
   */
  url(): Promise<string>;

  /**
   * Get the description of a vote by id
   *
   * @param proposalId The id of the vote
   *
   * @returns string - The description
   */
  getMetaDescription(proposalId: number): Promise<string>;

  /**
   * Get the url of a vote by id
   *
   * @param proposalId The id of the vote
   *
   * @returns string - The url
   */
  getMetaUrl(proposalId: number): Promise<string>;

  /**
   * Get arbitrary metadata stored on a particular proposal
   *
   * @param proposalId The id of the vote
   * @param metaId The id of the metadata
   *
   * @returns string - the name of the metadata
   * @returns string - the value of the metadata
   */
  getMeta(proposalId: number, metaId: number): Promise<{ name: string; value: string }>;

  /**
   * Get the number of stored metadata elements on the vote
   *
   * @param proposalId The id of the vote
   *
   * @returns number - The number of elements
   */
  metaCount(proposalId: number): Promise<number>;
}

export { Meta };
