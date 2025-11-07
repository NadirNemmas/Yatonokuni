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
    const { session, user } = await loginUser({ email, password });
    res.cookie("access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: session.expires_in * 1000,
    });
    res.cookie("refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    const result = { session, user };
    console.log("loginUser result:", result);

    // retourne toujours un objet JSON
    return res.status(200).json({ ok: true, user });
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
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(200).json({ ok: true, message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err && (err.stack || err));
    return res
      .status(400)
      .json({ ok: false, message: err?.message || "Logout failed" });
  }
};

export const getUser = async (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const user = await getUserByToken(token); // ta fonction service, voir plus bas
    res.status(200).json({ user });
  } catch (err) {
    console.error("GetUser error:", err && (err.stack || err));
    res.status(401).json({ message: err.message || "Invalid token" });
  }
};
