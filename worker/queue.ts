import { Queue } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { EXPERIENCE_QUEUE } from '@advanced-react/shared/schema/queue'

const connection: RedisOptions = {
  host: '127.0.0.1',
  port: 6379,
};

export const experienceQueue = new Queue(EXPERIENCE_QUEUE, { connection });
