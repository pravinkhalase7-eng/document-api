// controllers/folder.controller.ts
import * as folderService from "../services/folder.service";
import { getUserByIdService } from "../services/user.service";

export const createFolder = async (req: any, res: any) => {
  try {


      const existing = await folderService.getFolderByName(req.body.name);
      if (existing) {
        return res.status(400).json({ message: "Folder already exists" });
      }
    

    const folder = await folderService.createFolder({
      ...req.body,
      name: req.body.name,
      userId: req.user.userId ,
      parentId: req.body.parentId || null,
    });

    res.json(folder);
  } catch (err:any) {
    res.status(500).json({ error: err?.message });
  }
};

export const getFolders = async (req: any, res: any) => {
    console.log('getting folder for user', req.user.userId);
  const folders = await folderService.getFolders(
    req.user.userId
  );
  res.json(folders);
};

export const getFoldersByParent = async (req: any, res: any) => {
    console.log('getting folder for user', req.user.userId);
  const folders = await folderService.getFoldersByParentId(
    req.user.userId
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
  await folderService.deleteFolder(req.params.docId);
  res.json({ message: "Folder deleted" });
};

export const deleteAll = async (req: any, res: any) => {
  await folderService.deleteAllFolders();
  res.json({ message: "All Folder deleted" });
};