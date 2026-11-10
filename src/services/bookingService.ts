import { prisma } from "../config/prisma";

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
      // 2.1 Verificação de Idempotência: se o mesmo usuário já submeteu reserva para este quarto e período
      const existingUserBooking = await tx.booking.findFirst({
        where: {
          userId: data.userId,
          roomId: data.roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          status: { in: ["CONFIRMED", "PENDING"] },
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
        // Retorna a reserva existente de forma idempotente sem duplicar o registro
        return existingUserBooking;
      }

      // 2.2 Verificação de Conflito de Overbooking com outros hóspedes
      const existingBooking = await tx.booking.findFirst({
        where: {
          roomId: data.roomId,
          status: { in: ["CONFIRMED", "PENDING"] },
          OR: [
            {
              checkIn: { lte: checkOutDate },
              checkOut: { gte: checkInDate },
            },
          ],
        },
      });

      if (existingBooking) {
        throw new Error(
          "O quarto selecionado já possui reserva confirmada para este período.",
        );
      }

      return await tx.booking.create({
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
          status: "CONFIRMED",
        },
        include: {
          room: {
            include: {
              hotel: true, // Inclui o hotel através da relação com Room
            },
          },
        },
      });
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
      // Idempotente: se já estiver confirmada, retorna diretamente
      return {
        ...booking,
        hotel: booking.room.hotel,
      };
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
    };
  }

  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: {
            hotel: true, // Inclui o hotel associado ao quarto reservado
          },
        },
      },
      orderBy: { checkIn: "desc" },
    });

    // Mapeia e deduplica defensivamente por ID e por acomodação/datas
    const seenIds = new Set<string>();
    const seenTrips = new Set<string>();
    const uniqueBookings: typeof bookings = [];

    for (const booking of bookings) {
      if (seenIds.has(booking.id)) continue;
      seenIds.add(booking.id);

      const tripKey = `${booking.roomId}_${booking.checkIn.toISOString()}_${booking.checkOut.toISOString()}`;
      if (seenTrips.has(tripKey)) continue;
      seenTrips.add(tripKey);

      uniqueBookings.push(booking);
    }

    return uniqueBookings.map((booking) => ({
      ...booking,
      hotel: booking.room.hotel,
    }));
  }
}
