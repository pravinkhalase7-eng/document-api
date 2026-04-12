import express from "express";
import { getUserInfo, login, register, callback, loginUser} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getUserInfo);
router.get("/callback", callback);
router.get("/store-pkce", callback);
router.post("/user/login", loginUser);

export default router;