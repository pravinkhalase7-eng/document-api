import { Request, Response } from "express";
import { generateUploadUrl } from "../services/file.service";

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType } = req.body;

    if (!fileName || !mimeType) {
      return res.status(400).json({
        message: "fileName and mimeType are required",
      });
    }

    const result = await generateUploadUrl(fileName, mimeType);

    res.json({
      message: "Upload URL generated",
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate URL", error });
  }
};