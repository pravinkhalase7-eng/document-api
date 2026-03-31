import { Worker } from "bullmq";
import { generateThumbnail } from "../services/thumbnail.service";
import { connectDB } from "../config/db";

(async () => {
  await connectDB();

  new Worker(
    "thumbnail-queue",
    async (job) => {
      const { docId, s3Key } = job.data;

      console.log("🔥 Processing:", docId);

      await generateThumbnail(docId, s3Key);
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "redis",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }
  );
})();