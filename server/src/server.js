import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import authRoutes from "../src/api/auth/auth.routes.js";
import characterRoutes from "../src/api/characters/characters.routes.js";
import usersRoutes from "../src/api/users/users.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());

// allow dev front hosted on vite
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Dev logging simple des requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length) console.log("Body:", req.body);
  next();
});

// Routes API
app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
app.use("/users", usersRoutes);

const staticDir = path.join(__dirname, "../client/dist");
app.use(express.static(staticDir));

// Print registered routes (helpful to confirm paths)
setTimeout(() => {
  console.log("=== Registered routes ===");
  try {
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path) {
        console.log(
          Object.keys(r.route.methods).join(",").toUpperCase(),
          r.route.path
        );
      } else if (r.name === "router") {
        r.handle.stack.forEach((s) => {
          if (s.route && s.route.path) {
            console.log(
              Object.keys(s.route.methods).join(",").toUpperCase(),
              s.route.path
            );
          }
        });
      }
    });
  } catch (e) {
    console.error("Error printing routes:", e);
  }
  console.log("=========================");
}, 200);

const indexPath = path.join(staticDir, "index.html");
app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

app.get("*", (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Démarrage serveur (sauf en mode test)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
  });
}

// Error handler (dev)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && (err.stack || err));
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ message: "Internal Server Error" });
  } else {
    res.status(500).json({
      message: err?.message || "Internal Server Error",
      stack: err?.stack,
    });
  }
});

export { app };
