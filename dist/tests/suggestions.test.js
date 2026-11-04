"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
(0, vitest_1.describe)("Suggestions API Routes (Integration)", () => {
    (0, vitest_1.it)("GET /api/searchSuggestions - deve retornar sugestões de busca com sucesso", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/searchSuggestions");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toBeDefined();
    });
    (0, vitest_1.it)("GET /api/searchSuggestions?q=rio - deve filtrar sugestões conforme a busca", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/api/searchSuggestions?q=rio");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body).toBeDefined();
    });
});
