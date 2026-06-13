import { Worker, Queue, QueueEvents } from "bullmq";
import { connection } from "../shared/redis.js";

const queueName = "grantQueue";

// Create the queue
export const grantQueue = new Queue(queueName, { connection });

// Queue events (replaces QueueScheduler in BullMQ v5)
const queueEvents = new QueueEvents(queueName, { connection });
queueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${jobId} completed`);
});
queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed: ${failedReason}`);
});

// Worker processor
const worker = new Worker(
  queueName,
  async (job) => {
    console.log("Processing job:", job.id, job.data);

    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { status: "done", jobId: job.id };
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Worker completed job ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Worker failed job ${job.id}:`, err);
});
