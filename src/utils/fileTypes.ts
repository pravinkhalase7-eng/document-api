import path from "path";

export const getFileType = (fileName: string) => {
  const ext = path.extname(fileName).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp", ".heic"].includes(ext)) {
    return "image";
  }

  if (ext === ".pdf") return "pdf";

  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) {
    return "video";
  }

  return "unknown";
};