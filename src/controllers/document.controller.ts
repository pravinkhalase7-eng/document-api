import { Request, Response } from "express";
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsPaginated,
  deleteAllDocument,
} from "../services/document.service";

// Create
export const createDoc = async (req: Request, res: Response) => {
  try {
    const doc = await createDocument(req.body);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Create failed", err });
  }
};

// Get all
export const getDocs = async (_req: Request, res: Response) => {
  const docs = await getAllDocuments();
  res.json(docs);
};

// Get one
export const getDoc = async (req: Request, res: Response) => {
  const doc = await getDocumentById(req.params.docId);

  if (!doc) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(doc);
};

// Update
export const updateDoc = async (req: Request, res: Response) => {
  const doc = await updateDocument(req.params.docId, req.body);

  if (!doc) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(doc);
};

// Delete
export const deleteDoc = async (req: Request, res: Response) => {
  const doc = await deleteDocument(req.params.docId);

  if (!doc) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({ message: "Deleted successfully" });
};

// Delete
export const deleteAllDoc = async (req: Request, res: Response) => {
  const doc = await deleteAllDocument();
  res.json({ message: "Deleted successfully" });
};


export const getDocumentsWithUrl = async (_req: Request, res: Response) => {
  try {
    const page = parseInt(_req.query.page as string) || 1;
    const limit = parseInt(_req.query.limit as string) || 20;

    const result = await getDocumentsPaginated(page, limit);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};
