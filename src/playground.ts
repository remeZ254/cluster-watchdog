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
