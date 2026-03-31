import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { BUCKET, s3 } from "../utils/s3";
import { getUserById } from "./user.service";

export const generateLargeUploadUrl = async (
  key: string,
  uploadId: string,
  partNumber: any,
) => {
  const command = new UploadPartCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  return {
    url,
  };
};

export const generateUploadUrl = async (
  fileName: string,
  mimeType: string,
  userId: string,
) => {
  const userInfo = await getUserById(userId);
  console.log("bucket", userInfo?.folderName);
  const key = `documents/${userInfo?.folderName}/${uuidv4()} - ${fileName}`;

  const fileUrl = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;
  let uploadUrl = "";

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });
  uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });

  return {
    uploadUrl,
    fileUrl,
    key,
  };
};

export const startMultiPart = async (
  key: string,
  mimeType: string,
) => {

  const command = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });
  const response = await s3.send(command);
  console.log("response", response?.UploadId);
  return { key, uploadId: response?.UploadId };
};

export const generateDownloadUrl = async (key: any) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const s3Url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 min
  });
  return { s3Url };
};

export const completeUpload = async (
  key: string,
  uploadId: string,
  parts: any,
) => {
  const command = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts, // [{ ETag, PartNumber }]
    },
  });

  const response = await s3.send(command);

  return { key, response };
};
