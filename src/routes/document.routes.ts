import express from "express";
import {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "../controllers/document.controller";

const router = express.Router();

router.post("/", createDoc);
router.get("/", getDocs);
router.get("/:docId", getDoc);
router.put("/:docId", updateDoc);
router.delete("/:docId", deleteDoc);

export default router;