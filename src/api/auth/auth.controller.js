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
  console.log("POST /auth/login body:", req.body);
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Champs manquants" });
    }

    const result = await loginUser({ email, password });
    console.log("loginUser result:", result);

    // retourne toujours un objet JSON
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    // log complet (stack)
    console.error("Login error stack:", err && (err.stack || err));

    // détermine un statut fiable
    const status = err?.status || err?.statusCode || 401;
    const message = err?.message || "Unauthorized";

    return res.status(status).json({ ok: false, message });
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

export const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = await getUserByToken(token);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: err.message || "Invalid token" });
  }
};
