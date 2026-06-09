// src/api/characters/characters.routes.js
import express from "express";
const router = express.Router();

// Create character
router.post("/", async (req, res, next) => {
  try {
    // Expect body: { userId, name, item_level }
    const { userId, name, item_level } = req.body;
    if (!name) return res.status(400).json({ message: "Missing name" });

    const created = await insertCharacter(userId, name, item_level);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// Get characters for a user (or all if no userId)
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
