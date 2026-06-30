import {
  loginUser,
  signupUser,
  getUserProfileById,
  logoutUser,
  updateUserProfile,
  uploadAvatar,
} from "../auth/auth.service.js";
import jwt from "jsonwebtoken";

const { SUPABASE_JWT_SECRET, SUPABASE_JWT_EXPIRY_TIME, NODE_ENV } = process.env;
if (!SUPABASE_JWT_SECRET) {
  console.error("SUPABASE_JWT_SECRET missing");
  process.exit(1);
}
const jwtExpiry = SUPABASE_JWT_EXPIRY_TIME
  ? parseInt(SUPABASE_JWT_EXPIRY_TIME, 10)
  : 3600;

// POST /auth/signup
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ ok: false, message: "Champs manquants" });

    const user = await signupUser({
      email,
      password,
      firstName,
      lastName,
    });

    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(400).json({
      ok: false,
      message: err?.message || "Signup failed",
    });
  }
};

// POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Champs manquants" });

    const { session, user } = await loginUser({ email, password });
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

    const profile = await getUserProfileById(user.id);

    return res.status(200).json({
      ok: true,
      user: {
        authUser: { id: user.id, email: user.email, user_metadata: user.user_metadata },
        profile,
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
    const token = req.cookies?.access_token_jwt;
    if (!token) return res.status(200).json({ ok: true, user: null });

    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
    const uid = decoded.sub;
    const profile = await getUserProfileById(uid);

    return res.status(200).json({
      ok: true,
      user: {
        authUser: { id: uid, email: decoded.email },
        profile,
      },
    });
  } catch (err) {
    res.clearCookie("access_token_jwt", { path: "/" });
    res.clearCookie("refresh_token", { path: "/" });
    return res.status(200).json({ ok: true, user: null });
  }
};

// PUT /auth/profile
export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies?.access_token_jwt;
    if (!token) return res.status(401).json({ ok: false, message: "Non authentifié" });

    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
    const uid = decoded.sub;

    const {
      email, username, date_of_birth,
      github_url, linkedin_url, instagram_url, website_url,
      avatar,
    } = req.body || {};

    let avatar_url;
    if (avatar) {
      avatar_url = await uploadAvatar(uid, avatar);
    }

    const profile = await updateUserProfile(uid, {
      email, username, date_of_birth,
      github_url, linkedin_url, instagram_url, website_url,
      ...(avatar_url ? { avatar_url } : {}),
    });

    return res.status(200).json({ ok: true, profile });
  } catch (err) {
    console.error("updateProfile error:", err && (err.stack || err));
    return res.status(500).json({ ok: false, message: err?.message || "Erreur serveur" });
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
