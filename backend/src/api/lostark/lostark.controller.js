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

/**
 * @swagger
 * /lostark/accounts:
 *   get:
 *     summary: Récupérer tous les accounts Lost Ark de l'utilisateur
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 accounts:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/LostarkAccount' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const getAccounts = handle(async (req, res, uid) => {
  const accounts = await svc.getAccounts(uid);
  res.json({ ok: true, accounts });
});

/**
 * @swagger
 * /lostark/accounts:
 *   post:
 *     summary: Créer un account Lost Ark
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [region]
 *             properties:
 *               region: { type: string, example: "EUW" }
 *     responses:
 *       201:
 *         description: Account créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 account: { $ref: '#/components/schemas/LostarkAccount' }
 *       400:
 *         description: Région manquante
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const createAccount = handle(async (req, res, uid) => {
  const { region } = req.body || {};
  if (!region) return res.status(400).json({ ok: false, message: "Region requise" });
  const account = await svc.createAccount(uid, { region });
  res.status(201).json({ ok: true, account });
});

/**
 * @swagger
 * /lostark/accounts/{id}:
 *   get:
 *     summary: Récupérer un account avec tous ses personnages
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *     responses:
 *       200:
 *         description: Account avec personnages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 account: { $ref: '#/components/schemas/LostarkAccountDetail' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const getAccount = handle(async (req, res, uid) => {
  const account = await svc.getAccountWithCharacters(+req.params.id, uid);
  res.json({ ok: true, account });
});

/**
 * @swagger
 * /lostark/accounts/{id}:
 *   delete:
 *     summary: Supprimer un account et tous ses personnages
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *     responses:
 *       200:
 *         description: Account supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const deleteAccount = handle(async (req, res, uid) => {
  await svc.deleteAccount(+req.params.id, uid);
  res.json({ ok: true });
});

// ── Characters ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /lostark/accounts/{id}/characters:
 *   post:
 *     summary: Ajouter un personnage à un account
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Kazeros" }
 *               level: { type: integer, example: 60 }
 *               ilvl: { type: integer, example: 1730 }
 *               current_cp: { type: integer, example: 150000 }
 *               goal_cp: { type: integer, nullable: true, example: 200000 }
 *     responses:
 *       201:
 *         description: Personnage créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 character: { $ref: '#/components/schemas/LostarkCharacter' }
 *       400:
 *         description: Nom manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const createCharacter = handle(async (req, res, uid) => {
  const character = await svc.createCharacter(+req.params.id, uid, req.body || {});
  res.status(201).json({ ok: true, character });
});

/**
 * @swagger
 * /lostark/accounts/{id}/characters/{charId}:
 *   put:
 *     summary: Mettre à jour un personnage
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *       - in: path
 *         name: charId
 *         required: true
 *         schema: { type: integer }
 *         description: ID du personnage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Kazeros" }
 *               level: { type: integer, example: 60 }
 *               ilvl: { type: integer, example: 1730 }
 *               current_cp: { type: integer, example: 150000 }
 *               goal_cp: { type: integer, nullable: true, example: 200000 }
 *     responses:
 *       200:
 *         description: Personnage mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 character: { $ref: '#/components/schemas/LostarkCharacter' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account ou personnage introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const updateCharacter = handle(async (req, res, uid) => {
  const character = await svc.updateCharacter(+req.params.charId, +req.params.id, uid, req.body || {});
  res.json({ ok: true, character });
});

/**
 * @swagger
 * /lostark/accounts/{id}/characters/{charId}:
 *   delete:
 *     summary: Supprimer un personnage
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *       - in: path
 *         name: charId
 *         required: true
 *         schema: { type: integer }
 *         description: ID du personnage
 *     responses:
 *       200:
 *         description: Personnage supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account ou personnage introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const deleteCharacter = handle(async (req, res, uid) => {
  await svc.deleteCharacter(+req.params.charId, +req.params.id, uid);
  res.json({ ok: true });
});

// ── Main 6 ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /lostark/accounts/{id}/main6:
 *   put:
 *     summary: Définir les Main 6 d'un account (1 à 6 personnages)
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [characterIds]
 *             properties:
 *               characterIds:
 *                 type: array
 *                 maxItems: 6
 *                 items: { type: integer }
 *                 example: [1, 2, 3, 4, 5, 6]
 *     responses:
 *       200:
 *         description: Main 6 mis à jour, retourne l'account complet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 account: { $ref: '#/components/schemas/LostarkAccountDetail' }
 *       400:
 *         description: Plus de 6 personnages fournis
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const updateMain6 = handle(async (req, res, uid) => {
  const { characterIds = [] } = req.body || {};
  await svc.updateMain6(+req.params.id, uid, characterIds);
  const account = await svc.getAccountWithCharacters(+req.params.id, uid);
  res.json({ ok: true, account });
});

// ── Raids ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /lostark/accounts/{id}/characters/{charId}/raid:
 *   patch:
 *     summary: Marquer un raid comme fait ou non fait pour un personnage
 *     tags: [Lostark]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID de l'account
 *       - in: path
 *         name: charId
 *         required: true
 *         schema: { type: integer }
 *         description: ID du personnage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [raidId, done]
 *             properties:
 *               raidId: { type: string, example: "kazeros_h" }
 *               done: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Statut du raid mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 *                 character: { $ref: '#/components/schemas/LostarkCharacter' }
 *       400:
 *         description: raidId manquant
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: Account ou personnage introuvable
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
export const updateRaidStatus = handle(async (req, res, uid) => {
  const { raidId, done } = req.body || {};
  if (!raidId) return res.status(400).json({ ok: false, message: "raidId requis" });
  const character = await svc.updateRaidStatus(+req.params.charId, +req.params.id, uid, { raidId, done });
  res.json({ ok: true, character });
});
