import express from "express";
import cors from "cors";
import helmet from "helmet";
import hotelRoutes from "./routes/hotelRoutes";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { SuggestionController } from "./controllers/suggestionController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "./middlewares/authMiddleware";

const suggestionController = new SuggestionController();
const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Vite Dev Server
  "http://localhost:4173", // Vite Preview
  "http://127.0.0.1:8788", // Wrangler Pages Local
  "http://localhost:8788", // Wrangler Pages Local
];

// Middlewares Globais de Segurança
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isLocalhost =
        origin.startsWith("http://localhost") ||
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
  }),
);

app.use(express.json());

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
app.use("/api/hotels", hotelRoutes);
app.use("/api/user", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Rotas Auxiliares e de Autenticação
app.get("/api/searchSuggestions", (req, res) =>
  suggestionController.getSuggestions(req, res),
);

app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Token Firebase validado com sucesso!",
    user: req.user,
  });
});

// Middleware Global de Erros (Sempre no final)
app.use(errorHandler);

export default app;
