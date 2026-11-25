import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma";
import { firebaseAuth } from "../config/firebase";
import { BookingService } from "../services/bookingService";

describe("Notifications API & System (Integration, Events & RBAC)", () => {
  const guestUid = "test-user-notif-guest";
  const adminUid = "test-user-notif-admin";
  const otherUserUid = "test-user-notif-other";

  let hotelTestId: string;
  let roomTestId: string;
  const bookingService = new BookingService();

  async function ensureTestFixtures() {
    await prisma.user.upsert({
      where: { id: guestUid },
      update: { role: "GUEST" },
      create: {
        id: guestUid,
        firebaseUid: guestUid,
        name: "Hóspede Notif",
        email: "guest.notif@teste.com",
        role: "GUEST",
      },
    });

    await prisma.user.upsert({
      where: { id: adminUid },
      update: { role: "ADMIN" },
      create: {
        id: adminUid,
        firebaseUid: adminUid,
        name: "Admin Notif",
        email: "admin.notif@teste.com",
        role: "ADMIN",
      },
    });

    await prisma.user.upsert({
      where: { id: otherUserUid },
      update: { role: "GUEST" },
      create: {
        id: otherUserUid,
        firebaseUid: otherUserUid,
        name: "Outro Hóspede",
        email: "other.notif@teste.com",
        role: "GUEST",
      },
    });

    const existingHotel = await prisma.hotel.findFirst({
      where: { name: "Hotel Notificações Teste" },
      include: { rooms: true },
    });

    if (existingHotel && existingHotel.rooms.length > 0) {
      hotelTestId = existingHotel.id;
      roomTestId = existingHotel.rooms[0].id;
    } else {
      const hotel = await prisma.hotel.create({
        data: {
          name: "Hotel Notificações Teste",
          address: "Av. Alertas, 500",
          city: "Florianópolis",
          state: "SC",
          photos: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          ],
          amenities: ["Wi-Fi", "Piscina"],
          rooms: {
            create: [
              {
                title: "Suíte com Notificações",
                pricePerNight: 250,
                capacity: 2,
                totalUnits: 5,
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
    }
  }

  beforeAll(async () => {
    vi.spyOn(firebaseAuth, "verifyIdToken").mockImplementation(
      async (token: string) => {
        if (token === "token-guest") {
          return {
            uid: guestUid,
            email: "guest.notif@teste.com",
            name: "Hóspede Notif",
            email_verified: true,
            firebase: { sign_in_provider: "google.com" },
          } as any;
        }
        if (token === "token-admin") {
          return {
            uid: adminUid,
            email: "admin.notif@teste.com",
            name: "Admin Notif",
            email_verified: true,
            firebase: { sign_in_provider: "google.com" },
          } as any;
        }
        if (token === "token-other") {
          return {
            uid: otherUserUid,
            email: "other.notif@teste.com",
            name: "Outro Hóspede",
            email_verified: true,
            firebase: { sign_in_provider: "google.com" },
          } as any;
        }
        throw new Error("Token inválido");
      },
    );

    await ensureTestFixtures();
  });

  beforeEach(async () => {
    await prisma.globalNotificationReceipt.deleteMany({
      where: { userId: { in: [guestUid, adminUid, otherUserUid] } },
    });
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { userId: { in: [guestUid, adminUid, otherUserUid] } },
          { isGlobal: true, title: { contains: "Teste Broadcast" } },
        ],
      },
    });
    await prisma.booking.deleteMany({
      where: { userId: { in: [guestUid, adminUid, otherUserUid] } },
    });
  });

  afterAll(async () => {
    await prisma.globalNotificationReceipt.deleteMany({
      where: { userId: { in: [guestUid, adminUid, otherUserUid] } },
    });
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { userId: { in: [guestUid, adminUid, otherUserUid] } },
          { isGlobal: true, title: { contains: "Teste Broadcast" } },
        ],
      },
    });
    await prisma.booking.deleteMany({
      where: { userId: { in: [guestUid, adminUid, otherUserUid] } },
    });
    if (hotelTestId) {
      await prisma.hotel.delete({ where: { id: hotelTestId } }).catch(() => {});
    }
  });

  it("GET /api/notifications - deve retornar 401 se o token não for fornecido", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("deve disparar notificações automáticas nos eventos de criação, confirmação e cancelamento de reserva", async () => {
    // 1. Cria reserva -> BOOKING_CREATED
    const checkIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const checkOut = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();

    const createdBooking = await bookingService.createBooking({
      userId: guestUid,
      userEmail: "guest.notif@teste.com",
      hotelId: hotelTestId,
      roomId: roomTestId,
      checkIn,
      checkOut,
      totalPrice: 750,
      guestName: "Hóspede Notif",
      guestCpf: "111.222.333-44",
      guestPhone: "(11) 99999-0000",
    });

    const notifsAfterCreate = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");

    expect(notifsAfterCreate.status).toBe(200);
    const createdNotif = notifsAfterCreate.body.data.notifications.find(
      (n: any) => n.type === "BOOKING_CREATED",
    );
    expect(createdNotif).toBeDefined();
    expect(createdNotif.actionUrl).toBe(`/pagamento/${createdBooking.id}`);
    expect(createdNotif.isRead).toBe(false);

    // 2. Confirma reserva -> BOOKING_CONFIRMED
    await bookingService.confirmBooking(createdBooking.id, guestUid);

    const notifsAfterConfirm = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");

    const confirmedNotif = notifsAfterConfirm.body.data.notifications.find(
      (n: any) => n.type === "BOOKING_CONFIRMED",
    );
    expect(confirmedNotif).toBeDefined();
    expect(confirmedNotif.actionUrl).toBe("/minhas-viagens");

    // 3. Cancela reserva -> BOOKING_CANCELLED
    await bookingService.cancelBooking(createdBooking.id, guestUid);

    const notifsAfterCancel = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");

    const cancelledNotif = notifsAfterCancel.body.data.notifications.find(
      (n: any) => n.type === "BOOKING_CANCELLED",
    );
    expect(cancelledNotif).toBeDefined();
    expect(cancelledNotif.actionUrl).toBe("/minhas-viagens");
  });

  it("PATCH /api/notifications/:id/read e PATCH /api/notifications/read-all - deve marcar notificações como lidas", async () => {
    // Cria 2 notificações individuais
    const n1 = await prisma.notification.create({
      data: {
        userId: guestUid,
        type: "PROMOTION",
        title: "Promoção Especial 1",
        message: "Desconto de 20%",
        isRead: false,
      },
    });

    const n2 = await prisma.notification.create({
      data: {
        userId: guestUid,
        type: "PROMOTION",
        title: "Promoção Especial 2",
        message: "Desconto de 30%",
        isRead: false,
      },
    });

    // Marca a primeira como lida
    const readRes = await request(app)
      .patch(`/api/notifications/${n1.id}/read`)
      .set("Authorization", "Bearer token-guest");

    expect(readRes.status).toBe(200);
    expect(readRes.body.data.isRead).toBe(true);

    // Verifica contador
    const listRes1 = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    const updatedN1 = listRes1.body.data.notifications.find((n: any) => n.id === n1.id);
    const updatedN2 = listRes1.body.data.notifications.find((n: any) => n.id === n2.id);
    expect(updatedN1.isRead).toBe(true);
    expect(updatedN2.isRead).toBe(false);

    // Marca todas como lidas
    const readAllRes = await request(app)
      .patch("/api/notifications/read-all")
      .set("Authorization", "Bearer token-guest");
    expect(readAllRes.status).toBe(200);

    const listRes2 = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(listRes2.body.data.unreadCount).toBe(0);
  });

  it("DELETE /api/notifications/:id e DELETE /api/notifications - deve excluir notificações individualmente e em lote", async () => {
    const n1 = await prisma.notification.create({
      data: {
        userId: guestUid,
        type: "SYSTEM_ANNOUNCEMENT",
        title: "Aviso 1",
        message: "Texto 1",
      },
    });

    const n2 = await prisma.notification.create({
      data: {
        userId: guestUid,
        type: "SYSTEM_ANNOUNCEMENT",
        title: "Aviso 2",
        message: "Texto 2",
      },
    });

    // Exclui individual
    const deleteRes = await request(app)
      .delete(`/api/notifications/${n1.id}`)
      .set("Authorization", "Bearer token-guest");
    expect(deleteRes.status).toBe(200);

    const listRes = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(listRes.body.data.notifications.some((n: any) => n.id === n1.id)).toBe(false);
    expect(listRes.body.data.notifications.some((n: any) => n.id === n2.id)).toBe(true);

    // Limpa todas
    const deleteAllRes = await request(app)
      .delete("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(deleteAllRes.status).toBe(200);

    const listResAfterAll = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(listResAfterAll.body.data.notifications.length).toBe(0);
  });

  it("POST /api/notifications/broadcast - deve bloquear GUEST (403), permitir ADMIN (201) e isolar exclusão por usuário", async () => {
    // 1. GUEST tenta broadcast -> 403 Forbidden
    const guestAttempt = await request(app)
      .post("/api/notifications/broadcast")
      .set("Authorization", "Bearer token-guest")
      .send({
        type: "SYSTEM_ANNOUNCEMENT",
        title: "Teste Broadcast Tentativa",
        message: "Mensagem proibida",
      });
    expect(guestAttempt.status).toBe(403);
    expect(guestAttempt.body.success).toBe(false);

    // 2. ADMIN faz broadcast -> 201 Created
    const adminSuccess = await request(app)
      .post("/api/notifications/broadcast")
      .set("Authorization", "Bearer token-admin")
      .send({
        type: "SYSTEM_ANNOUNCEMENT",
        title: "Teste Broadcast Global Oficial",
        message: "Manutenção programada às 02:00",
        actionUrl: "/ajuda",
      });
    expect(adminSuccess.status).toBe(201);
    expect(adminSuccess.body.data.isGlobal).toBe(true);
    const globalNotifId = adminSuccess.body.data.id;

    // 3. Guest e OtherUser recebem a notificação global
    const guestList = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(guestList.body.data.notifications.some((n: any) => n.id === globalNotifId)).toBe(true);

    const otherList = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-other");
    expect(otherList.body.data.notifications.some((n: any) => n.id === globalNotifId)).toBe(true);

    // 4. Guest exclui a notificação global para si
    const deleteForGuest = await request(app)
      .delete(`/api/notifications/${globalNotifId}`)
      .set("Authorization", "Bearer token-guest");
    expect(deleteForGuest.status).toBe(200);

    // Guest não vê mais
    const guestListAfterDelete = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-guest");
    expect(
      guestListAfterDelete.body.data.notifications.some((n: any) => n.id === globalNotifId),
    ).toBe(false);

    // OtherUser AINDA VÊ a notificação global normalmente
    const otherListAfterGuestDelete = await request(app)
      .get("/api/notifications")
      .set("Authorization", "Bearer token-other");
    expect(
      otherListAfterGuestDelete.body.data.notifications.some((n: any) => n.id === globalNotifId),
    ).toBe(true);
  });
});
