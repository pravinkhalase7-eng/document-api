import sharp from "sharp";
import { s3 } from "../utils/s3";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Document } from "../models/document.model";
import path from "path";
import heicConvert from "heic-convert";

const BUCKET = process.env.AWS_BUCKET_NAME!;

// 🔥 MAIN SERVICE
export const generateThumbnail = async (docId: string, s3Key: string, fileName:  string) => {
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


    const s3BaseUrl = path.dirname(s3Key);
    const fileName = path.basename(s3Key);
    
    let inputBuffer = buffer;
    if (fileName.toLowerCase().endsWith(".heic")) {
    console.log("🔄 Converting HEIC → JPEG");

    inputBuffer = await heicConvert({
        buffer,
        format: "JPEG",
        quality: 0.8,
    });
    }
    console.log("🖼 Generating thumbnail...");

    // 2️⃣ Generate thumbnail using sharp
    const thumbnailBuffer = await sharp(buffer)
      .resize(300) // width = 300px
      .jpeg({ quality: 60 })
      .toBuffer();


    // 3️⃣ Create thumbnail key
    const thumbKey = `${s3BaseUrl}/thumbnail_${fileName}`

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