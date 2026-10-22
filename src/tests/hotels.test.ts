import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Hotels API Routes (Integration)", () => {
  it("GET /api/hotels - deve retornar a lista de hotéis com formato correto", async () => {
    const response = await request(app).get("/api/hotels");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(Array.isArray(response.body.data)).toBe(true);

    if (response.body.data.length > 0) {
      const hotel = response.body.data[0];
      expect(hotel).toHaveProperty("id");
      expect(hotel).toHaveProperty("name");
      expect(hotel).toHaveProperty("price");
    }
  });

  it("GET /api/hotels/:id - deve retornar 404 para um ID inexistente", async () => {
    const response = await request(app).get(
      "/api/hotels/00000000-0000-0000-0000-000000000000",
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body.error).toBe("Acomodação não encontrada.");
  });

  it("POST /api/hotels/:id/questions - deve exigir autenticação para enviar dúvida", async () => {
    const response = await request(app)
      .post("/api/hotels/some-id/questions")
      .send({ question: "O café da manhã está incluso?" });

    expect(response.status).toBe(401);
  });
});
