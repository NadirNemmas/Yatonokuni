const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion PostgreSQL avec pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // obligatoire sur Render
});

// Tester la connexion dès le lancement
pool
  .connect()
  .then((client) => {
    console.log("✅ Connexion à PostgreSQL réussie");
    client.release(); // libère le client pour le pool
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à PostgreSQL :", err.message);
    process.exit(1); // arrête le serveur si la DB ne fonctionne pas
  });

// Route simple de test
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(
      `Bienvenue sur YatoNoKuni 🐉<br>Heure du serveur : ${result.rows[0].now}`
    );
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération de la date.");
  }
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur le port ${port}`);
});
