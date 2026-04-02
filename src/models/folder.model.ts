// models/folder.model.ts
import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    userId: {
      type: String,
      ref: "User",
      required: true,
    },

    type: { type: String, required: true },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null, // root folder
    },
  },
  { timestamps: true }
);

export const Folder = mongoose.model("Folder", folderSchema);