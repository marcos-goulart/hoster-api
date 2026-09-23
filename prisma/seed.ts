import { prisma } from "../src/config/prisma";

async function main() {
  console.log("🌱 A iniciar o seeding da base de dados...");

  // Limpa registos antigos para evitar duplicações
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();

  // 1. Hotel 1: Grand Palace Resort
  const hotel1 = await prisma.hotel.create({
    data: {
      name: "Grand Palace Resort & Spa",
      description:
        "Resort de luxo localizado à beira-mar, oferecendo experiências exclusivas de relaxamento, gastronomia internacional e vista panorâmica.",
      address: "Avenida Atlântica, 1500",
      city: "Rio de Janeiro",
      state: "RJ",
      ratingScore: 4.9,
      reviewCount: 128,
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.1189498075317!2d-43.1802778!3d-22.9691667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997fd51034f82f%3A0xb33405c1d6837910!2sCopacabana!5e0!3m2!1spt-BR!2sbr!4v1690000000000!5m2!1spt-BR!2sbr",
      photos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: [
        "Piscina Infinita",
        "Wi-Fi de Alta Velocidade",
        "Spa & Massagem",
        "Restaurante Gourmet",
        "Estacionamento Gratuito",
        "Ar-Condicionado",
      ],
      rooms: {
        create: [
          {
            title: "Suíte Presidencial Vista Mar",
            subtitle: "65m² • Cama King • Varanda Privativa",
            pricePerNight: 850.0,
            capacity: 2,
            isAvailable: true,
            tags: [
              "Café da manhã incluso",
              "Vista Mar",
              "Banheira de Hidromassagem",
            ],
          },
          {
            title: "Quarto Deluxe Duplo",
            subtitle: "40m² • 2 Camas Queen • Vista Cidade",
            pricePerNight: 480.0,
            capacity: 4,
            isAvailable: true,
            tags: ["Café da manhã incluso", "Ar-Condicionado", 'TV 55"'],
          },
        ],
      },
      reviews: {
        create: [
          {
            userName: "Ana Silva",
            userAvatar: "https://i.pravatar.cc/150?img=1",
            rating: 5,
            stayDate: "Agosto de 2026",
            comment:
              "Experiência fantástica! O atendimento foi impecável e a vista do quarto é espetacular.",
          },
          {
            userName: "Carlos Oliveira",
            userAvatar: "https://i.pravatar.cc/150?img=3",
            rating: 5,
            stayDate: "Julho de 2026",
            comment:
              "Pequeno-almoço maravilhoso e piscina incrível. Voltarei com certeza!",
          },
        ],
      },
    },
  });

  // 2. Hotel 2: Pousada Villa das Águas
  const hotel2 = await prisma.hotel.create({
    data: {
      name: "Pousada Villa das Águas",
      description:
        "Refúgio aconchegante cercado pela natureza, ideal para casais que procuram tranquilidade e conforto.",
      address: "Rua das Flores, 88",
      city: "Búzios",
      state: "RJ",
      ratingScore: 4.7,
      reviewCount: 84,
      photos: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: [
        "Piscina Aquecida",
        "Wi-Fi Grátis",
        "Pequeno-almoço Colonial",
        "Pet Friendly",
      ],
      rooms: {
        create: [
          {
            title: "Chalé Master com Lareira",
            subtitle: "45m² • Cama King • Varanda com Rede",
            pricePerNight: 390.0,
            capacity: 2,
            isAvailable: true,
            tags: ["Pequeno-almoço incluso", "Lareira", "Pet Friendly"],
          },
        ],
      },
    },
  });

  console.log(`✅ Seeding concluído com sucesso!`);
  console.log(`Hotéis criados: ${hotel1.name}, ${hotel2.name}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
