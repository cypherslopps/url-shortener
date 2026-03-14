import { Queue } from "bullmq";
import { redisClient } from "../configs/redis.config";
import { ClickJobData } from "../interface";

export const analyticsQueue = new Queue<ClickJobData>("analytics_queue", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
