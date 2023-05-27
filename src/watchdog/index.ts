import * as process from 'process';
import { Callback, WatchdogConfig, WatchdogState } from '../types';
import { Zookeeper } from '../zookeeper';

let watchdogState: WatchdogState;

export const initWatchdog = async ({
  client,
  log,
  killAfterInactive,
  threshold,
  sequencePath,
}: WatchdogConfig) => {
  watchdogState = {
    lastActive: 0,
    client: Zookeeper(client),
    log,
    killAfterInactive,
    threshold,
    sequencePath,
  };

  if (!(await watchdogState.client.exists(watchdogState.sequencePath))) {
    await watchdogState.client.create(watchdogState.sequencePath, '0');
  }
};

const log = (...args: any[]) => {
  watchdogState.log?.('[Cluster-Watchdog]', ...args);
};

const assertActive = async () => {
  const now = Date.now();
  await watchdogState.client.setData(watchdogState.sequencePath, now.toString());
  watchdogState.lastActive = now;
};

const getLastActiveSequence = async (): Promise<number> => {
  const lastActive = await watchdogState.client.getData(watchdogState.sequencePath);
  if (isNaN(+lastActive)) {
    throw new Error(`Failed to parse path ${watchdogState.sequencePath} from zookeeper`);
  }
  return +lastActive;
};

export const runWhenActive =
  (fnc: Callback): Callback =>
  async () => {
    if (!watchdogState) {
      throw new Error(`Watchdog is not initiated, make sure to call 'initWatchdog(config)'`);
    }

    const lastActiveSequence: number = await getLastActiveSequence();

    if (watchdogState.lastActive === lastActiveSequence) {
      log('Active process running');
      await fnc();
      //TODO: what to do if threshold is lower then fnc time? eg: seq 0
      await assertActive();
    } else {
      if (watchdogState.killAfterInactive && watchdogState.lastActive) {
        log('Process killed after inactivity');
        process.exit(1);
      }

      if (lastActiveSequence + watchdogState.threshold < Date.now()) {
        log('Standby process taking charge');
        await assertActive();
        await fnc();
      }
    }
  };
