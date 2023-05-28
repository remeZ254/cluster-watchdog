# Cluster Watchdog

[![npm version](https://img.shields.io/npm/v/node-standby.svg)](https://www.npmjs.com/package/cluster-watchdog)
[![npm downloads](https://img.shields.io/npm/dm/cluster-watchdog.svg)](https://www.npmjs.com/package/cluster-watchdog)

Cluster Watchdog is a lightweight package for managing active-standby clusters

## Installation

To install Cluster Watchdog, run one of the following commands:

using npm:

```shell
npm i cluster-watchdog
```

using yarn:

```shell
yarn add cluster-watchdog
```

using pnpm:

```shell
pnpm add cluster-watchdog
```

## Usage

```typescript
import { initWatchdog, runWhenActive } from 'cluster-watchdog';
import { Client, createClient } from 'node-zookeeper-client';

// Create a ZooKeeper client and connect to it
const createZookeeperClient = (connectionString: string): Promise<Client> =>
  new Promise<Client>((resolve) => {
    const client: Client = createClient(connectionString);
    client.once('connected', () => resolve(client));
  });

// A function that will execute only if the service is the primary/active
const poller = runWhenActive(async () => {
  try {
    /*
            do polling/db writing
         */
    setTimeout(poller, 1000);
  } catch (e) {
    setTimeout(poller, 3000);
  }
});

(async () => {
  const client = await createZookeeperClient('localhost:2181');

  // Initiate Watchdog Cluster
  await initWatchdog({
    client,
    sequencePath: '/path',
    threshold: 5000,
    log: console.log,
  });

  // Call the function
  poller();
})();
```

## License

Cluster Watchdog is licensed under the [MIT License](LICENSE).
