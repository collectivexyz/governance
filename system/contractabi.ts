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

import { loadAbi, pathWithSlash } from '../system/abi';
import { LoggerFactory } from '../system/logging';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { Wallet } from '../system/wallet';

/**
 * Abstract class implementation based on a ABI specification
 */
export abstract class ContractAbi {
  protected readonly logger = LoggerFactory.getLogger(module.filename);

  public readonly contractAddress: string;

  protected readonly web3: Web3;
  protected readonly contractAbi: any[];
  protected readonly gas: number;
  protected readonly gasPriceGwei: string;
  public contract: Contract;

  constructor(
    abiPath: string,
    abiName: string,
    contractAddress: string,
    web3: Web3,
    wallet: Wallet,
    gas: number,
    gasPriceGwei: string
  ) {
    this.contractAddress = contractAddress;
    this.web3 = web3;
    const abiFile = pathWithSlash(abiPath) + abiName;
    this.logger.info(`Loading ABI: ${abiFile}`);
    this.contractAbi = loadAbi(abiFile);
    this.gas = gas;
    this.gasPriceGwei = gasPriceGwei;
    this.contract = new web3.eth.Contract(this.contractAbi, this.contractAddress, {
      from: wallet.getAddress(),
      gas: gas,
      gasPrice: web3.utils.toWei(gasPriceGwei, 'gwei'),
    });
    this.contract.defaultBlock = 'latest';
    this.contract.transactionBlockTimeout = 10;
    this.contract.transactionConfirmationBlocks = 1;
    this.contract.transactionPollingTimeout = 300;
    this.logger.info(`Connected to contract at ${contractAddress}`);
  }
}
