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

import { Wallet } from '../system/wallet';
import { ContractAbi } from '../system/contractabi';
import { Meta } from './meta';
import { parseIntOrThrow } from '../system/version';

export class MetaStorage extends ContractAbi implements Meta {
  static ABI_NAME = 'MetaStorage.json';

  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number, gasPriceGwei: string) {
    super(abiPath, MetaStorage.ABI_NAME, contractAddress, web3, wallet, gas, gasPriceGwei);
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
   * Get the community name
   *
   * @returns string - The name
   */
  async community(): Promise<string> {
    const communityHexEnc = await this.contract.methods.community().call();
    const community = this.web3.utils.hexToAscii(communityHexEnc);
    return community;
  }

  /**
   * Get the community description
   *
   * @returns string - the description
   */
  async description(): Promise<string> {
    const description = await this.contract.methods.description().call();
    return description;
  }

  /**
   * Get the community url
   *
   * @returns string - the url
   */
  async url(): Promise<string> {
    const description = await this.contract.methods.url().call();
    return description;
  }

  /**
   * Get the description of a vote by id
   *
   * @param proposalId The id of the vote
   *
   * @returns string - The description
   */
  async getDescription(proposalId: number): Promise<string> {
    return await this.contract.methods.description(proposalId).call();
  }

  /**
   * Get the url of a vote by id
   *
   * @param proposalId The id of the vote
   *
   * @returns string - The url
   */
  async getUrl(proposalId: number): Promise<string> {
    return await this.contract.methods.url(proposalId).call();
  }

  /**
   * Get arbitrary metadata stored on a particular proposal
   *
   * @param proposalId The id of the vote
   * @param metaId The id of the metadata
   *
   * @returns string - the name of the metadata
   * @returns string - the value of the metadata
   */
  async get(proposalId: number, metaId: number): Promise<{ name: string; value: string }> {
    const metaData = await this.contract.methods.get(proposalId, metaId).call();
    const decodedName = this.web3.utils.hexToAscii(metaData[0]);
    return { name: decodedName, value: metaData[1] };
  }

  /**
   * Get the number of stored metadata elements on the vote
   *
   * @param proposalId The id of the vote
   *
   * @returns number - The number of elements
   */
  async metaCount(proposalId: number): Promise<number> {
    return await this.contract.methods.metaCount(proposalId).call();
  }
}
