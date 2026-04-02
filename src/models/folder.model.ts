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

    color: { type: String, required: false },

    icon: { type: String, required: false },

    parentId: {
      type: String,
      ref: "Folder",
      default: null, // root folder
    },
  },
  { timestamps: true },
);

export const Folder = mongoose.model("Folder", folderSchema);
