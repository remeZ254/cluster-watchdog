import { Client } from 'node-zookeeper-client';

export const Zookeeper = (client: Client) => ({
  exists: async (path: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
      client.exists(path, (error, stat) => {
        error && reject();
        resolve(!!stat);
      });
    }),
  create: async (path: string, data: string): Promise<string> =>
    new Promise((resolve, reject) => {
      client.create(path, Buffer.from(data), (error, createdPath) => {
        error && reject();
        resolve(createdPath);
      });
    }),
  getData: async (path: string): Promise<string> =>
    new Promise((resolve, reject) => {
      client.getData(path, (error, data: Buffer) => {
        error && reject();
        resolve(data.toString('utf8'));
      });
    }),
  setData: async (path: string, data: string): Promise<void> =>
    new Promise((resolve, reject) => {
      client.setData(path, Buffer.from(data), (error) => (error ? reject() : resolve()));
    }),
});
