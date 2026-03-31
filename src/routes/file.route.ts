import express from "express";
import { getDownloadUrl, getUploadUrl, startMultiPartUpload } from "../controllers/file.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/presigned-url",authMiddleware, getUploadUrl);
router.get("/download",authMiddleware, getDownloadUrl);
router.get("/start-multi-part",authMiddleware, startMultiPartUpload);

export default router;