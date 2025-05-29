// logique handlers
import { Request, Response } from "express";

export const login = (req, res) => {
  // Logique de connexion
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  res.status(200).json({ message: "Login successful" });
};

export const logout = (req, res) => {
  // Logique de déconnexion
  res.status(200).json({ message: "Logout successful" });
};

export const signin = (req, res) => {
  // Logique d'inscription
  res.status(201).json({ message: "Signin successful" });
};
