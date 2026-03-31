import sharp from "sharp";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { s3 } from "../utils/s3";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Document } from "../models/document.model";
import { getFileType } from "../utils/fileTypes";

const execAsync = promisify(exec);
const BUCKET = process.env.AWS_BUCKET_NAME!;

export const generateThumbnail = async (docId: string, s3Key: string) => {
  try {
    let fileName = path.basename(s3Key);
    fileName = fileName.replace(/\s+/g, "_");
    const ext = path.extname(fileName).toLowerCase();
    const basePath = path.dirname(s3Key);

    console.log("📥 Downloading:", s3Key);

    // 1️⃣ Download file
    const response: any = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: s3Key })
    );

    const chunks: Buffer[] = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const fileType = getFileType(fileName);

    let thumbnailBuffer: Buffer;
    let thumbKey: string;

    // ================= IMAGE =================
    if (fileType === "image") {
      console.log("🖼 Processing IMAGE");

      thumbnailBuffer = await sharp(buffer)
        .resize(300)
        .webp({ quality: 60 })
        .toBuffer();

      thumbKey = `${basePath}/thumbnail_${fileName.replace(ext, ".webp")}`;
    }

    // ================= PDF =================
    else if (fileType === "pdf") {
      console.log("📄 Processing PDF");

      const tempPdf = `/tmp/${fileName}`;
      const tempImage = `/tmp/${fileName}.png`;

      fs.writeFileSync(tempPdf, buffer);

      // Convert first page → image
      await execAsync(
        `pdftoppm -png -f 1 -singlefile ${tempPdf} ${tempImage.replace(".png", "")}`
      );

      const imageBuffer = fs.readFileSync(tempImage);

      thumbnailBuffer = await sharp(imageBuffer)
        .resize(300)
        .webp({ quality: 60 })
        .toBuffer();

      thumbKey = `${basePath}/thumbnail_${fileName.replace(ext, ".webp")}`;

      fs.unlinkSync(tempPdf);
      fs.unlinkSync(tempImage);
    }

    // ================= VIDEO =================
    else if (fileType === "video") {
      console.log("🎬 Processing VIDEO");

      const tempVideo = `/tmp/${fileName}`;
      const tempImage = `/tmp/${fileName}.jpg`;

      fs.writeFileSync(tempVideo, buffer);

      // Extract frame at 1 second
      await execAsync(
        `ffmpeg -i ${tempVideo} -ss 00:00:01 -vframes 1 ${tempImage}`
      );

      const imageBuffer = fs.readFileSync(tempImage);

      thumbnailBuffer = await sharp(imageBuffer)
        .resize(300)
        .webp({ quality: 60 })
        .toBuffer();

      thumbKey = `${basePath}/thumbnail_${fileName.replace(ext, ".webp")}`;

      fs.unlinkSync(tempVideo);
      fs.unlinkSync(tempImage);
    }

    // ================= UNKNOWN =================
    else {
      console.log("⚠️ Unsupported file type");
      return;
    }

    console.log("📤 Uploading:", thumbKey);

    // Upload thumbnail
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: thumbKey,
        Body: thumbnailBuffer,
        ContentType: "image/webp",
      })
    );

    // Update DB
    await Document.updateOne(
      { docId },
      { thumbnailKey: thumbKey }
    );

    console.log("✅ Done:", docId);

    return thumbKey;
  } catch (error) {
    console.error("❌ Thumbnail generation failed:", error);
    throw error;
  }
};