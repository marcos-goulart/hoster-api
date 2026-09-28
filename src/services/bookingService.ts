import { prisma } from "../config/prisma";

export interface CreateBookingDTO {
  userId: string;
  userEmail?: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
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

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const roomPricePerNight = (data.totalPrice - 120.0) / nights;

    // 2. Transação isolada para prevenir conflito de datas/overbooking
    return await prisma.$transaction(async (tx) => {
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

  async getUserBookings(userId: string) {
    return await prisma.booking.findMany({
      where: { userId },
      include: {
        hotel: true,
        room: true,
      },
      orderBy: { checkIn: "desc" },
    });
  }
}
