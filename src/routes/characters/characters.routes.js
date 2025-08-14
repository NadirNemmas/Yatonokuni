import express from "express";
import { insertCharacter, getCharactersByUser } from "../../db.js";

const router = express.Router();

// Add a character
router.post("/", async (req, res) => {
  const { user_id, name, stats } = req.body;
  try {
    const data = await insertCharacter(user_id, name, stats);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get characters for a user
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const data = await getCharactersByUser(user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
