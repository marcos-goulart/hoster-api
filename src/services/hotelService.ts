import { prisma } from "../config/prisma";

export interface HotelSearchQuery {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: string[];
}

export class HotelService {
  async listHotels(filters: HotelSearchQuery) {
    const { city, minPrice, maxPrice, guests, amenities } = filters;

    const whereClause: any = {};

    if (city) {
      whereClause.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (amenities && amenities.length > 0) {
      whereClause.amenities = {
        hasEvery: amenities,
      };
    }

    if (
      minPrice !== undefined ||
      maxPrice !== undefined ||
      guests !== undefined
    ) {
      whereClause.rooms = {
        some: {
          isAvailable: true,
          ...(guests ? { capacity: { gte: Number(guests) } } : {}),
          ...(minPrice !== undefined || maxPrice !== undefined
            ? {
                pricePerNight: {
                  ...(minPrice !== undefined ? { gte: Number(minPrice) } : {}),
                  ...(maxPrice !== undefined ? { lte: Number(maxPrice) } : {}),
                },
              }
            : {}),
        },
      };
    }

    return await prisma.hotel.findMany({
      where: whereClause,
      include: {
        rooms: {
          where: { isAvailable: true },
          orderBy: { pricePerNight: "asc" },
        },
      },
      orderBy: { ratingScore: "desc" },
    });
  }

  async getHotelById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: {
          where: { isAvailable: true },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return hotel;
  }
}
