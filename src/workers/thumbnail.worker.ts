import { Worker } from "bullmq";
import { connectDB } from "../config/db";
import { generateThumbnail } from "../services/thumbnail.service";

(() => {
  connectDB();
  new Worker(
    "thumbnail-queue",
    async (job) => {
      console.log("Processing job:", job.id);
      // your logic
      const { docId, s3Key, fileName } = job?.data;
     await generateThumbnail(docId,s3Key, fileName);
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    },
  );
})();
