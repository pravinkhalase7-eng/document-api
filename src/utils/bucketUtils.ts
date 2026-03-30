
export const generateBucketName = (email: string, userId: string): string => {
  // Normalize email
  const cleanEmail = email.toLowerCase().trim();

  // Replace invalid chars
  const sanitized = cleanEmail
    .replace(/@/g, "-at-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // Ensure max length 63
  return sanitized?.length > 63 ? userId: sanitized;
};