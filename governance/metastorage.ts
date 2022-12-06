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

import { ethers } from 'ethers';

import { ContractAbi } from './contractabi';
import { Meta } from './meta';

export class MetaStorage extends ContractAbi implements Meta {
  static ABI_NAME = 'MetaStorage.json';

  constructor(abiPath: string, contractAddress: string, provider: ethers.providers.Provider, wallet: ethers.Wallet) {
    super(abiPath, MetaStorage.ABI_NAME, contractAddress, provider, wallet);
  }

  async name(): Promise<string> {
    const name = await this.contract.name();
    return name;
  }

  async version(): Promise<number> {
    const version = await this.contract.version();
    return parseInt(version);
  }

  async community(): Promise<string> {
    const communityHexEnc = await this.contract.community();
    const community = ethers.utils.parseBytes32String(communityHexEnc);
    return community;
  }

  async description(): Promise<string> {
    const description = await this.contract.description();
    return description;
  }

  async url(): Promise<string> {
    const description = await this.contract['url()']();
    return description;
  }

  async getMetaDescription(proposalId: number): Promise<string> {
    return await this.contract.description(proposalId);
  }

  async getMetaUrl(proposalId: number): Promise<string> {
    return await this.contract['url(uint256)'](proposalId);
  }

  async getMeta(proposalId: number, metaId: number): Promise<{ name: string; value: string }> {
    const metaData = await this.contract.getMeta(proposalId, metaId);
    const decodedName = ethers.utils.parseBytes32String(metaData[0]);
    return { name: decodedName, value: metaData[1] };
  }
}
