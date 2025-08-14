// server.js
const express = require("express");
const { Pool } = require("pg"); // for PostgreSQL
const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from Supabase/Atlas
});

app.post("/create-character", async (req, res) => {
  const { userId, name, stats } = req.body;
  await pool.query(
    "INSERT INTO characters(user_id, name, stats) VALUES($1, $2, $3)",
    [userId, name, JSON.stringify(stats)]
  );
  res.send({ success: true });
});

app.get("/characters/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query("SELECT * FROM characters WHERE user_id=$1", [
    userId,
  ]);
  res.send(result.rows);
});

app.listen(3001, () => console.log("Server running on port 3001"));
