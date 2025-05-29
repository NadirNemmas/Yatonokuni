// logique handlers

import { loginUser, createUser } from "./auth.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const { token } = await loginUser({ email, password });
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await createUser({ email, password });
    res.status(201).json({ message: "Utilisateur créé", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
