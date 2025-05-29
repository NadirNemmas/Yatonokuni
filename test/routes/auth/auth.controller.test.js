import supertest from "supertest";
import { app } from "../../../src/server.js";
import db from "../../../src/db.js";

const request = supertest(app);

afterAll(async () => {
  await db.end(); // Ferme la connexion PostgreSQL proprement
});

const userAccount = {
  email: "guest@yatonokuni.ca",
  password: "guest123",
};

describe("Auth tests sur le contrôleur", () => {
  it("devrait retourner 200 pour la connexion avec des identifiants valides", async () => {
    const response = await request
      .post("/auth/login")
      .send(userAccount)
      .set("Content-Type", "application/json")
      .expect(200);

    expect(response.body).toHaveProperty("token");
  });
});
