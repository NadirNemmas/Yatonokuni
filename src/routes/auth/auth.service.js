import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error("Mot de passe incorrect");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
}

export async function createUser({ email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error("Email déjà utilisé");
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await db.query(
    "INSERT INTO users (email, password_hash, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
    [email, hash, "user"]
  );

  return result.rows[0];
}
