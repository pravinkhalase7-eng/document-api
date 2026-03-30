import sharp from "sharp";
import { s3 } from "../utils/s3";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Document } from "../models/document.model";

const BUCKET = process.env.AWS_BUCKET_NAME!;

// 🔥 MAIN SERVICE
export const generateThumbnail = async (docId: string, s3Key: string) => {
  try {
    console.log("📥 Downloading original:", s3Key);

    // 1️⃣ Download original image from S3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
    });

    const response: any = await s3.send(getCommand);
    const stream = response.Body;

    // Convert stream → buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    console.log("🖼 Generating thumbnail...");

    // 2️⃣ Generate thumbnail using sharp
    const thumbnailBuffer = await sharp(buffer)
      .resize(300) // width = 300px
      .jpeg({ quality: 60 })
      .toBuffer();

    // 3️⃣ Create thumbnail key
    const thumbKey = s3Key.replace("originals", "thumbnails");

    console.log("📤 Uploading thumbnail:", thumbKey);

    // 4️⃣ Upload thumbnail to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: thumbKey,
        Body: thumbnailBuffer,
        ContentType: "image/jpeg",
      })
    );

    // 5️⃣ Update DB
    await Document.updateOne(
      { docId },
      { thumbnailKey: thumbKey }
    );

    console.log("✅ Thumbnail generated for:", docId);

    return thumbKey;
  } catch (error) {
    console.error("❌ Thumbnail generation failed:", error);
    throw error;
  }
};