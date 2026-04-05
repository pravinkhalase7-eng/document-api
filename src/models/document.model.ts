import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      required: true,
      unique: true,
    },
     userId: {
      type: String,
      ref: "User",
      required: true,
    },  
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    s3Key: {
      type: String,
      required: true,
    },
      thumbnailKey: {
      type: String,
      required: false,
    },  
     fileName: {
      type: String,
      required: false,
    },  
     fileSize: {
      type: String,
      required: false,
    },  
     contentType: {
      type: String,
      required: false,
    },
     parentFolderId: {
      type: String,
      required: false,
    },
    folderId: {
      type: String,
      ref: "Folder",
      default: null,
    },  
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

export const Document = mongoose.model("Document", documentSchema);