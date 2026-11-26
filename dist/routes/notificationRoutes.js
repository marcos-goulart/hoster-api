"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireAdmin_1 = require("../middlewares/requireAdmin");
const router = (0, express_1.Router)();
const notificationController = new notificationController_1.NotificationController();
// Todas as rotas de notificações exigem autenticação
router.use(authMiddleware_1.authMiddleware);
router.get("/", (req, res) => notificationController.list(req, res));
router.patch("/read-all", (req, res) => notificationController.markAllAsRead(req, res));
router.patch("/:id/read", (req, res) => notificationController.markAsRead(req, res));
router.delete("/:id", (req, res) => notificationController.delete(req, res));
router.delete("/", (req, res) => notificationController.deleteAll(req, res));
router.post("/broadcast", requireAdmin_1.requireAdmin, (req, res) => notificationController.broadcast(req, res));
exports.default = router;
