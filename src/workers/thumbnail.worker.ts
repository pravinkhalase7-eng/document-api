import { Worker } from "bullmq";
import { generateThumbnail } from "../services/thumbnail.service";

new Worker(
  "thumbnail-queue",
  async (job) => {
    const { docId, s3Key } = job.data;

    console.log("🔥 Processing job:", job.id);

    await generateThumbnail(docId, s3Key);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  }
);