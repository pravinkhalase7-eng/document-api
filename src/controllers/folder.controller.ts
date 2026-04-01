// controllers/folder.controller.ts
import * as folderService from "../services/folder.service";

export const createFolder = async (req: any, res: any) => {
  try {
    const folder = await folderService.createFolder({
      name: req.body.name,
      userId: req.user.id,
      parentId: req.body.parentId || null,
    });

    res.json(folder);
  } catch (err:any) {
    res.status(500).json({ error: err?.message });
  }
};

export const getFolders = async (req: any, res: any) => {
  const folders = await folderService.getFolders(
    req.user.id,
    req.query.parentId || null
  );
  res.json(folders);
};

export const updateFolder = async (req: any, res: any) => {
  const folder = await folderService.updateFolder(
    req.params.id,
    req.body.name
  );
  res.json(folder);
};

export const deleteFolder = async (req: any, res: any) => {
  await folderService.deleteFolder(req.params.id);
  res.json({ message: "Folder deleted" });
};