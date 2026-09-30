import express from "express";
import cors from "cors";
import hotelRoutes from "./routes/hotelRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { SuggestionController } from "./controllers/suggestionController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "./middlewares/authMiddleware";

const suggestionController = new SuggestionController();
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota Raiz (Boas-vindas / Documentação rápida)
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

// Rotas da aplicação
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Hoster api is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Módulos da API
app.use("/api/hotels", hotelRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Módulo de Hotéis (Rotas Públicas de Leitura)
app.use("/api/hotels", hotelRoutes);

// Rota de sugestões de pesquisa
app.get("/api/searchSuggestions", (req, res) =>
  suggestionController.getSuggestions(req, res),
);

// Rota de Teste Protegida (Firebase JWT)
app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Token Firebase validado com sucesso!",
    user: req.user,
  });
});

export default app;
