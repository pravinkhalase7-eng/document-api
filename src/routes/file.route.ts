import express from "express";
import { getDownloadUrl, getUploadUrl } from "../controllers/file.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/presigned-url",authMiddleware, getUploadUrl);
router.get("/download/:s3Key",authMiddleware, getDownloadUrl);

export default router;