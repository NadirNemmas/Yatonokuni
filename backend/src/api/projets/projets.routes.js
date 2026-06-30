import express from "express";
import { getAllProjets } from "./projets.service.js";

const router = express.Router();

/**
 * @swagger
 * /projets:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projets]
 *     responses:
 *       200:
 *         description: Liste des projets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Projet'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get("/", async (req, res, next) => {
  try {
    const projets = await getAllProjets();
    res.json(projets);
  } catch (err) {
    next(err);
  }
});

export default router;
