import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth/auth.routes.js";
import characterRoutes from "./routes/characters/characters.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Fix ESM pour __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Routes API
app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
// Fichiers statiques
app.use(express.static(path.join(__dirname, "../views/dist")));

// Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dist/index.html"));
});

// Démarrage serveur (sauf en mode test)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
  });
}

export { app };
