import { loginUser, getUserByToken, logoutUser } from "../auth/auth.service.js";
import jwt from "jsonwebtoken";

const { SUPABASE_JWT_SECRET, SUPABASE_JWT_EXPIRY_TIME, NODE_ENV } = process.env;
if (!SUPABASE_JWT_SECRET) {
  console.error("SUPABASE_JWT_SECRET missing");
  process.exit(1);
}
const jwtExpiry = SUPABASE_JWT_EXPIRY_TIME
  ? parseInt(SUPABASE_JWT_EXPIRY_TIME, 10)
  : 3600;

export const signin = async (email, password) => {
  return await loginUser({ email, password });
};
// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Champs manquants" });

    const { session, user } = await loginUser({ email, password }); // ton service existant
    if (!session || !user)
      return res.status(401).json({ ok: false, message: "Auth failed" });

    // payload minimal
    const payload = { sub: user.id, email: user.email, role: "authenticated" };

    const signedJwt = jwt.sign(payload, SUPABASE_JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: `${jwtExpiry}s`,
    });

    // stocke le JWT signé dans un cookie HttpOnly (sécurisé en prod)
    res.cookie("access_token_jwt", signedJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: jwtExpiry * 1000,
    });

    // conserve le refresh token Supabase (optionnel) si tu veux rotation
    if (session?.refresh_token) {
      res.cookie("refresh_token", session.refresh_token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    // répond l'objet user (frontend aura accès à ça)
    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || null,
      },
      expiresIn: jwtExpiry,
    });
  } catch (err) {
    console.error("Login error:", err && (err.stack || err));
    const status = err?.status || err?.statusCode || 401;
    return res
      .status(status)
      .json({ ok: false, message: err?.message || "Unauthorized" });
  }
};

// GET /auth/user
export const getUser = async (req, res) => {
  try {
    console.log("req.cookies:", req.cookies); // debug cookies reçus
    const token = req.cookies?.access_token_jwt;
    if (!token) return res.status(200).json({ ok: true, user: null });

    const result = await getUserByToken(token);
    return res.status(200).json({ ok: true, user: result });
  } catch (err) {
    console.error("getUser error:", err && (err.stack || err));
    // en cas de token invalide on nettoie le cookie côté serveur et renvoie null
    res.clearCookie("access_token_jwt", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(200).json({ ok: true, user: null });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    // optional: appeler logoutUser() pour invalider session supabase hvis besoin
    try {
      await logoutUser();
    } catch (e) {
      // ignore si logout Supabase échoue
      console.warn("Supabase logout failed:", e && e.message);
    }

    res.clearCookie("access_token_jwt", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Logout error:", err && (err.stack || err));
    return res.status(500).json({ ok: false, message: "Logout failed" });
  }
};
