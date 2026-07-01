import jwt from "jsonwebtoken";
import * as svc from "./lostark.service.js";

const { SUPABASE_JWT_SECRET } = process.env;

function getAuthUid(req, res) {
  const token = req.cookies?.access_token_jwt;
  if (!token) {
    res.status(401).json({ ok: false, message: "Non authentifié" });
    return null;
  }
  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: ["HS256"] });
    return decoded.sub;
  } catch {
    res.clearCookie("access_token_jwt", { path: "/" });
    res.status(401).json({ ok: false, message: "Token invalide" });
    return null;
  }
}

function handle(fn) {
  return async (req, res) => {
    const authUid = getAuthUid(req, res);
    if (!authUid) return;
    try {
      await fn(req, res, authUid);
    } catch (err) {
      console.error(`Lostark error [${req.method} ${req.path}]:`, err?.message);
      res.status(err?.status || 500).json({ ok: false, message: err?.message || "Erreur serveur" });
    }
  };
}

// ── Accounts ─────────────────────────────────────────────────────────────────

export const getAccounts = handle(async (req, res, uid) => {
  const accounts = await svc.getAccounts(uid);
  res.json({ ok: true, accounts });
});

export const createAccount = handle(async (req, res, uid) => {
  const { region } = req.body || {};
  if (!region) return res.status(400).json({ ok: false, message: "Region requise" });
  const account = await svc.createAccount(uid, { region });
  res.status(201).json({ ok: true, account });
});

export const getAccount = handle(async (req, res, uid) => {
  const account = await svc.getAccountWithCharacters(+req.params.id, uid);
  res.json({ ok: true, account });
});

export const deleteAccount = handle(async (req, res, uid) => {
  await svc.deleteAccount(+req.params.id, uid);
  res.json({ ok: true });
});

// ── Characters ───────────────────────────────────────────────────────────────

export const createCharacter = handle(async (req, res, uid) => {
  const character = await svc.createCharacter(+req.params.id, uid, req.body || {});
  res.status(201).json({ ok: true, character });
});

export const updateCharacter = handle(async (req, res, uid) => {
  const character = await svc.updateCharacter(+req.params.charId, +req.params.id, uid, req.body || {});
  res.json({ ok: true, character });
});

export const deleteCharacter = handle(async (req, res, uid) => {
  await svc.deleteCharacter(+req.params.charId, +req.params.id, uid);
  res.json({ ok: true });
});

// ── Main 6 ───────────────────────────────────────────────────────────────────

export const updateMain6 = handle(async (req, res, uid) => {
  const { characterIds = [] } = req.body || {};
  await svc.updateMain6(+req.params.id, uid, characterIds);
  const account = await svc.getAccountWithCharacters(+req.params.id, uid);
  res.json({ ok: true, account });
});

// ── Raids ────────────────────────────────────────────────────────────────────

export const updateRaidStatus = handle(async (req, res, uid) => {
  const { raidId, done } = req.body || {};
  if (!raidId) return res.status(400).json({ ok: false, message: "raidId requis" });
  const character = await svc.updateRaidStatus(+req.params.charId, +req.params.id, uid, { raidId, done });
  res.json({ ok: true, character });
});
