import express from "express";
import { getAllProjets } from "./projets.service.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const projets = await getAllProjets();
    res.json(projets);
  } catch (err) {
    next(err);
  }
});

export default router;
