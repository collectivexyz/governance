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

import { loadAbi, pathWithSlash } from '../system/abi';
import { LoggerFactory } from '../system/logging';

export class ContractAbi {
  protected readonly logger = LoggerFactory.getLogger(module.filename);

  public readonly contractAddress: string;

  protected readonly provider: ethers.providers.Provider;
  protected readonly wallet: ethers.Wallet;
  protected readonly contractAbi: any[];
  protected readonly contract: ethers.Contract;

  constructor(
    abiPath: string,
    abiName: string,
    contractAddress: string,
    provider: ethers.providers.Provider,
    wallet: ethers.Wallet
  ) {
    this.contractAddress = contractAddress;
    this.provider = provider;
    this.wallet = wallet;
    const abiFile = pathWithSlash(abiPath) + abiName;
    this.logger.info(`Loading ABI: ${abiFile}`);
    this.contractAbi = loadAbi(abiFile);
    this.contract = new ethers.Contract(this.contractAddress, this.contractAbi, this.wallet);
  }
}
