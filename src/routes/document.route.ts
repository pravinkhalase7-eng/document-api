import express from "express";
import {
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocumentsWithUrl,
  deleteAllDoc,
  creageDoc,
  deleteAllDocByFolder,
} from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/list", authMiddleware, getDocumentsWithUrl);
router.delete("/all", authMiddleware, deleteAllDoc);
router.delete("/:folderId", authMiddleware, deleteAllDocByFolder);
router.post("/", authMiddleware, creageDoc);
router.get("/", authMiddleware,  getDocs);
router.get("/:docId", authMiddleware, getDoc);
router.put("/:docId", authMiddleware, updateDoc);
router.delete("/:docId", authMiddleware, deleteDoc);

export default router;