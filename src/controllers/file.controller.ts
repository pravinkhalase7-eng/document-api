import { Request, Response } from "express";
import { generateDownloadUrl, generateUploadUrl } from "../services/file.service";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType } = req.body;

    if (!fileName || !mimeType) {
      return res.status(400).json({
        message: "fileName and mimeType are required",
      });
    }

    const result = await generateUploadUrl(fileName, mimeType, (req as any).user?.userId);

    res.json({
      message: "Upload URL generated",
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate URL", error });
  }
  
};


// Get one
export const getDownloadUrl = async (req: Request, res: Response) => {
 const {s3Key = "" } = req.query;
  const doc = await generateDownloadUrl(s3Key);
  res.json(doc);
};
