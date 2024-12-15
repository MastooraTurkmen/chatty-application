import { config } from '@root/config';
import Logger from 'bunyan';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  log: Logger;

  constructor(cashName: string) {
    this.client = createClient({ url: config.REDIS_HOST });
    this.log = config.createLogger(cashName);
  }

  private casheError(): void {
    this.client.on('error', (error: unknown) => {
      this.log.error(error);
    });
  }
}
