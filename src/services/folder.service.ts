// services/folder.service.ts
import { Folder } from "../models/folder.model";

export const createFolder = async (data: any) => {
  return await Folder.create(data);
};

export const getFolders = async (userId: string, parentId: string | null) => {
  return await Folder.find({ userId, parentId });
};

export const updateFolder = async (id: string, name: string) => {
  return await Folder.findByIdAndUpdate(id, { name }, { new: true });
};

export const deleteFolder = async (id: string) => {
  return await Folder.findByIdAndDelete(id);
};