import { Request, Response } from "express";
import { generateDownloadUrl, generateUploadUrl, startMultiPart } from "../services/file.service";
import { CreateMultipartUploadCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET } from "../utils/s3";

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, uploadId, isLargeFile, partNumber } = req.body;

    if (!fileName || !mimeType) {
      return res.status(400).json({
        message: "fileName and mimeType are required",
      });
    }

    const result = await generateUploadUrl(fileName, mimeType, (req as any).user?.userId, uploadId , isLargeFile , partNumber);

    res.json({
      message: "Upload URL generated",
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate URL", error });
  }
  
};

export const startMultiPartUpload = async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType } = req.body;

    if (!fileName || !mimeType) {
      return res.status(400).json({
        message: "fileName and mimeType are required",
      });
    }

   const result = await startMultiPart(fileName,mimeType, (req as any).user?.userId)

   return result;

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to startMultiPartUpload URL", error });
  }
  
};


// Get one
export const getDownloadUrl = async (req: Request, res: Response) => {
 const {s3Key = "" } = req.query;
  const doc = await generateDownloadUrl(s3Key);
  res.json(doc);
};
