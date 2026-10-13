import { prisma } from "../config/prisma";

export class UserService {
  async syncUser(uid: string, email?: string, name?: string) {
    return await prisma.user.upsert({
      where: { firebaseUid: uid },
      update: {
        email: email || "",
        ...(name && { name }),
      },
      create: {
        id: uid,
        firebaseUid: uid,
        name: name || email?.split("@")[0] || "Hóspede",
        email: email || "",
      },
    });
  }

  async getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        hotel: {
          include: {
            rooms: {
              where: { isAvailable: true },
              orderBy: { pricePerNight: "asc" },
            },
          },
        },
      },
    });

    return favorites.map((fav) => {
      const hotel = fav.hotel;
      const lowestPrice =
        hotel.rooms && hotel.rooms.length > 0
          ? Math.min(...hotel.rooms.map((r) => r.pricePerNight))
          : 0;

      return {
        ...hotel,
        price: lowestPrice,
      };
    });
  }

  async addFavorite(userId: string, hotelId: string) {
    await this.syncUser(userId);
    return await prisma.favorite.create({
      data: {
        userId,
        hotelId,
      },
    });
  }

  async removeFavorite(userId: string, hotelId: string) {
    return await prisma.favorite.deleteMany({
      where: {
        userId,
        hotelId,
      },
    });
  }
}
