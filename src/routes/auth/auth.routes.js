// cotients les routes vers login, logout, signin
import { Router } from "express";
import { login, logout, signin } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signin", signin);

export default router;
