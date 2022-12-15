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
 * Mapping giving the addresses for a Governance System
 */
interface ContractAddress {
  governanceAddress: string;
  storageAddress: string;
  metaAddress: string;
  timelockAddress: string;
}

interface Builder {
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
   * reset the governance builder to default state
   * @returns Builder - this contract
   */
  aGovernance(): Promise<Builder>;

  /**
   * set the name for the community contract
   *
   * @param name the community name
   * @returns Builder - this contract
   */
  withName(name: string): Promise<Builder>;

  /**
   * set the url on the contract
   *
   * @param url the community url
   * @returns Builder - this contract
   */
  withUrl(url: string): Promise<Builder>;

  /**
   * set the description on the contract
   *
   * @param desc the description
   * @returns Builder - this contract
   */
  withDescription(desc: string): Promise<Builder>;

  /**
   * Add a community supervisor address to the project.  It is okay to call this method
   * more than once.  Each supervisor is added.
   *
   * @param supervisor address for the supervisor account
   * @returns Builder - this contract
   */
  withSupervisor(supervisor: string): Promise<Builder>;

  /**
   * set the community VoterClass
   *
   * @param voterClass the address of the VoterClass contract
   * @returns Builder - this contract
   */
  withVoterClassAddress(voterClass: string): Promise<Builder>;

  /**
   * set the minimum voting duration for the community
   *
   * @param duration the time in seconds
   * @returns Builder - this contract
   */
  withMinimumDuration(duration: number): Promise<Builder>;

  /**
   * Build the contract with the configured settings.
   *
   * @returns string - The address of the newly created contract
   */
  build(): Promise<string>;

  /**
   * Helper to discover the contract suite built by a previous invocation of this contract
   *
   * @param txId The transaction bearing the build call
   * @returns ContractAddress - The set of contracts constructed by the build
   */
  discoverContract(txId: string): Promise<ContractAddress>;
}

export { ContractAddress, Builder };
