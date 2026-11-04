"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
(0, vitest_1.describe)("Bookings API Routes (Integration & Security", () => {
    (0, vitest_1.it)("POST /api/bookings - deve rejeitar a criação de reserva sem token de autenticação", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/api/bookings").send({
            hotelId: "some-id",
            roomId: "some-room-id",
            checkIn: "2026-11-01",
            checkOut: "2026-11-05",
            totalPrice: 1000,
            guestName: "Hóspede Teste",
            guestCpf: "000.000.000-00",
            guestPhone: "(00) 00000-0000",
        });
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("GET /api/booking/my-bookings - deve bloquear o acesso a histórico sem autorização", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/bookings/my-bookings");
        (0, vitest_1.expect)(response.status).toBe(401);
    });
});
