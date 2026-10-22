import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("User API Routes (Security & Favorites)", () => {
  it("POST /api/user/favorites - deve bloquear inclusão de favorito sem token", async () => {
    const response = await request(app)
      .post("/api/user/favorites")
      .send({ hotelId: "some-hotel-id" });

    expect(response.status).toBe(401);
  });

  it("DELETE /api/user/favorites/:hotelId - deve bloquear remoção de favorito sem token", async () => {
    const response = await request(app).delete(
      "/api/user/favorites/some-hotel-id",
    );

    expect(response.status).toBe(401);
  });

  it("GET /api/auth/me - deve bloquear consulta de perfil autenticado sem token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });
});
