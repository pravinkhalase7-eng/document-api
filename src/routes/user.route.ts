import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  deleteAllUsers,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createUser);
router.get("/", authMiddleware, getUsers);
router.get("/:id",authMiddleware,  getUserById);
router.delete("/",authMiddleware,  deleteAllUsers);
router.delete("/:id",authMiddleware, deleteUser);

export default router;