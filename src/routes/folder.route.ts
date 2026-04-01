// routes/folder.routes.ts
import express from "express";
import * as folderController from "../controllers/folder.controller";

const router = express.Router();

router.post("/", folderController.createFolder);
router.get("/", folderController.getFolders);
router.put("/:id", folderController.updateFolder);
router.delete("/:id", folderController.deleteFolder);

export default router;