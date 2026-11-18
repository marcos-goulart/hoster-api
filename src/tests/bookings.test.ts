import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";
import { firebaseAuth } from "../config/firebase";

describe("Bookings API Routes (Integration & Security)", () => {
  const user1Uid = "test-user-booking-1";
  const user2Uid = "test-user-booking-2";
  let hotelTestId: string;
  let roomTestId: string;

  beforeAll(async () => {
    // Mock do Firebase Auth
    vi.spyOn(firebaseAuth, "verifyIdToken").mockImplementation(
      async (token: string) => {
        if (token === "token-user-1") {
          return {
            uid: user1Uid,
            email: "user1@teste.com",
            name: "Usuário 1",
            email_verified: true,
            firebase: { sign_in_provider: "google.com" },
          } as any;
        }
        if (token === "token-user-2") {
          return {
            uid: user2Uid,
            email: "user2@teste.com",
            name: "Usuário 2",
            email_verified: true,
            firebase: { sign_in_provider: "google.com" },
          } as any;
        }
        throw new Error("Token inválido");
      },
    );

    // Cria usuários de teste
    await prisma.user.upsert({
      where: { id: user1Uid },
      update: {},
      create: {
        id: user1Uid,
        firebaseUid: user1Uid,
        name: "Usuário 1",
        email: "user1@teste.com",
      },
    });

    await prisma.user.upsert({
      where: { id: user2Uid },
      update: {},
      create: {
        id: user2Uid,
        firebaseUid: user2Uid,
        name: "Usuário 2",
        email: "user2@teste.com",
      },
    });

    // Cria hotel e quarto de teste com totalUnits = 1
    const hotel = await prisma.hotel.create({
      data: {
        name: "Hotel Teste Bookings",
        address: "Rua dos Testes, 100",
        city: "São Paulo",
        state: "SP",
        photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945"],
        amenities: ["Wi-Fi", "Piscina"],
        rooms: {
          create: [
            {
              title: "Quarto Teste Unitário",
              pricePerNight: 200,
              capacity: 2,
              totalUnits: 1, // Apenas 1 unidade para testar concorrência e liberação de estoque
            },
          ],
        },
      },
      include: {
        rooms: true,
      },
    });

    hotelTestId = hotel.id;
    roomTestId = hotel.rooms[0].id;
  });

  afterAll(async () => {
    // Limpeza completa
    await prisma.booking.deleteMany({ where: { roomId: roomTestId } });
    await prisma.room.deleteMany({ where: { id: roomTestId } });
    await prisma.hotel.deleteMany({ where: { id: hotelTestId } });
    await prisma.user.deleteMany({
      where: { id: { in: [user1Uid, user2Uid] } },
    });
  });

  // 1. Segurança & Autorização
  it("POST /api/bookings - deve rejeitar a criação de reserva sem token de autenticação", async () => {
    const response = await request(app).post("/api/bookings").send({
      hotelId: hotelTestId,
      roomId: roomTestId,
      checkIn: "2026-12-01",
      checkOut: "2026-12-05",
      totalPrice: 1000,
      guestName: "Hóspede Teste",
      guestCpf: "000.000.000-00",
      guestPhone: "(00) 00000-0000",
    });

    expect(response.status).toBe(401);
  });

  it("PATCH /api/bookings/:id/confirm - deve rejeitar confirmação sem token de autenticação", async () => {
    const response = await request(app)
      .patch("/api/bookings/some-booking-id/confirm")
      .send();

    expect(response.status).toBe(401);
  });

  it("PATCH /api/bookings/:id/cancel - deve rejeitar cancelamento sem token de autenticação", async () => {
    const response = await request(app)
      .patch("/api/bookings/some-booking-id/cancel")
      .send();

    expect(response.status).toBe(401);
  });

  it("GET /api/bookings/my-bookings - deve bloquear o acesso a histórico sem autorização", async () => {
    const response = await request(app).get("/api/bookings/my-bookings");

    expect(response.status).toBe(401);
  });

  // 2. Expiração de PENDING_PAYMENT (TTL de 2 horas) e Liberação de Estoque
  it("deve expirar PENDING_PAYMENT após 2h, liberando o quarto para nova reserva e cancelando a anterior", async () => {
    const checkIn = new Date("2026-12-01T00:00:00.000Z");
    const checkOut = new Date("2026-12-05T00:00:00.000Z");

    // Cria reserva inicial em PENDING_PAYMENT simulando criação há 3 horas (> 2h TTL)
    const expiredBooking = await prisma.booking.create({
      data: {
        userId: user1Uid,
        roomId: roomTestId,
        checkIn,
        checkOut,
        nights: 4,
        guestsCount: 2,
        roomPricePerNight: 200,
        totalPrice: 920,
        status: "PENDING_PAYMENT",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Criada há 3 horas
        guestFullName: "Usuário 1",
        guestEmail: "user1@teste.com",
        guestDocument: "111.111.111-11",
        guestPhone: "(11) 91111-1111",
      },
    });

    // Tentativa de pagamento da reserva expirada deve retornar 400
    const confirmResponse = await request(app)
      .patch(`/api/bookings/${expiredBooking.id}/confirm`)
      .set("Authorization", "Bearer token-user-1");

    expect(confirmResponse.status).toBe(400);
    expect(confirmResponse.body.error).toContain("Prazo de pagamento de 2 horas expirado");

    // Verifica que o status no banco foi atualizado para CANCELLED
    const refreshedBooking = await prisma.booking.findUnique({
      where: { id: expiredBooking.id },
    });
    expect(refreshedBooking?.status).toBe("CANCELLED");

    // Usuário 2 agora consegue reservar o mesmo quarto e período (estoque liberado)
    const newBookingResponse = await request(app)
      .post("/api/bookings")
      .set("Authorization", "Bearer token-user-2")
      .send({
        hotelId: hotelTestId,
        roomId: roomTestId,
        checkIn: "2026-12-01",
        checkOut: "2026-12-05",
        totalPrice: 920,
        guestName: "Usuário 2",
        guestCpf: "222.222.222-22",
        guestPhone: "(22) 92222-2222",
      });

    expect(newBookingResponse.status).toBe(201);
    expect(newBookingResponse.body.success).toBe(true);
    expect(newBookingResponse.body.data.status).toBe("PENDING_PAYMENT");

    // Limpa nova reserva criada
    await prisma.booking.deleteMany({ where: { id: newBookingResponse.body.data.id } });
    await prisma.booking.deleteMany({ where: { id: expiredBooking.id } });
  });

  // 3. Cancelamento Manual (> 24h antes do check-in)
  it("PATCH /api/bookings/:id/cancel - deve permitir cancelamento com mais de 24h de antecedência", async () => {
    // Check-in daqui a 5 dias (> 24h)
    const futureCheckIn = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const futureCheckOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        userId: user1Uid,
        roomId: roomTestId,
        checkIn: futureCheckIn,
        checkOut: futureCheckOut,
        nights: 2,
        guestsCount: 2,
        roomPricePerNight: 200,
        totalPrice: 520,
        status: "CONFIRMED",
        guestFullName: "Usuário 1",
        guestEmail: "user1@teste.com",
        guestDocument: "111.111.111-11",
        guestPhone: "(11) 91111-1111",
      },
    });

    const cancelResponse = await request(app)
      .patch(`/api/bookings/${booking.id}/cancel`)
      .set("Authorization", "Bearer token-user-1");

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.success).toBe(true);
    expect(cancelResponse.body.data.status).toBe("CANCELLED");

    await prisma.booking.deleteMany({ where: { id: booking.id } });
  });

  // 4. Bloqueio de Cancelamento (< 24h antes do check-in)
  it("PATCH /api/bookings/:id/cancel - deve bloquear cancelamento com menos de 24h para o check-in", async () => {
    // Check-in daqui a 10 horas (< 24h)
    const soonCheckIn = new Date(Date.now() + 10 * 60 * 60 * 1000);
    const soonCheckOut = new Date(Date.now() + 34 * 60 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        userId: user1Uid,
        roomId: roomTestId,
        checkIn: soonCheckIn,
        checkOut: soonCheckOut,
        nights: 1,
        guestsCount: 1,
        roomPricePerNight: 200,
        totalPrice: 320,
        status: "CONFIRMED",
        guestFullName: "Usuário 1",
        guestEmail: "user1@teste.com",
        guestDocument: "111.111.111-11",
        guestPhone: "(11) 91111-1111",
      },
    });

    const cancelResponse = await request(app)
      .patch(`/api/bookings/${booking.id}/cancel`)
      .set("Authorization", "Bearer token-user-1");

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.success).toBe(false);
    expect(cancelResponse.body.error).toContain("pelo menos 24 horas de antecedência");

    await prisma.booking.deleteMany({ where: { id: booking.id } });
  });

  // 5. Bloqueio de cancelamento de reserva pertencente a outro usuário
  it("PATCH /api/bookings/:id/cancel - deve proibir o cancelamento de reserva de outro usuário", async () => {
    const futureCheckIn = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const futureCheckOut = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        userId: user1Uid, // Pertence ao usuário 1
        roomId: roomTestId,
        checkIn: futureCheckIn,
        checkOut: futureCheckOut,
        nights: 2,
        guestsCount: 2,
        roomPricePerNight: 200,
        totalPrice: 520,
        status: "CONFIRMED",
        guestFullName: "Usuário 1",
        guestEmail: "user1@teste.com",
        guestDocument: "111.111.111-11",
        guestPhone: "(11) 91111-1111",
      },
    });

    // Usuário 2 tenta cancelar
    const cancelResponse = await request(app)
      .patch(`/api/bookings/${booking.id}/cancel`)
      .set("Authorization", "Bearer token-user-2");

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.error).toContain("não pertence ao usuário");

    await prisma.booking.deleteMany({ where: { id: booking.id } });
  });

  // 6. Listagem completa para voucher (GET /api/bookings/my-bookings)
  it("GET /api/bookings/my-bookings - deve retornar dados completos para emissão de voucher", async () => {
    const checkIn = new Date("2026-12-10T00:00:00.000Z");
    const checkOut = new Date("2026-12-15T00:00:00.000Z");

    const booking = await prisma.booking.create({
      data: {
        userId: user1Uid,
        roomId: roomTestId,
        checkIn,
        checkOut,
        period: "Manhã",
        nights: 5,
        guestsCount: 2,
        roomPricePerNight: 200,
        totalPrice: 1120,
        status: "CONFIRMED",
        guestFullName: "Usuário 1",
        guestEmail: "user1@teste.com",
        guestDocument: "111.111.111-11",
        guestPhone: "(11) 91111-1111",
      },
    });

    const response = await request(app)
      .get("/api/bookings/my-bookings")
      .set("Authorization", "Bearer token-user-1");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);

    const found = response.body.data.find((b: any) => b.id === booking.id);
    expect(found).toBeDefined();
    expect(found.id).toBe(booking.id);
    expect(found.status).toBe("CONFIRMED");
    expect(found.period).toBe("Manhã");
    expect(found.guests).toBe(2);
    expect(found.hotel).toBeDefined();
    expect(found.hotel.name).toBe("Hotel Teste Bookings");
    expect(found.hotel.city).toBe("São Paulo");
    expect(found.room).toBeDefined();
    expect(found.room.title).toBe("Quarto Teste Unitário");

    await prisma.booking.deleteMany({ where: { id: booking.id } });
  });
});
