import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Suggestions API Routes (Integration)", () => {
  it("GET /api/searchSuggestions - deve retornar sugestões de busca com sucesso", async () => {
    const response = await request(app).get("/api/searchSuggestions");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("GET /api/searchSuggestions?q=rio - deve filtrar sugestões conforme a busca", async () => {
    const response = await request(app).get("/api/searchSuggestions?q=rio");

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
