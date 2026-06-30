import { Router } from "express";
import { login, logout, signup, getUser } from "./auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Créer un compte
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password]
 *             properties:
 *               firstName: { type: string, example: "John" }
 *               lastName:  { type: string, example: "Doe" }
 *               email:     { type: string, example: "john@example.com" }
 *               password:  { type: string, example: "motdepasse123" }
 *     responses:
 *       200:
 *         description: Compte créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:   { type: boolean, example: true }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Champs manquants ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/signup", signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: "john@example.com" }
 *               password: { type: string, example: "motdepasse123" }
 *     responses:
 *       200:
 *         description: Connexion réussie — cookie JWT posé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:        { type: boolean, example: true }
 *                 user:      { $ref: '#/components/schemas/User' }
 *                 expiresIn: { type: integer, example: 3600 }
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie — cookies supprimés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean, example: true }
 */
router.post("/logout", logout);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Récupérer l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur connecté ou null si non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:   { type: boolean, example: true }
 *                 user: { $ref: '#/components/schemas/User' }
 */
router.get("/user", getUser);

export default router;
