import {
  createUser,
  loginUser,
  logoutUser,
  getUserByToken,
} from "./auth.service.js";

// Sign up
export const signin = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password || !first_name || !last_name)
    return res.status(400).json({ message: "Champs manquants" });

  try {
    const result = await createUser({ email, password, first_name, last_name });
    res.status(201).json({ message: "Utilisateur créé", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Champs manquants" });

  try {
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    await logoutUser();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get logged-in user info
export const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = await getUserByToken(token);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
