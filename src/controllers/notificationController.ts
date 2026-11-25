import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { NotificationService } from "../services/notificationService";

const notificationService = new NotificationService();

export class NotificationController {
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const data = await notificationService.getUserNotifications(userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao carregar notificações.",
      });
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;
      const data = await notificationService.markAsRead(userId, String(id));
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || "Erro ao marcar notificação como lida.",
      });
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      await notificationService.markAllAsRead(userId);
      res.status(200).json({ success: true, message: "Todas as notificações foram marcadas como lidas." });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao marcar todas as notificações como lidas.",
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      const { id } = req.params;
      await notificationService.deleteNotification(userId, String(id));
      res.status(200).json({ success: true, message: "Notificação excluída com sucesso." });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || "Erro ao excluir notificação.",
      });
    }
  }

  async deleteAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.uid;
      await notificationService.deleteAllNotifications(userId);
      res.status(200).json({ success: true, message: "Todas as notificações foram excluídas com sucesso." });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao excluir todas as notificações.",
      });
    }
  }

  async broadcast(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Erro ao enviar notificação global.",
      });
    }
  }
}
