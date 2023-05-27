import { Client } from 'node-zookeeper-client';
import type { Zookeeper } from '../zookeeper';

export interface WatchdogConfig {
  client: Client;
  threshold: number;
  sequencePath: string;
  killAfterInactive?: boolean;
  log?: (...args: any[]) => void;
}

export interface WatchdogState {
  client: ReturnType<typeof Zookeeper>;
  threshold: number;
  sequencePath: string;
  lastActive: number;
  killAfterInactive?: boolean;
  log?: (...args: any[]) => void;
}
