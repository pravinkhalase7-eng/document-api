import { Router, Request, Response } from "express";

const router = Router();

// GET Hello API
router.get("/hello", (req: Request, res: Response) => {
  res.json({
    message: "Hello from TypeScript API 🚀",
    timestamp: new Date().toISOString(),
  });
});

// POST example
router.post("/hello", (req: Request, res: Response) => {
  const { name } = req.body;

  res.json({
    message: `Hello ${name || "User"} 👋`,
  });
});

export default router;