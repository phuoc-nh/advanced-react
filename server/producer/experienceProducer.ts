// src/producer.ts
// import { Queue } from 'bullmq';
// import { EXPERIENCE_QUEUE } from '@advanced-react/shared/schema/queue'
// 	;
// export const experienceQueue = new Queue(EXPERIENCE_QUEUE, {
//   connection: {
//     host: '127.0.0.1',
//     port: 6379,
//   },
// });

// async function run() {
//   const job = await experienceQueue.add('newExperience', {
//     userId: 'u123',
//     experienceId: 'exp456',
//   });

//   console.log('Job added with ID:', job.id);
// }

// run();
