import express from "express";
import {
createFolder,
    deleteAll,
deleteFolder,
getFolders,
updateFolder
} from "../controllers/folder.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware,  getFolders);
router.put("/:docId", authMiddleware, updateFolder);
router.delete("/:docId", authMiddleware, deleteFolder);
router.delete("/", authMiddleware, deleteAll);

export default router;