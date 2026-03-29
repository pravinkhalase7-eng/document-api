import { User } from "../models/user.model";

export const createUserService = async (data: any) => {
  const user = await User.create(data);
  return user;
};

export const getUsersService = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
};

export const getUserByIdService = async (id: string) => {
  return await User.findById(id);
};

export const deleteUserService = async (id: string) => {
  return await User.findByIdAndDelete(id);
};