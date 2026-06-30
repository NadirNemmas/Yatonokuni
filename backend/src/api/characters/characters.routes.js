import express from "express";

const router = express.Router();

/**
 * @swagger
 * /characters:
 *   post:
 *     summary: Créer un personnage
 *     tags: [Characters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               userId:     { type: string, example: "uuid-1234" }
 *               name:       { type: string, example: "Aragorn" }
 *               item_level: { type: integer, example: 1500 }
 *     responses:
 *       201:
 *         description: Personnage créé
 *       400:
 *         description: Nom manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/", async (req, res, next) => {
  try {
    const { userId, name, item_level } = req.body;
    if (!name) return res.status(400).json({ message: "Missing name" });

    const created = await insertCharacter(userId, name, item_level);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /characters/{userId}:
 *   get:
 *     summary: Récupérer les personnages d'un utilisateur
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: false
 *         schema: { type: string }
 *         description: ID de l'utilisateur (optionnel — tous si absent)
 *     responses:
 *       200:
 *         description: Liste des personnages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:         { type: integer }
 *                   name:       { type: string }
 *                   item_level: { type: integer }
 *                   userId:     { type: string }
 */
router.get("/:userId?", async (req, res, next) => {
  try {
    const userId = req.params.userId || req.query.userId || null;
    const rows = await getCharactersByUser(userId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
