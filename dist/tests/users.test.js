"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
(0, vitest_1.describe)("User API Routes (Security & Favorites)", () => {
    (0, vitest_1.it)("POST /api/user/favorites - deve bloquear inclusão de favorito sem token", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/user/favorites")
            .send({ hotelId: "some-hotel-id" });
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("DELETE /api/user/favorites/:hotelId - deve bloquear remoção de favorito sem token", async () => {
        const response = await (0, supertest_1.default)(app_1.default).delete("/api/user/favorites/some-hotel-id");
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("GET /api/auth/me - deve bloquear consulta de perfil autenticado sem token", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/auth/me");
        (0, vitest_1.expect)(response.status).toBe(401);
    });
});
