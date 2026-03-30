import express from "express";
import { getUserInfo, login, register } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getUserInfo);

export default router;