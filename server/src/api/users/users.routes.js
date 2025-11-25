// src/api/users/users.routes.js
import express from "express";
import { supabase } from "../../supabaseClient.js";

const router = express.Router();

// Utilitaire pour récupérer les users (tu peux aussi l'exporter si nécessaire)
async function fetchUsersFromDb() {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
}

// GET /users  -> retourne tous les users
router.get("/", async (req, res, next) => {
  try {
    const users = await fetchUsersFromDb();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /users/:id  -> user par id (optionnel)
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error)
      return res.status(404).json({ message: "User not found", detail: error });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
