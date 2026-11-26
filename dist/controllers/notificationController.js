"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("../services/notificationService");
const notificationService = new notificationService_1.NotificationService();
class NotificationController {
    async list(req, res) {
        try {
            const userId = req.user.uid;
            const data = await notificationService.getUserNotifications(userId);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Erro ao carregar notificações.",
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = req.user.uid;
            const { id } = req.params;
            const data = await notificationService.markAsRead(userId, String(id));
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Erro ao marcar notificação como lida.",
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.uid;
            await notificationService.markAllAsRead(userId);
            res.status(200).json({ success: true, message: "Todas as notificações foram marcadas como lidas." });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Erro ao marcar todas as notificações como lidas.",
            });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.user.uid;
            const { id } = req.params;
            await notificationService.deleteNotification(userId, String(id));
            res.status(200).json({ success: true, message: "Notificação excluída com sucesso." });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message || "Erro ao excluir notificação.",
            });
        }
    }
    async deleteAll(req, res) {
        try {
            const userId = req.user.uid;
            await notificationService.deleteAllNotifications(userId);
            res.status(200).json({ success: true, message: "Todas as notificações foram excluídas com sucesso." });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Erro ao excluir todas as notificações.",
            });
        }
    }
    async broadcast(req, res) {
        try {
            const { type, title, message, actionUrl, metadata } = req.body;
            if (!type || !title || !message) {
                res.status(400).json({
                    success: false,
                    error: "Os campos type, title e message são obrigatórios.",
                });
                return;
            }
            const notification = await notificationService.broadcastGlobalNotification({
                type,
                title,
                message,
                actionUrl,
                metadata,
            });
            res.status(201).json({ success: true, data: notification });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || "Erro ao enviar notificação global.",
            });
        }
    }
}
exports.NotificationController = NotificationController;
