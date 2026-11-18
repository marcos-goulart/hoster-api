import { prisma } from "../config/prisma";

export const PAYMENT_EXPIRATION_MS = 2 * 60 * 60 * 1000; // 2 horas (TTL)
export const MIN_CANCELLATION_NOTICE_MS = 24 * 60 * 60 * 1000; // 24 horas

export interface CreateBookingDTO {
  userId: string;
  userEmail?: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  period?: string;
  totalPrice: number;
  guestName: string;
  guestCpf: string;
  guestPhone: string;
  guestsCount?: number;
  status?: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

export class BookingService {
  async createBooking(data: CreateBookingDTO) {
    // 1. Sincroniza usuário
    await prisma.user.upsert({
      where: { id: data.userId },
      update: { email: data.userEmail || "" },
      create: {
        id: data.userId,
        firebaseUid: data.userId,
        name: data.guestName || "Hóspede",
        email: data.userEmail || "",
      },
    });

    // Trata parsing de datas mantendo UTC limpo caso a string seja YYYY-MM-DD
    const checkInDate = data.checkIn.includes("T")
      ? new Date(data.checkIn)
      : new Date(`${data.checkIn}T00:00:00.000Z`);

    const checkOutDate = data.checkOut.includes("T")
      ? new Date(data.checkOut)
      : new Date(`${data.checkOut}T00:00:00.000Z`);

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const roomPricePerNight = (data.totalPrice - 120.0) / nights;

    // 2. Transação isolada para prevenir conflito de datas/overbooking e garantir idempotência
    return await prisma.$transaction(async (tx) => {
      const now = new Date();
      const expirationThreshold = new Date(now.getTime() - PAYMENT_EXPIRATION_MS);

      // 2.1 Cancela automaticamente reservas PENDING_PAYMENT expiradas (> 2h) para liberar o estoque imediatamente
      await tx.booking.updateMany({
        where: {
          roomId: data.roomId,
          status: { in: ["PENDING_PAYMENT", "PENDING"] },
          createdAt: { lt: expirationThreshold },
        },
        data: {
          status: "CANCELLED",
        },
      });

      // 2.2 Verificação de Idempotência: se o mesmo usuário já submeteu reserva ativa para este quarto e período
      const existingUserBooking = await tx.booking.findFirst({
        where: {
          userId: data.userId,
          roomId: data.roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          status: { in: ["CONFIRMED", "PENDING_PAYMENT", "PENDING"] },
        },
        include: {
          room: {
            include: {
              hotel: true,
            },
          },
        },
      });

      if (existingUserBooking) {
        return {
          ...existingUserBooking,
          hotel: existingUserBooking.room.hotel,
          guests: existingUserBooking.guestsCount,
        };
      }

      // 2.3 Verificação de Conflito de Overbooking considerando totalUnits do quarto
      const room = await tx.room.findUnique({
        where: { id: data.roomId },
        select: { totalUnits: true },
      });
      const totalUnits = room?.totalUnits ?? 1;

      const conflictingCount = await tx.booking.count({
        where: {
          roomId: data.roomId,
          status: { in: ["CONFIRMED", "PENDING_PAYMENT", "PENDING"] },
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
        },
      });

      if (conflictingCount >= totalUnits) {
        throw new Error(
          "O quarto selecionado já atingiu a capacidade máxima de reservas para este período.",
        );
      }

      const initialStatus = data.status || "PENDING_PAYMENT";

      const created = await tx.booking.create({
        data: {
          userId: data.userId,
          roomId: data.roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          period: data.period || null,
          nights: nights,
          guestsCount: data.guestsCount || 1,
          roomPricePerNight:
            roomPricePerNight > 0 ? roomPricePerNight : data.totalPrice,
          totalPrice: data.totalPrice,
          guestFullName: data.guestName,
          guestEmail: data.userEmail || "",
          guestDocument: data.guestCpf,
          guestPhone: data.guestPhone,
          status: initialStatus,
        },
        include: {
          room: {
            include: {
              hotel: true,
            },
          },
        },
      });

      return {
        ...created,
        hotel: created.room.hotel,
        guests: created.guestsCount,
      };
    });
  }

  async confirmBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Reserva não encontrada ou não pertence ao usuário.");
    }

    if (booking.status === "CONFIRMED") {
      return {
        ...booking,
        hotel: booking.room.hotel,
        guests: booking.guestsCount,
      };
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Não é possível confirmar o pagamento de uma reserva cancelada.");
    }

    if (booking.status === "COMPLETED") {
      throw new Error("Esta reserva já foi concluída.");
    }

    // Validação do TTL de 2 horas para PENDING_PAYMENT
    const isExpired =
      ["PENDING_PAYMENT", "PENDING"].includes(booking.status) &&
      Date.now() - booking.createdAt.getTime() > PAYMENT_EXPIRATION_MS;

    if (isExpired) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });

      throw new Error(
        "Prazo de pagamento de 2 horas expirado. A reserva foi cancelada e o quarto liberado.",
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    return {
      ...updated,
      hotel: updated.room.hotel,
      guests: updated.guestsCount,
    };
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error("Reserva não encontrada ou não pertence ao usuário.");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Esta reserva já se encontra cancelada.");
    }

    if (booking.status === "COMPLETED") {
      throw new Error("Não é possível cancelar uma reserva já concluída.");
    }

    // Se estiver em PENDING_PAYMENT e já expirou (> 2h), cancela e bloqueia
    const isExpired =
      ["PENDING_PAYMENT", "PENDING"].includes(booking.status) &&
      Date.now() - booking.createdAt.getTime() > PAYMENT_EXPIRATION_MS;

    if (isExpired) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
      });

      throw new Error(
        "A reserva já expirou por falta de pagamento e foi cancelada.",
      );
    }

    // Regra das 24 horas antes do check-in
    const checkInTime = new Date(booking.checkIn).getTime();
    const nowTime = Date.now();
    const diffMs = checkInTime - nowTime;

    if (diffMs < MIN_CANCELLATION_NOTICE_MS) {
      throw new Error(
        "Cancelamento não permitido. O cancelamento só é permitido com pelo menos 24 horas de antecedência do check-in.",
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    return {
      ...updated,
      hotel: updated.room.hotel,
      guests: updated.guestsCount,
    };
  }

  async getUserBookings(userId: string) {
    // Sincroniza e cancela automaticamente reservas PENDING_PAYMENT com mais de 2 horas
    const expirationThreshold = new Date(Date.now() - PAYMENT_EXPIRATION_MS);
    await prisma.booking.updateMany({
      where: {
        userId,
        status: { in: ["PENDING_PAYMENT", "PENDING"] },
        createdAt: { lt: expirationThreshold },
      },
      data: { status: "CANCELLED" },
    });

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            hotel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Mapeia e deduplica defensivamente por ID
    const seenIds = new Set<string>();
    const uniqueBookings: typeof bookings = [];

    for (const booking of bookings) {
      if (seenIds.has(booking.id)) continue;
      seenIds.add(booking.id);
      uniqueBookings.push(booking);
    }

    return uniqueBookings.map((booking) => ({
      ...booking,
      hotel: booking.room.hotel,
      guests: booking.guestsCount,
    }));
  }
}
