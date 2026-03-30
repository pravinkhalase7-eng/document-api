import { Worker } from "bullmq";
import { connectDB } from "../config/db";

(() => {
  connectDB();
  new Worker(
    "thumbnail-queue",
    async (job) => {
      console.log("Processing job:", job.id);
      // your logic
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    },
  );
})();
