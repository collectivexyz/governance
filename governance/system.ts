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

export class System extends ContractAbi {
  static ABI_NAME = 'System.json';

  constructor(abiPath: string, contractAddress: string, provider: ethers.providers.Provider, wallet: ethers.Wallet) {
    super(abiPath, System.ABI_NAME, contractAddress, provider, wallet);
  }

  async create(name: string, url: string, description: string, erc721contract: string, quorum: number): Promise<string> {
    this.logger.info(`Create Governance: ${name}, ${url}, ${description}, ${erc721contract}, ${quorum}`);
    const encodedName = ethers.utils.formatBytes32String(name);
    const buildTx = await this.contract.create(encodedName, url, description, erc721contract, quorum);
    const buildTxReceipt = await buildTx.wait();
    this.logger.debug(buildTxReceipt);
    return buildTx.transactionHash;
  }

  async createWithDelay(
    name: string,
    url: string,
    description: string,
    erc721contract: string,
    quorum: number,
    delay: number,
    duration: number
  ): Promise<string> {
    this.logger.info(`Create Governance: ${name}, ${url}, ${description}, ${erc721contract}, ${quorum}, ${delay}, ${duration}`);
    const encodedName = ethers.utils.formatBytes32String(name);
    const buildTx = await this.contract.create(encodedName, url, description, erc721contract, quorum, delay, duration);
    const buildTxReceipt = await buildTx.wait();
    this.logger.debug(buildTxReceipt);
    return buildTx.transactionHash;
  }
}
