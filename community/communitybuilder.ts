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

import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import { Wallet } from '../system/wallet';
import { ContractAbi } from '../system/contractabi';
import { parseIntOrThrow } from '../system/version';

import { CBuilder as Builder } from '../community/cbuilder';

class CommunityBuilder extends ContractAbi implements Builder {
  static ABI_NAME = 'CommunityBuilder.json';

  private readonly wallet: Wallet;
  private readonly gas: number;

  constructor(abiPath: string, contractAddress: string, web3: Web3, wallet: Wallet, gas: number) {
    super(abiPath, CommunityBuilder.ABI_NAME, contractAddress, web3);
    this.wallet = wallet;
    this.gas = gas;
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
   * reset the community class builder for this address
   * @returns Builder - this contract
   */
  async aCommunity(): Promise<Builder> {
    this.logger.info('Community Builder Started');
    const tx = await this.contract.methods.aCommunity().send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * build an open community
   *
   * @returns Builder - this contract
   */
  async asOpenCommunity(): Promise<Builder> {
    this.logger.info('asOpenCommunity');
    const tx = await this.contract.methods.asOpenCommunity().send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * build a pool community
   *
   * @returns Builder - this contract
   */
  async asPoolCommunity(): Promise<Builder> {
    this.logger.info('asPoolCommunity');
    const tx = await this.contract.methods.asPoolCommunity().send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * build ERC-721 community
   *
   * @param project the token contract address
   *
   * @returns Builder - this contract
   */
  async asErc721Community(project: string): Promise<Builder> {
    this.logger.info('asErc721Community');
    const tx = await this.contract.methods.asErc721Community(project).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * build Closed ERC-721 community
   *
   * @param project the token contract address
   * @param tokenThreshold the number of tokens required to propose
   *
   * @returns Builder - this contract
   */
  async asClosedErc721Community(project: string, tokenThreshold: number): Promise<Builder> {
    this.logger.info('asClosedErc721Community');
    const tx = await this.contract.methods.asClosedErc721Community(project).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * append a voter for a pool community
   *
   * @param voter the wallet address
   *
   * @returns Builder - this contract
   */
  async withVoter(voter: string): Promise<Builder> {
    this.logger.info(`withVoter ${voter}`);
    const tx = await this.contract.methods.withName(voter).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the voting weight for each authorized voter
   *
   * @param weight the voting weight
   *
   * @returns Builder - this contract
   */
  async withWeight(weight: number): Promise<Builder> {
    this.logger.info(`withWeight ${weight}`);
    const tx = await this.contract.methods.withWeight(weight).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the minimum quorum for this community
   *
   * @param quorum the minimum quorum
   *
   * @returns Builder - this contract
   */
  async withQuorum(quorum: number): Promise<Builder> {
    this.logger.info(`withQuorum ${quorum}`);
    const tx = await this.contract.methods.withQuorum(quorum).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the minimum vote delay for the community
   *
   * @param delay - minimum vote delay in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  async withMinimumVoteDelay(delay: number): Promise<Builder> {
    this.logger.info(`withMinimumVoteDelay ${delay}`);
    const tx = await this.contract.methods.withMinimumVoteDelay(delay).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the maximum vote delay for the community
   *
   * @param delay - maximum vote delay in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  async withMaximumVoteDelay(delay: number): Promise<Builder> {
    this.logger.info(`withMaximumVoteDelay ${delay}`);
    const tx = await this.contract.methods.withMaximumVoteDelay(delay).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the minimum vote duration for the community
   *
   * @param duration - minimum vote duration in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  async withMinimumVoteDuration(duration: number): Promise<Builder> {
    this.logger.info(`withMinimumVoteDuration ${duration}`);
    const tx = await this.contract.methods.withMinimumVoteDuration(duration).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * set the maximum vote duration for the community
   *
   * @param duration - maximum vote duration in Ethereum (epoch) seconds
   *
   * @returns Builder - this contract
   */
  async withMaximumVoteDuration(duration: number): Promise<Builder> {
    this.logger.info(`withMaximumVoteDuration ${duration}`);
    const tx = await this.contract.methods.withMaximumVoteDuration(duration).send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(tx);
    return this;
  }

  /**
   * Build the contract with the configured settings.
   *
   * @returns string - The address of the newly created contract
   */
  async build(): Promise<string> {
    this.logger.info('Building Community Class');
    const buildTx = await this.contract.methods.build().send({
      from: this.wallet.getAddress(),
      gas: this.gas,
    });
    this.logger.info(buildTx);

    const event: EventData = buildTx.events['CommunityClassCreated'];
    const classAddress = event.returnValues['class'];
    if (classAddress) {
      return classAddress;
    }
    throw new Error('Unknown CommunityClass created');
  }
}

export { CommunityBuilder };
