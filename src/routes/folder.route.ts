import express from "express";
import {
createFolder,
    deleteAll,
deleteFolder,
getFolders,
getFoldersByParent,
updateFolder
} from "../controllers/folder.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware,  getFolders);
router.get("/:parentId", authMiddleware,  getFoldersByParent);
router.put("/:docId", authMiddleware, updateFolder);
router.delete("/:id", authMiddleware, deleteFolder);
router.delete("/", authMiddleware, deleteAll);

export default router;