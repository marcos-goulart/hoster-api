import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("Bookings API Routes (Integration & Security", () => {
  it("POST /api/bookings - deve rejeitar a criação de reserva sem token de autenticação", async () => {
    const response = await request(app).post("/api/bookings").send({
      hotelId: "some-id",
      roomId: "some-room-id",
      checkIn: "2026-11-01",
      checkOut: "2026-11-05",
      totalPrice: 1000,
      guestName: "Hóspede Teste",
      guestCpf: "000.000.000-00",
      guestPhone: "(00) 00000-0000",
    });

    expect(response.status).toBe(401);
  });

  it("GET /api/booking/my-bookings - deve bloquear o acesso a histórico sem autorização", async () => {
    const response = await request(app).get("/api/bookings/my-bookings");

    expect(response.status).toBe(401);
  });
});
