"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../config/prisma");
class UserService {
    async syncUser(uid, email, name) {
        return await prisma_1.prisma.user.upsert({
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
    async getFavorites(userId) {
        const favorites = await prisma_1.prisma.favorite.findMany({
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
            const lowestPrice = hotel.rooms && hotel.rooms.length > 0
                ? Math.min(...hotel.rooms.map((r) => r.pricePerNight))
                : 0;
            return {
                ...hotel,
                price: lowestPrice,
            };
        });
    }
    async addFavorite(userId, hotelId) {
        await this.syncUser(userId);
        return await prisma_1.prisma.favorite.create({
            data: {
                userId,
                hotelId,
            },
        });
    }
    async removeFavorite(userId, hotelId) {
        return await prisma_1.prisma.favorite.deleteMany({
            where: {
                userId,
                hotelId,
            },
        });
    }
}
exports.UserService = UserService;
