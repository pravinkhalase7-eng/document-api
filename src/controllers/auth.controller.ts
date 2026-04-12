import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../services/auth.service";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken, verifyToken } from "../utils/jwt";
import { getUserById } from "../services/user.service";
import { createDefaultFolders, createFolder } from "../services/folder.service";
import axios from "axios";
import qs from "qs";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log("user is created...");
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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existing = await getUserByEmail(email);
  if (existing) {
    const token = generateToken({ userId: existing.userId });
    res.json({ existing, token });
  } else {
    const hashed = await hashPassword(password);
    const user = await createUser(email, hashed);

    const folders = await createDefaultFolders(user?.userId);

    const token = generateToken({ userId: user.userId });

    res.json({ user, token, folders });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, authToken } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = generateToken({ userId: user.userId });

  if (authToken) {
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

export const callback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    console.log("callback started..", code);
    if (!code) {
      return res.status(400).send("No code provided");
    }

    // 1. Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://doxstation.com/api/auth/callback",
        grant_type: "authorization_code",
        // code_verifier if using PKCE
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    console.log("callback tokenRes started..", tokenRes);

    const { access_token, id_token } = tokenRes.data;

    // 2. Get user info
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const user = userRes.data;

    console.log("user..", user);

    // 3. (Optional) Create user in DB

    // 4. Redirect back to app (deep link)
    res.redirect(`stickersmash://login?token=${id_token}`);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
    res.status(500).send("OAuth error");
  }
};
