import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Document } from "../models/document.model";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET, s3 } from "../utils/s3";
import { thumbnailQueue } from "../queues/thumbnail.queue";

// Create
export const createDocument = async (data: any) => {

  const doc = await Document.create({
    docId: uuidv4(),
    ...data,
  });
  
    // 2️⃣ 🔥 Trigger queue (ADD JOB)
  await thumbnailQueue.add("generate-thumbnail", {
    docId: doc.docId,
    s3Key: doc.s3Key,
    fileName: doc.fileName
  });

  console.log('queue strted....')
  
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


// Delete
export const deleteAllDocument = async () => {
  return await Document.deleteMany();
};


export const getDocumentsPaginated = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Document.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: -1 })
      .lean(),
    Document.countDocuments(),
  ]);

  const data = await Promise.all(
    docs.map(async (doc) => {
      const command = new GetObjectCommand({
        Bucket: BUCKET,
        Key: doc?.thumbnailKey ||  doc.s3Key,
      });

      const url = await getSignedUrl(s3, command, {
        expiresIn: 3600,
      });

      return {
        docId: doc.docId,
        name: doc.name,
        category: doc.category,
        imageUrl: url,
      };
    })
  );

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};