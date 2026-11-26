import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";
import {
  authMiddleware,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();
const notificationController = new NotificationController();

// Todas as rotas de notificações exigem autenticação
router.use(authMiddleware as any);

router.get("/", (req, res) =>
  notificationController.list(req as AuthenticatedRequest, res),
);

router.patch("/read-all", (req, res) =>
  notificationController.markAllAsRead(req as AuthenticatedRequest, res),
);

router.patch("/:id/read", (req, res) =>
  notificationController.markAsRead(req as AuthenticatedRequest, res),
);

router.delete("/:id", (req, res) =>
  notificationController.delete(req as AuthenticatedRequest, res),
);

router.delete("/", (req, res) =>
  notificationController.deleteAll(req as AuthenticatedRequest, res),
);

router.post("/broadcast", requireAdmin as any, (req, res) =>
  notificationController.broadcast(req as AuthenticatedRequest, res),
);

export default router;
