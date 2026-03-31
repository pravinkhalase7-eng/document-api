import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

export const Document = mongoose.model("Document", documentSchema);