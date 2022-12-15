# Collective Governance TypeScript API

This is a typescript wrapper around the Collective Governance Contract deployed to Ethereum

#### Deployments

- [Read the Docs](https://collectivexyz.github.io/governance)
- [Release Builds](https://github.com/collectivexyz/governance/pkgs/npm/governance)

### Installation

#### npm

```
 $  npm install @collectivexyz/governance
```

#### Yarn

```
 $  yarn add @collectivexyz/governance
```

### Usage

#### Simple example to connect to the governance contract.

```ts
import { EthWallet, Governance, GovernanceBuilder, CollectiveGovernance } from '@collectivexyz/governance';
import Web3 from 'web3';

export async function connect(): Promise<Governance> {
  try {
    const rpcUrl = 'wss://localhost:8545';
    const privateKey = 'XXXXXXXXXXXX';
    const abiPath = 'node_modules/@collectivexyz/governance/abi';
    const builderAddress = '0xd64f3Db037B263D54561a2cc9885Db370B51E354';
    const buildTransaction = '0x0f7f3e13055547b8b6ac5b28285abc960266c6297094ab451ca9de318cbf5906';
    const maximumGas = 600000;

    const web3 = new Web3(rpcUrl);

    const wallet = new EthWallet(privateKey, web3);
    wallet.connect();
    const builder = new GovernanceBuilder(abiPath, builderAddress, web3, wallet, maximumGas);
    const contractAddress = await builder.discoverContract(buildTransaction);
    const governance = new CollectiveGovernance(abiPath, contractAddress.governanceAddress, web3, wallet, maximumGas);
    const name = await governance.name();
    const version = await governance.version();

    return governance;
  } catch (error) {
    throw new Error('Run failed');
  }
}
```

#### More complete example

Connect to an existing Governance contract with a builder address and build transaction id

```ts
import {
  Wallet,
  EthWallet,
  Storage,
  Governance,
  Meta,
  GovernanceBuilder,
  CollectiveGovernance,
  MetaStorage,
  CollectiveStorage,
} from '@collectivexyz/governance';
import Web3 from 'web3';

export interface Collective {
  governance: Governance;
  storage: Storage;
  meta: Meta;
  web3: Web3;
  wallet: Wallet;
}

export async function connect(): Promise<Collective> {
  try {
    const rpcUrl = 'wss://localhost:8545';
    const privateKey = 'XXXXXXXXXXXX';
    const abiPath = 'node_modules/@collectivexyz/governance/abi';
    const builderAddress = '0xd64f3Db037B263D54561a2cc9885Db370B51E354';
    const buildTransaction = '0x0f7f3e13055547b8b6ac5b28285abc960266c6297094ab451ca9de318cbf5906';
    const maximumGas = 600000;

    const web3 = new Web3(rpcUrl);

    const wallet = new EthWallet(privateKey, web3);
    wallet.connect();
    const builder = new GovernanceBuilder(abiPath, builderAddress, web3, wallet, maximumGas);
    const contractAddress = await builder.discoverContract(buildTransaction);
    const governance = new CollectiveGovernance(abiPath, contractAddress.governanceAddress, web3, wallet, maximumGas);
    const name = await governance.name();
    const version = await governance.version();
    const metaAddress = contractAddress.metaAddress;
    const meta = new MetaStorage(abiPath, metaAddress, web3);
    const metaName = await meta.name();
    const metaVersion = await meta.version();
    if (version !== metaVersion) {
      throw new Error('MetaStorage version mismatch');
    }
    const community = await meta.community();
    console.log(`Community: ${community}`);
    const communityUrl = await meta.url();
    console.log(`Community Url: ${communityUrl}`);
    const description = await meta.description();
    console.log(`Description: ${description}`);

    const storageAddress = contractAddress.storageAddress;
    const storage = new CollectiveStorage(abiPath, storageAddress, web3);
    const storageVersion = await storage.version();

    if (version != storageVersion) {
      throw new Error('Storage version mismatch');
    }

    return { governance, storage, meta, web3, wallet };
  } catch (error) {
    throw new Error('Run failed');
  }
}
```
