import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import authRoutes from "./api/auth/auth.routes.js";
import characterRoutes from "./api/characters/characters.routes.js";
import projetsRoutes from "./api/projets/projets.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length) console.log("Body:", req.body);
  next();
});

// Swagger
app.use("/swagger.html", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
app.use("/projets", projetsRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Error handler
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

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`🚀 Serveur lancé sur le port ${port}`);
  });
}

export { app };
