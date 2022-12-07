# Collective Governance TypeScript API

### Installation

### npm

```
 $  npm install @momentranks/governance
```

#### Yarn

```
 $  yarn add @momentranks/governance
```

#### Usage

Connect an existing Governance contract from the builder address and build transaction id

```

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
} from '@momentranks/governance';
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
    const abiPath = 'node_modules/@momentranks/governance/abi';
    const builderAddress = '0xd64f3Db037B263D54561a2cc9885Db370B51E354';
    const maximumGas = 10000000;
    const buildTransaction = '0x0f7f3e13055547b8b6ac5b28285abc960266c6297094ab451ca9de318cbf5906';

    const web3 = new Web3(rpcUrl);

    const wallet = new EthWallet(privateKey, web3);
    wallet.connect();
    const builder = new GovernanceBuilder(abiPath, builderAddress, web3, wallet, maximumGas);
    const contractAddress = await builder.discoverContractAddress(buildTransaction);
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
