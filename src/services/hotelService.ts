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
    const searchTerm = city?.trim().toLowerCase() || "";

    if (!searchTerm) {
      const whereClause: any = {};
      this.applyFilters(whereClause, { minPrice, maxPrice, guests, amenities });

      const hotels = await prisma.hotel.findMany({
        where: whereClause,
        include: {
          rooms: {
            where: { isAvailable: true },
            orderBy: { pricePerNight: "asc" },
          },
        },
        orderBy: [{ ratingScore: "desc" }],
      });

      return { hotels, searchScope: "all", searchTerm: "" };
    }

    // PASSO 1: Procura se a cidade/termo pesquisado já existe diretamente no banco
    const directMatch = await prisma.hotel.findFirst({
      where: {
        OR: [
          { city: { contains: searchTerm, mode: "insensitive" } },
          { state: { equals: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { state: true },
    });

    // Se a cidade existe no banco (ex: Búzios -> RJ), usa a UF dela.
    // Se não existe, busca por qualquer hotel do banco para pegar o estado padrão ou aplicar fallback.
    const targetState = directMatch?.state || null;

    // PASSO 2: Puxa TODOS os resultados do estado no banco
    const whereClause: any = {};

    if (targetState) {
      whereClause.state = { equals: targetState, mode: "insensitive" };
    } else {
      // Se a cidade não foi achada no banco (ex: Magé), puxa todos os hotéis do estado RJ como padrão
      whereClause.state = { equals: "RJ", mode: "insensitive" };
    }

    this.applyFilters(whereClause, { minPrice, maxPrice, guests, amenities });

    let hotels = await prisma.hotel.findMany({
      where: whereClause,
      include: {
        rooms: {
          where: { isAvailable: true },
          orderBy: { pricePerNight: "asc" },
        },
      },
      orderBy: [{ ratingScore: "desc" }],
    });

    // PASSO 3: Ordena colocando a cidade pesquisada (Búzios) no topo
    if (hotels.length > 0) {
      hotels.sort((a, b) => {
        const aIsCity = a.city.toLowerCase().includes(searchTerm);
        const bIsCity = b.city.toLowerCase().includes(searchTerm);

        if (aIsCity && !bIsCity) return -1;
        if (!aIsCity && bIsCity) return 1;
        return (b.ratingScore ?? 0) - (a.ratingScore ?? 0);
      });

      return { hotels, searchScope: "state_results", searchTerm: city || "" };
    }

    // Fallback de segurança se a tabela estiver vazia
    hotels = await prisma.hotel.findMany({
      take: 6,
      include: {
        rooms: {
          where: { isAvailable: true },
          orderBy: { pricePerNight: "asc" },
        },
      },
      orderBy: [{ ratingScore: "desc" }],
    });

    return { hotels, searchScope: "fallback", searchTerm: city || "" };
  }

  private applyFilters(
    whereClause: any,
    filters: {
      minPrice?: number;
      maxPrice?: number;
      guests?: number;
      amenities?: string[];
    },
  ) {
    const { minPrice, maxPrice, guests, amenities } = filters;

    if (amenities && amenities.length > 0) {
      whereClause.amenities = { hasEvery: amenities };
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
  }

  async getHotelById(id: string) {
    return await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: { where: { isAvailable: true } },
        reviews: { orderBy: { createdAt: "desc" } },
      },
    });
  }
}
