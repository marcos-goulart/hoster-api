import express from "express";
import cors from "cors";
import hotelRoutes from "./routes/hotelRoutes";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "./middlewares/authMiddleware";

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

// Módulo de Hotéis (Rotas Públicas de Leitura)
app.use("/api/hotels", hotelRoutes);

// Rota de Teste Protegida (Firebase JWT)
app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Token Firebase validado com sucesso!",
    user: req.user,
  });
});

export default app;
