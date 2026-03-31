import express from "express";
import { completeMultiPart, getDownloadUrl, getUploadUrl, startMultiPartUpload } from "../controllers/file.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/presigned-url",authMiddleware, getUploadUrl);
router.get("/download",authMiddleware, getDownloadUrl);
router.post("/start-multi-part",authMiddleware, startMultiPartUpload);
router.post("/complete-multi-part",authMiddleware, completeMultiPart);

export default router;