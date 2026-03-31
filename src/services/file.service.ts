import {
  GetObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { BUCKET, s3 } from "../utils/s3";
import { getUserById } from "./user.service";

export const generateUploadUrl = async (
  fileName: string,
  mimeType: string,
  userId: string,
  isLargeFile: boolean,
  uploadId: string,
  partNumber: any,
) => {
  const userInfo = await getUserById(userId);
  console.log("bucket", userInfo?.folderName);
  const key = `documents/${userInfo?.folderName}/${uuidv4()} - ${fileName}`;

  const fileUrl = `https://${BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;
  let uploadUrl = "";

  if (isLargeFile) {
    const command = new UploadPartCommand({
      Bucket: BUCKET,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });
    uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    });
  } else {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mimeType,
    });
    uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    });
  }

  return {
    uploadUrl,
    fileUrl,
    key,
  };
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
