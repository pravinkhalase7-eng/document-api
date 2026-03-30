import express from "express";
import {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocumentsWithUrl,
  deleteAllDoc,
} from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/list", authMiddleware, getDocumentsWithUrl);
router.post("/", authMiddleware, createDoc);
router.get("/", authMiddleware,  getDocs);
router.get("/:docId", authMiddleware, getDoc);
router.put("/:docId", authMiddleware, updateDoc);
router.delete("/:docId", authMiddleware, deleteDoc);
router.delete("/all", authMiddleware, deleteAllDoc);

export default router;