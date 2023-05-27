# Cluster Watchdog

[![npm version](https://img.shields.io/npm/v/node-standby.svg)](https://www.npmjs.com/package/cluster-watchdog)
[![npm downloads](https://img.shields.io/npm/dm/cluster-watchdog.svg)](https://www.npmjs.com/package/cluster-watchdog)

Cluster Watchdog is package for managing active-standby applications

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

import { Client, createClient } from 'node-zookeeper-client';
import { initWatchdog, runWhenActive } from './watchdog';

const createZookeeperClient = (...args: Parameters<typeof createClient>): Promise<Client> =>
  new Promise<Client>((resolve) => {
    const client: Client = createClient(...args);
    client.once('connected', () => resolve(client));
  });

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

  await initWatchdog({
    client,
    sequencePath: '/path',
    threshold: 5000,
    log: console.log,
  });

  poller();
})();


```

## License

Cluster Watchdog is licensed under the [MIT License](LICENSE).
