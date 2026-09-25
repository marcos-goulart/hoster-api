import express from "express";
import cors from "cors";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "./middlewares/authMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Hoster api is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/auth/me", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    message: "Token Firebase validado com sucesso!",
    user: req.user,
  });
});

export default app;
