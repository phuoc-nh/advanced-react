import { Worker } from 'bullmq';
import { experienceQueue } from './queue';
import { EXPERIENCE_QUEUE } from '@advanced-react/shared/schema/queue'

const worker = new Worker(
  EXPERIENCE_QUEUE,
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);
    // Do background work here (e.g., DB write, email)
  },
  {
    connection: experienceQueue.opts.connection,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err}`);
});
