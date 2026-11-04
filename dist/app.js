"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hotelRoutes_1 = __importDefault(require("./routes/hotelRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const suggestionController_1 = require("./controllers/suggestionController");
const authMiddleware_1 = require("./middlewares/authMiddleware");
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const suggestionController = new suggestionController_1.SuggestionController();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173", // Vite Dev Server
    "http://localhost:4173", // Vite Preview
    "http://127.0.0.1:8788", // Wrangler Pages Local
    "http://localhost:8788", // Wrangler Pages Local
];
// Middlewares Globais de Segurança
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const isLocalhost = origin.startsWith("http://localhost") ||
            origin.startsWith("http://127.0.0.1");
        if (isLocalhost) {
            return callback(null, true);
        }
        const allowedDomains = ["https://meu-app.pages.dev"];
        if (allowedDomains.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Bloqueado pelo CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// Rota Raiz & Healthcheck
app.get("/", (req, res) => {
    res.status(200).json({
        name: "Hoster API",
        version: "1.0.0",
        status: "Active",
        endpoints: {
            health: "/api/health",
            hotels: "/api/hotels",
            user: "/api/user/* (Protected)",
            bookings: "/api/bookings/* (Protected)",
            me: "/api/auth/me (Protected)",
        },
    });
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Hoster api is running smoothly",
        timestamp: new Date().toISOString(),
    });
});
// Módulos de Rotas da API
app.use("/api/hotels", hotelRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
// Rotas Auxiliares e de Autenticação
app.get("/api/searchSuggestions", (req, res) => suggestionController.getSuggestions(req, res));
app.get("/api/auth/me", authMiddleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token Firebase validado com sucesso!",
        user: req.user,
    });
});
// Middleware Global de Erros (Sempre no final)
app.use(errorHandler_1.errorHandler);
exports.default = app;
