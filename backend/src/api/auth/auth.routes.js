import { Router } from "express";
import { login, logout, signup, getUser } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.get("/user", getUser);

export default router;
