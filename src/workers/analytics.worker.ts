import { Worker } from "bullmq";
import { ClickJobData } from "../interface";
import { redisClient } from "../configs/redis.config";

const analyticsWorker = new Worker<ClickJobData>(
  "analytics_queue",
  async (job) => {
    const { shortCode, originalUrl, timestamp } = job.data;
    console.debug("Processing analytics", {
      shortCode,
      originalUrl,
      timestamp: new Date(timestamp).toISOString(),
    });
    // Here you would typically save this data to a database for later analysis
  },
  {
    connection: redisClient,
    concurrency: 5,
  }
);

analyticsWorker.on("completed", (job) => {
  console.log(`[Analytics] Job ${job.id} completed`);
});

analyticsWorker.on("failed", (job, err) => {
  console.log(`[Analytics] Job ${job?.id} failed`, err.message);
});

export default analyticsWorker;
