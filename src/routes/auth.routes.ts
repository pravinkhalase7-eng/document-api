import express from "express";
import { getUserInfo, login, register, callback, loginUser, storePKCE} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getUserInfo);
router.get("/callback", callback);
router.post("/store-pkce", storePKCE);
router.post("/user/login", loginUser);

export default router;