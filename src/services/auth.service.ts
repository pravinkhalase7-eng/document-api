import { User } from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import { generateBucketName } from "../utils/bucketUtils";

// Create User
export const createUser = async (email: string, password: string) => {

  const userId =uuidv4();

  const folderName = generateBucketName(email,userId);

  const user = await User.create({
    userId: uuidv4(),
    email,
    password,
    folderName
  });

  return user;
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};