import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET, s3 } from "../utils/s3";
import { v4 as uuidv4 } from "uuid";


export const generateUploadUrl = async (
  fileName: string,
  mimeType: string
) => {
  const key = `uploads/${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  const fileUrl = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;

  return {
    uploadUrl,
    fileUrl,
    key,
  };
};

export const generateDownloadUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const s3Url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 min
  });
  return { s3Url };
};