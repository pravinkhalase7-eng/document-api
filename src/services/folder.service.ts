// services/folder.service.ts
import { Document } from "../models/document.model";
import { Folder } from "../models/folder.model";


  const DEFAULT_FOLDERS = [
    { name: "Personal", color: "#4A80F0", icon: "account" },
    {  name: "Finance", color: "#2BB673", icon: "currency-usd" },
    {  name: "Education", color: "#7B61FF", icon: "school" },
    {  name: "Medical", color: "#FF5A5F", icon: "medical-bag" },
    {  name: "Work", color: "#1F2A44", icon: "briefcase" },
  ];

export const createFolder = async (data: any) => {
  return await Folder.create(data);
};

export const getFolders = async (userId: string, parentId: string | null) => {
  const folderList =  await Folder.find({ userId, parentId });
  const documentList =  await Document.find({ userId, parentId });
  return [...folderList,...documentList];
};

export const updateFolder = async (id: string, name: string) => {
  return await Folder.findByIdAndUpdate(id, { name }, { new: true });
};

export const deleteFolder = async (id: string) => {
  return await Folder.findByIdAndDelete(id);
};

export const deleteAllFolders = async () => {
  return await Folder.deleteMany();
};


// 🔥 BULK CREATE DEFAULT FOLDERS
export const createDefaultFolders = async (userId: string) => {
  try {
    const foldersToInsert = DEFAULT_FOLDERS.map((folder) => ({
      ...folder,
      userId,
      type: "folder",
      parentId: null, // root level
    }));

    const folders = await Folder.insertMany(foldersToInsert);

    console.log("✅ Default folders created:", folders.length);

    return folders;
  } catch (error) {
    console.error("❌ Failed to create default folders:", error);
    throw error;
  }
};


export const getFolderByName = async (name: string) => {
  return await Folder.findOne({ name });
};
