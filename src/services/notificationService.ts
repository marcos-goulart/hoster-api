import { prisma } from "../config/prisma";
import { NotificationType } from "@prisma/client";

export interface CreateUserNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  metadata?: any;
}

export interface BroadcastNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string | null;
  metadata?: any;
}

export class NotificationService {
  /**
   * Cria uma notificação individual direcionada a um usuário específico.
   */
  async createUserNotification(data: CreateUserNotificationInput) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        isGlobal: false,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl || null,
        metadata: data.metadata || null,
      },
    });
  }

  /**
   * Cria uma notificação global (broadcast) disponível para todos os usuários.
   */
  async broadcastGlobalNotification(data: BroadcastNotificationInput) {
    return await prisma.notification.create({
      data: {
        userId: null,
        isGlobal: true,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl || null,
        metadata: data.metadata || null,
      },
    });
  }

  /**
   * Verifica e gera gatilhos de lembrete sob demanda:
   * 1. Check-in nas próximas 48h para reservas CONFIRMED
   * 2. Aviso de expiração para reservas PENDING_PAYMENT
   */
  async checkAndGenerateReminders(userId: string): Promise<void> {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // 1. Lembretes de Check-in (CONFIRMED com checkIn entre agora e 48h)
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        userId,
        status: "CONFIRMED",
        checkIn: {
          gte: now,
          lte: in48Hours,
        },
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    for (const booking of upcomingBookings) {
      const existingReminder = await prisma.notification.findFirst({
        where: {
          userId,
          type: "CHECKIN_REMINDER",
          actionUrl: "/minhas-viagens",
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Apenas 1 lembrete por dia
          },
        },
      });

      if (!existingReminder) {
        const hotelName = booking.room.hotel.name;
        const checkInDate = new Date(booking.checkIn).toLocaleDateString("pt-BR");
        await this.createUserNotification({
          userId,
          type: "CHECKIN_REMINDER",
          title: `Lembrete de Check-in: ${hotelName}`,
          message: `Seu check-in em ${hotelName} acontece em breve (${checkInDate}). Prepare suas malas!`,
          actionUrl: "/minhas-viagens",
          metadata: {
            bookingId: booking.id,
            hotelId: booking.room.hotelId,
          },
        });
      }
    }

    // 2. Lembrete de Pagamento Pendente prestes a expirar (> 1h de criação, < 2h)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 120 * 60 * 1000);

    const expiringBookings = await prisma.booking.findMany({
      where: {
        userId,
        status: { in: ["PENDING_PAYMENT", "PENDING"] },
        createdAt: {
          gte: twoHoursAgo,
          lte: oneHourAgo,
        },
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    for (const booking of expiringBookings) {
      const existingWarning = await prisma.notification.findFirst({
        where: {
          userId,
          type: "BOOKING_CREATED",
          actionUrl: `/pagamento/${booking.id}`,
        },
      });

      // Se já criou a notificação de criação mas falta o aviso crítico de menos de 1h
      const existingExpiringAlert = await prisma.notification.findFirst({
        where: {
          userId,
          type: "BOOKING_CREATED",
          title: "Sua reserva expira em menos de 1 hora!",
          actionUrl: `/pagamento/${booking.id}`,
        },
      });

      if (!existingExpiringAlert) {
        await this.createUserNotification({
          userId,
          type: "BOOKING_CREATED",
          title: "Sua reserva expira em menos de 1 hora!",
          message: `Resta pouco tempo para concluir o pagamento da sua reserva no ${booking.room.hotel.name}. Conclua agora para não perder sua vaga!`,
          actionUrl: `/pagamento/${booking.id}`,
          metadata: {
            bookingId: booking.id,
            isExpiringSoon: true,
          },
        });
      }
    }
  }

  /**
   * Retorna as notificações do usuário combinadas com notificações globais ativas.
   * Exclui globais marcadas como deletadas pelo usuário em GlobalNotificationReceipt.
   * Normaliza isRead e retorna { notifications, unreadCount }.
   */
  async getUserNotifications(userId: string) {
    // 1. Gera lembretes automáticos se aplicável
    try {
      await this.checkAndGenerateReminders(userId);
    } catch (err) {
      console.warn("⚠️ Aviso ao verificar lembretes automáticos:", err);
    }

    // 2. Busca recibos de notificações globais do usuário
    const receipts = await prisma.globalNotificationReceipt.findMany({
      where: { userId },
    });
    const receiptMap = new Map(receipts.map((r) => [r.notificationId, r]));

    // 3. Busca notificações individuais do usuário e todas as globais
    const rawNotifications = await prisma.notification.findMany({
      where: {
        OR: [{ userId }, { isGlobal: true }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Filtra e normaliza
    const activeNotifications = rawNotifications.filter((n) => {
      if (n.isGlobal) {
        const receipt = receiptMap.get(n.id);
        return !receipt || !receipt.isDeleted;
      }
      return true;
    });

    const normalized = activeNotifications.map((n) => {
      let isRead = n.isRead;
      if (n.isGlobal) {
        const receipt = receiptMap.get(n.id);
        isRead = receipt ? receipt.isRead : false;
      }

      return {
        id: n.id,
        userId: n.userId,
        isGlobal: n.isGlobal,
        type: n.type,
        title: n.title,
        message: n.message,
        actionUrl: n.actionUrl,
        metadata: n.metadata,
        isRead,
        createdAt: n.createdAt,
      };
    });

    const unreadCount = normalized.filter((n) => !n.isRead).length;
    const notifications = normalized.slice(0, 30);

    return {
      notifications,
      unreadCount,
    };
  }

  /**
   * Marca uma notificação individual ou global como lida para o usuário.
   */
  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("Notificação não encontrada.");
    }

    if (notification.isGlobal) {
      await prisma.globalNotificationReceipt.upsert({
        where: {
          userId_notificationId: {
            userId,
            notificationId,
          },
        },
        update: {
          isRead: true,
        },
        create: {
          userId,
          notificationId,
          isRead: true,
          isDeleted: false,
        },
      });

      return {
        ...notification,
        isRead: true,
      };
    }

    if (notification.userId !== userId) {
      throw new Error("Acesso não autorizado a esta notificação.");
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Marca todas as notificações (individuais e globais) como lidas para o usuário.
   */
  async markAllAsRead(userId: string) {
    // 1. Marca individuais
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // 2. Marca globais ativas
    const globalNotifications = await prisma.notification.findMany({
      where: { isGlobal: true },
    });

    for (const g of globalNotifications) {
      await prisma.globalNotificationReceipt.upsert({
        where: {
          userId_notificationId: {
            userId,
            notificationId: g.id,
          },
        },
        update: {
          isRead: true,
        },
        create: {
          userId,
          notificationId: g.id,
          isRead: true,
          isDeleted: false,
        },
      });
    }

    return { success: true };
  }

  /**
   * Exclui uma notificação:
   * - Se individual: remove do banco
   * - Se global: marca isDeleted: true no recibo do usuário
   */
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("Notificação não encontrada.");
    }

    if (notification.isGlobal) {
      await prisma.globalNotificationReceipt.upsert({
        where: {
          userId_notificationId: {
            userId,
            notificationId,
          },
        },
        update: {
          isDeleted: true,
          isRead: true,
        },
        create: {
          userId,
          notificationId,
          isDeleted: true,
          isRead: true,
        },
      });

      return { success: true };
    }

    if (notification.userId !== userId) {
      throw new Error("Acesso não autorizado a esta notificação.");
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  }

  /**
   * Exclui todas as notificações do usuário:
   * - Remove todas as individuais
   * - Marca isDeleted: true em todas as globais
   */
  async deleteAllNotifications(userId: string) {
    // 1. Remove individuais
    await prisma.notification.deleteMany({
      where: { userId },
    });

    // 2. Marca todas as globais como deletadas
    const globalNotifications = await prisma.notification.findMany({
      where: { isGlobal: true },
    });

    for (const g of globalNotifications) {
      await prisma.globalNotificationReceipt.upsert({
        where: {
          userId_notificationId: {
            userId,
            notificationId: g.id,
          },
        },
        update: {
          isDeleted: true,
          isRead: true,
        },
        create: {
          userId,
          notificationId: g.id,
          isDeleted: true,
          isRead: true,
        },
      });
    }

    return { success: true };
  }
}
