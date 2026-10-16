import { prisma } from "../config/prisma";

export interface HotelSearchQuery {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: string[];
}

export interface CreateQuestionDTO {
  hotelId: string;
  userId: string;
  userName?: string;
  userAvatar?: string | null;
  question: string;
}

export class HotelService {
  /**
   * Método auxiliar para calcular e anexar o menor preço de quarto (diária)
   * diretamente na propriedade `price` de cada hotel.
   */
  private formatHotelList(hotels: any[]) {
    return hotels.map((hotel) => {
      const lowestRoomPrice =
        hotel.rooms && hotel.rooms.length > 0
          ? Math.min(...hotel.rooms.map((r: any) => r.pricePerNight))
          : 0;

      return {
        ...hotel,
        price: lowestRoomPrice,
      };
    });
  }

  async listHotels(filters: HotelSearchQuery) {
    const { city, minPrice, maxPrice, guests, amenities } = filters;
    const searchTerm = city?.trim().toLowerCase() || "";

    // CASO 1: Busca geral (Sem termo de cidade)
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

      return {
        hotels: this.formatHotelList(hotels),
        searchScope: "all",
        searchTerm: "",
      };
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

    const targetState = directMatch?.state || null;

    // PASSO 2: Puxa os resultados do estado no banco
    const whereClause: any = {};

    if (targetState) {
      whereClause.state = { equals: targetState, mode: "insensitive" };
    } else {
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

    // PASSO 3: Ordena colocando a cidade pesquisada no topo
    if (hotels.length > 0) {
      hotels.sort((a, b) => {
        const aIsCity = a.city.toLowerCase().includes(searchTerm);
        const bIsCity = b.city.toLowerCase().includes(searchTerm);

        if (aIsCity && !bIsCity) return -1;
        if (!aIsCity && bIsCity) return 1;
        return (b.ratingScore ?? 0) - (a.ratingScore ?? 0);
      });

      return {
        hotels: this.formatHotelList(hotels),
        searchScope: "state_results",
        searchTerm: city || "",
      };
    }

    // PASSO 4: Fallback de segurança se não houver resultados no estado
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

    return {
      hotels: this.formatHotelList(hotels),
      searchScope: "fallback",
      searchTerm: city || "",
    };
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
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        rooms: { where: { isAvailable: true } },
        reviews: {
          take: 3, // Limite de até 3 avaliações na página de detalhes
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }], // As melhores e mais recentes
        },
        questions: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    });

    if (!hotel) return null;

    const [formattedHotel] = this.formatHotelList([hotel]);
    return formattedHotel;
  }

  async createQuestion(data: CreateQuestionDTO) {
    // Atualiza ou cria o usuário mantendo o nome e o avatar sincronizados com o Firebase Auth
    await prisma.user.upsert({
      where: { id: data.userId },
      update: {
        ...(data.userName ? { name: data.userName } : {}),
        ...(data.userAvatar ? { avatar: data.userAvatar } : {}),
      },
      create: {
        id: data.userId,
        firebaseUid: data.userId,
        name: data.userName || "Hóspede",
        email: `${data.userId}@guest.com`,
        avatar: data.userAvatar || null,
      },
    });

    return await prisma.hotelQuestion.create({
      data: {
        hotelId: data.hotelId,
        userId: data.userId,
        question: data.question,
      },
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });
  }
}
