import { Document } from "../models/document.model";
import { v4 as uuidv4 } from "uuid";

// Create
export const createDocument = async (data: any) => {
  const doc = await Document.create({
    docId: uuidv4(),
    ...data,
  });
  return doc;
};

// Get All
export const getAllDocuments = async () => {
  return await Document.find().lean();
};

// Get by ID
export const getDocumentById = async (docId: string) => {
  return await Document.findOne({ docId }).lean();
};

// Update
export const updateDocument = async (docId: string, data: any) => {
  return await Document.findOneAndUpdate(
    { docId },
    data,
    { new: true }
  ).lean();
};

// Delete
export const deleteDocument = async (docId: string) => {
  return await Document.findOneAndDelete({ docId });
};