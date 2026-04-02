import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../services/auth.service";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken, verifyToken } from "../utils/jwt";
import { getUserById } from "../services/user.service";
import { createDefaultFolders, createFolder } from "../services/folder.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('user is created...')
  const existing = await getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await hashPassword(password);
  const user = await createUser(email, hashed);

  const folders = await createDefaultFolders(user?.userId);

  const token = generateToken({ userId: user.userId });

  res.json({ user, token, folders });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, authToken } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
    const token = generateToken({ userId: user.userId });

  if(authToken){
    res.json({ token });
  }

  const isValid = await comparePassword(password, user.password);
  
  if (!isValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({ token });
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    const decoded: any = verifyToken(token);

    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...safeUser } = user;
    return res.json({ user: safeUser });

  } catch (err: any) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};