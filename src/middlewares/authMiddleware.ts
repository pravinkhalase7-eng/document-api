import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: any, next: any) => {
    console.log('checkign auth');
  const token = req.headers.authorization?.split(" ")[1];
  console.log('token', token)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded: any = verifyToken(token);
    console.log('decoded', decoded)
    req.user = decoded;
    next();
  } catch(err) {
    console.log('error', err)
    res.status(401).json({ message: "Invalid token" });
  }
};