import { prisma } from "../config/prisma";

export interface SuggestionResult {
  id: string;
  title: string;
  subtitle: string;
  type: "city" | "district" | "airport";
  value: string;
}

export class SuggestionService {
  async getSuggestions(query: string = ""): Promise<SuggestionResult[]> {
    const normalizedQuery = query.trim();

    // Busca os hotéis cadastrados no banco
    const hotels = await prisma.hotel.findMany({
      where: normalizedQuery
        ? {
            OR: [
              { city: { contains: normalizedQuery, mode: "insensitive" } },
              { state: { contains: normalizedQuery, mode: "insensitive" } },
              { address: { contains: normalizedQuery, mode: "insensitive" } },
              { name: { contains: normalizedQuery, mode: "insensitive" } },
            ],
          }
        : undefined,
      select: {
        id: true,
        city: true,
        state: true,
        address: true,
      },
      take: 10,
    });

    // Agrupa cidades únicas encontradas nos hotéis
    const citySuggestions: SuggestionResult[] = Array.from(
      new Set(hotels.map((h) => `${h.city}, ${h.state}`)),
    ).map((loc) => {
      const [city, state] = loc.split(", ");
      return {
        id: `city-${city.toLowerCase().replace(/\s+/g, "-")}`,
        title: city,
        subtitle: `${state}, Brasil`,
        type: "city",
        value: city,
      };
    });

    // Sugestões populares por defeito caso o banco tenha poucas cidades
    const fallbackDefaults: SuggestionResult[] = [
      {
        id: "rio",
        title: "Rio de Janeiro",
        subtitle: "Rio de Janeiro, Brasil",
        type: "city",
        value: "Rio de Janeiro",
      },
      {
        id: "copacabana",
        title: "Copacabana",
        subtitle: "Rio de Janeiro, Rio de Janeiro, Brasil",
        type: "district",
        value: "Copacabana",
      },
      {
        id: "ilheus",
        title: "Ilhéus",
        subtitle: "Bahia, Brasil",
        type: "city",
        value: "Ilhéus",
      },
      {
        id: "porto-seguro",
        title: "Porto Seguro",
        subtitle: "Bahia, Brasil",
        type: "city",
        value: "Porto Seguro",
      },
    ];

    const merged = [...citySuggestions, ...fallbackDefaults];
    const uniqueMap = new Map<string, SuggestionResult>();

    merged.forEach((item) => {
      if (!uniqueMap.has(item.title.toLowerCase())) {
        uniqueMap.set(item.title.toLowerCase(), item);
      }
    });

    let results = Array.from(uniqueMap.values());

    if (normalizedQuery) {
      results = results.filter((item) =>
        `${item.title} ${item.subtitle}`
          .toLowerCase()
          .includes(normalizedQuery.toLowerCase()),
      );
    }

    return results.slice(0, 7);
  }
}
