import { Router } from "express";
import { login, logout, signin, getUser } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signin", signin);
router.get("/user", getUser);

export default router;
