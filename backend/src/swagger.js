import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yato no Kuni API",
      version: "1.0.0",
      description: "Documentation de l'API Yato no Kuni",
    },
    servers: [
      { url: "http://localhost:8000", description: "Développement" },
      { url: "https://yatonokuni.onrender.com", description: "Production" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "access_token_jwt",
          description: "JWT stocké dans un cookie HttpOnly",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-1234" },
            email: { type: "string", example: "user@example.com" },
            display_name: { type: "string", example: "John Doe" },
          },
        },
        Projet: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "GameMasterArtefact" },
            description: { type: "string" },
            slug: { type: "string", example: "/projects/gamemasterartefact" },
            technologies: { type: "array", items: { type: "string" } },
            git_repo: { type: "string", example: "https://github.com/..." },
          },
        },
        Error: {
          type: "object",
          properties: {
            ok: { type: "boolean", example: false },
            message: { type: "string", example: "Erreur" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "api/**/*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);
