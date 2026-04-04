import express from "express";
import { getUserInfo, login, register, callback} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getUserInfo);
router.get("/callback", callback);

export default router;