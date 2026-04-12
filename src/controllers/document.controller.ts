import { Request, Response } from "express";
import {
  getDocumentById,
  updateDocument,
  getDocumentsPaginated,
  deleteAllDocument,
  deleteDocumentsById,
  createDocument,
  getDocuments,
  getDocumentsPaginatedByFolderId,
  deleteAllDocumentByFolderId,
  getDocumentsPaginatedByUserId,
} from "../services/document.service";

// Create
// export const createDoc = async (req: Request, res: Response) => {
//   try {
//     const doc = await createDocument(req.body);
//     res.json(doc);
//   } catch (err) {
//     res.status(500).json({ message: "Create failed", err });
//   }
// };

// Get all
// export const getDocs = async (_req: Request, res: Response) => {
//   const docs = await getAllDocuments();
//   res.json(docs);
// };

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
// export const deleteDoc = async (req: Request, res: Response) => {
//   const doc = await deleteDocument(req.params.docId);

//   if (!doc) {
//     return res.status(404).json({ message: "Not found" });
//   }

//   res.json({ message: "Deleted successfully" });
// };

// Delete
export const deleteAllDoc = async (req: Request, res: Response) => {
  const doc = await deleteAllDocument();
  res.json({ message: "Deleted successfully" });
};

export const deleteAllDocByFolder = async (req: Request, res: Response) => {
  const doc = await deleteAllDocumentByFolderId(req.params.folderId);
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

export const getDocumentsWithUrlByusers = async (_req: any, res: Response) => {
  try {
    const page = parseInt(_req.query.page as string) || 1;
    const limit = parseInt(_req.query.limit as string) || 20;
    const userId = _req.query.userId;

    const result = await getDocumentsPaginatedByUserId(page, limit, userId || _req?.user?.userId);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};


// controllers/document.controller.ts

export const creageDoc = async (req: any, res: any) => {
  const doc = await createDocument({
    ...req.body,
    userId: req.user.userId,
  });

  res.json(doc);
};

export const getDocs = async (req: any, res: any) => {
   const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const folderId = req.query.folderId ;
    const result = await getDocumentsPaginatedByFolderId(page, limit, folderId, req.user.userId);

    console.log('result',result);
    
  res.json(result);
};

export const deleteDoc = async (req: any, res: any) => {

 const doc = await getDocumentById(req.params.id);

 console.log('deleting the document', doc);
  if (!doc) {
    return res.status(404).json({ message: "Not found" });
  }
  await deleteDocumentsById(req.params.id);
  res.json({ message: "Deleted" });
};