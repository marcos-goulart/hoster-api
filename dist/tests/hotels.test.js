"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = require("../config/prisma");
(0, vitest_1.describe)("Hotels API Routes (Integration)", () => {
    (0, vitest_1.it)("GET /api/hotels - deve retornar a lista de hotéis com formato correto", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/hotels");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toHaveProperty("success", true);
        (0, vitest_1.expect)(Array.isArray(response.body.data)).toBe(true);
        if (response.body.data.length > 0) {
            const hotel = response.body.data[0];
            (0, vitest_1.expect)(hotel).toHaveProperty("id");
            (0, vitest_1.expect)(hotel).toHaveProperty("name");
            (0, vitest_1.expect)(hotel).toHaveProperty("price");
        }
    });
    (0, vitest_1.it)("GET /api/hotels/:id - deve retornar 404 para um ID inexistente", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/hotels/00000000-0000-0000-0000-000000000000");
        (0, vitest_1.expect)(response.status).toBe(404);
        (0, vitest_1.expect)(response.body).toHaveProperty("success", false);
        (0, vitest_1.expect)(response.body.error).toBe("Acomodação não encontrada.");
    });
    (0, vitest_1.it)("POST /api/hotels/:id/questions - deve exigir autenticação para enviar dúvida", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/hotels/some-id/questions")
            .send({ question: "O café da manhã está incluso?" });
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("GET /api/hotels - não deve incluir hotel 100% ocupado no período de datas pesquisado", async () => {
        const timestamp = Date.now();
        // 1. Cria usuário temporário para a reserva
        const testUser = await prisma_1.prisma.user.create({
            data: {
                firebaseUid: `test-uid-${timestamp}`,
                name: "Hóspede Teste Ocupação",
                email: `test-occupancy-${timestamp}@test.com`,
            },
        });
        // 2. Cria hotel de teste com quarto de totalUnits = 1
        const testHotel = await prisma_1.prisma.hotel.create({
            data: {
                name: `Hotel Teste Ocupação ${timestamp}`,
                description: "Hotel para validação de filtro de disponibilidade",
                address: "Rua Teste, 100",
                city: "Cidade Teste Ocupacao",
                state: "TO",
                ratingScore: 4.8,
                reviewCount: 5,
                rooms: {
                    create: [
                        {
                            title: "Quarto Teste Único",
                            pricePerNight: 250,
                            capacity: 2,
                            totalUnits: 1,
                            isAvailable: true,
                            tags: ["Wi-Fi"],
                        },
                    ],
                },
            },
            include: {
                rooms: true,
            },
        });
        const roomId = testHotel.rooms[0].id;
        // 3. Cria reserva ativa ocupando a única unidade de 2026-12-10 a 2026-12-15
        const booking = await prisma_1.prisma.booking.create({
            data: {
                userId: testUser.id,
                roomId: roomId,
                checkIn: new Date("2026-12-10T00:00:00.000Z"),
                checkOut: new Date("2026-12-15T00:00:00.000Z"),
                nights: 5,
                guestsCount: 2,
                roomPricePerNight: 250,
                totalPrice: 1370,
                status: "CONFIRMED",
                guestFullName: "Hóspede Teste",
                guestEmail: testUser.email,
                guestDocument: "123.456.789-00",
                guestPhone: "(11) 99999-9999",
            },
        });
        try {
            // 4. Busca com período conflitante (checkIn < searchCheckOut AND checkOut > searchCheckIn)
            // Ex: 2026-12-11 a 2026-12-14
            const busyResponse = await (0, supertest_1.default)(app_1.default).get("/api/hotels?checkIn=2026-12-11&checkOut=2026-12-14");
            (0, vitest_1.expect)(busyResponse.status).toBe(200);
            const busyHotels = busyResponse.body.data;
            const isHotelPresentWhenBusy = busyHotels.some((h) => h.id === testHotel.id);
            (0, vitest_1.expect)(isHotelPresentWhenBusy).toBe(false);
            // 5. Busca com período livre (sem sobreposição): 2026-12-16 a 2026-12-20
            const freeResponse = await (0, supertest_1.default)(app_1.default).get("/api/hotels?checkIn=2026-12-16&checkOut=2026-12-20");
            (0, vitest_1.expect)(freeResponse.status).toBe(200);
            const freeHotels = freeResponse.body.data;
            const isHotelPresentWhenFree = freeHotels.some((h) => h.id === testHotel.id);
            (0, vitest_1.expect)(isHotelPresentWhenFree).toBe(true);
        }
        finally {
            // 6. Limpeza completa dos dados criados no teste
            await prisma_1.prisma.booking.deleteMany({ where: { id: booking.id } });
            await prisma_1.prisma.room.deleteMany({ where: { id: roomId } });
            await prisma_1.prisma.hotel.deleteMany({ where: { id: testHotel.id } });
            await prisma_1.prisma.user.deleteMany({ where: { id: testUser.id } });
        }
    });
});
