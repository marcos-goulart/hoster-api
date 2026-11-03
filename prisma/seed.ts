import { prisma } from "../src/config/prisma";

interface HotelSeedData {
  name: string;
  description: string;
  about: string;
  address: string;
  city: string;
  state: string;
  ratingScore: number;
  reviewCount: number;
  mapEmbedUrl: string;
  photos: string[];
  amenities: string[];
  rooms: {
    title: string;
    subtitle: string;
    pricePerNight: number;
    capacity: number;
    totalUnits: number;
    isAvailable: boolean;
    tags: string[];
  }[];
  reviews: {
    userName: string;
    userAvatar: string;
    rating: number;
    stayDate: string;
    comment: string;
  }[];
}

const hotelsToSeed: HotelSeedData[] = [
  // 1. Rio de Janeiro (RJ) - Copacabana
  {
    name: "Copacabana Palace Grand Luxury",
    description:
      "Emblemático hotel à beira-mar de Copacabana, combinando arquitetura clássica refinada, gastronomia com estrelas Michelin e serviço de excelência internacional.",
    about:
      "Construído na década de 1920, este hotel histórico é um marco da hotelaria mundial. Situado em frente à icônica praia de Copacabana, conta com uma piscina semi-olímpica, spa com tratamentos exclusivos e três restaurantes premiados, proporcionando uma estadia inesquecível no coração do Rio de Janeiro.",
    address: "Avenida Atlântica, 1702 - Copacabana",
    city: "Rio de Janeiro",
    state: "RJ",
    ratingScore: 4.9,
    reviewCount: 342,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Avenida+Atlantica+1702+Rio+de+Janeiro&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Wi-Fi de Alta Velocidade",
      "Piscina Semi-Olímpica",
      "Café da Manhã Gourmet",
      "Spa & Massagem",
      "Restaurante Michelin",
      "Serviço de Praia",
      "Academia Moderna",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Presidencial Vista Mar",
        subtitle: "70m² • Cama Super King • Varanda Panorâmica",
        pricePerNight: 1450.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Vista Mar frontal", "Banheira de Imersão"],
      },
      {
        title: "Quarto Deluxe Frente Praia",
        subtitle: "45m² • Cama King • Varanda Privativa",
        pricePerNight: 890.0,
        capacity: 2,
        totalUnits: 8,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Vista Mar", "Ar-condicionado Split"],
      },
      {
        title: "Apartamento Executivo Cidade",
        subtitle: "36m² • Cama Queen • Mesa de Trabalho",
        pricePerNight: 620.0,
        capacity: 2,
        totalUnits: 12,
        isAvailable: true,
        tags: ["Wi-Fi rápido", "Café da manhã incluso", "Smart TV 55\""],
      },
    ],
    reviews: [
      {
        userName: "Mariana Souza Goulart",
        userAvatar: "https://i.pravatar.cc/150?img=1",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "Experiência cinematográfica! O serviço de praia e o café da manhã na pérgula da piscina são incomparáveis.",
      },
      {
        userName: "Thiago Albuquerque",
        userAvatar: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Cama incrivelmente confortável, funcionários educadíssimos e vista deslumbrante do nascer do sol em Copacabana.",
      },
    ],
  },

  // 2. São Paulo (SP) - Jardins
  {
    name: "Fasano São Paulo Jardins",
    description:
      "Elegância contemporânea e sofisticação no bairro dos Jardins, oferecendo gastronomia italiana consagrada e atmosfera intimista.",
    about:
      "Projetado por Isay Weinfeld e Márcio Kogan, o Hotel Fasano harmoniza a atmosfera clássica dos anos 1930 com o luxo contemporâneo. Localizado na charmosa Rua Vittorio Fasano, está a poucos passos das melhores boutiques da Oscar Freire e de restaurantes renomados.",
    address: "Rua Vittorio Fasano, 88 - Jardins",
    city: "São Paulo",
    state: "SP",
    ratingScore: 4.8,
    reviewCount: 228,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rua+Vittorio+Fasano+88+Sao+Paulo&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Restaurante Fasano Italiano",
      "Spa & Tratamentos Terapêuticos",
      "Academia Completa",
      "Bar de Jazz & Coquetéis",
      "Wi-Fi de Alta Velocidade",
      "Estacionamento com Manobrista",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Fasano Deluxe",
        subtitle: "60m² • Cama King de Linho Egípcio • Ducha Dupla",
        pricePerNight: 1350.0,
        capacity: 2,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Café da manhã à la carte", "Banheira Vitoriana", "Adega Privativa"],
      },
      {
        title: "Apartamento Superior King",
        subtitle: "38m² • Cama King • Decoração em Couro e Madeira",
        pricePerNight: 820.0,
        capacity: 2,
        totalUnits: 10,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Wi-Fi Fibra", "Isolamento Acústico"],
      },
    ],
    reviews: [
      {
        userName: "Felipe Meneghel",
        userAvatar: "https://i.pravatar.cc/150?img=8",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "O melhor hotel urbano do país. O restaurante dispensa apresentações e o bar de jazz ao vivo é um encanto.",
      },
      {
        userName: "Beatriz Nogueira",
        userAvatar: "https://i.pravatar.cc/150?img=5",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Atendimento impecável desde a recepção até o check-out. Quarto extremamente silencioso e acolhedor.",
      },
    ],
  },

  // 3. Gramado (RS) - Serra Gaúcha
  {
    name: "Hotel Casa da Montanha Gramado",
    description:
      "Aconchego serrano de inspiração alpina no centro de Gramado, com piscina aquecida, lareiras acesas e café colonial inesquecível.",
    about:
      "Localizado na elegante Borges de Medeiros, o Casa da Montanha oferece uma autêntica experiência de montanha. Conhecido pela decoração acolhedora em madeira nobre, carrossel vintage e o prestigiado restaurante La Caceria, especializado em carnes nobres e caças.",
    address: "Avenida Borges de Medeiros, 3166 - Centro",
    city: "Gramado",
    state: "RS",
    ratingScore: 4.9,
    reviewCount: 310,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Avenida+Borges+de+Medeiros+3166+Gramado&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1529290130-4ca3753254ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina Térmica Coberta",
      "Sauna Seca e Úmida",
      "Espaço Kids com Carrossel",
      "Restaurante La Caceria",
      "Café da Manhã Colonial",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Pet Friendly",
    ],
    rooms: [
      {
        title: "Suíte Romântica com Hidromassagem",
        subtitle: "48m² • Cama Super King • Banheira de Hidro Dupla • Lareira",
        pricePerNight: 780.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Café colonial farto", "Lareira aconchegante", "Hidromassagem"],
      },
      {
        title: "Apartamento Família Superior",
        subtitle: "55m² • 1 Cama King + 2 Camas Solteiro • Dois Ambientes",
        pricePerNight: 920.0,
        capacity: 4,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Ideal para famílias", "Café colonial farto", "Calefação Central"],
      },
    ],
    reviews: [
      {
        userName: "Luciana Fontes",
        userAvatar: "https://i.pravatar.cc/150?img=9",
        rating: 5,
        stayDate: "Julho de 2026",
        comment:
          "O melhor café da manhã de hotel que já experimentei na vida! A piscina aquecida no frio de Gramado é perfeita.",
      },
      {
        userName: "Rodrigo Tavares",
        userAvatar: "https://i.pravatar.cc/150?img=11",
        rating: 5,
        stayDate: "Junho de 2026",
        comment:
          "Ficamos na suíte com hidro e foi maravilhoso. A localização permite fazer tudo a pé pelo centro.",
      },
    ],
  },

  // 4. Florianópolis (SC) - Jurerê Internacional
  {
    name: "IL Campanario Villaggio Resort",
    description:
      "Resort completo no coração de Jurerê Internacional, a poucos passos da praia com complexo aquático e gastronomia refinada.",
    about:
      "Com atmosfera que remete aos vilarejos da Riviera Italiana, o resort oferece suítes com cozinha gourmet, piscinas aquecidas coberta e ao ar livre, saunas, kids club e o restaurante La Fontana, famoso pelo buffet mediterrâneo.",
    address: "Avenida dos Búzios, 1760 - Jurerê Internacional",
    city: "Florianópolis",
    state: "SC",
    ratingScore: 4.7,
    reviewCount: 295,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Avenida+dos+Buzios+1760+Florianopolis&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Complexo de Piscinas Aquecidas",
      "Acesso Fácil à Praia",
      "Restaurante La Fontana",
      "Espaço Kids com Recreação",
      "Academia & Saunas",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Master Duplex",
        subtitle: "78m² • Cama King • Mezanino com Hidromassagem • Varanda",
        pricePerNight: 1150.0,
        capacity: 4,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Dois pavimentos", "Banheira de hidromassagem", "Cozinha completa"],
      },
      {
        title: "Suíte Júnior com Varanda",
        subtitle: "44m² • Cama Queen • Varanda com Vista para Piscina",
        pricePerNight: 650.0,
        capacity: 3,
        totalUnits: 10,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Mini cozinha", "Próximo à praia"],
      },
    ],
    reviews: [
      {
        userName: "Camila Drummond",
        userAvatar: "https://i.pravatar.cc/150?img=16",
        rating: 5,
        stayDate: "Fevereiro de 2026",
        comment:
          "Excelente infraestrutura para famílias. Nossos filhos adoraram a recreação e a praia de Jurerê fica a 2 minutos.",
      },
      {
        userName: "Marcos Vinicius",
        userAvatar: "https://i.pravatar.cc/150?img=14",
        rating: 4,
        stayDate: "Janeiro de 2026",
        comment:
          "Ótimas piscinas e restaurante muito bom. Lugar seguro e muito agradável.",
      },
    ],
  },

  // 5. Salvador (BA) - Centro Histórico
  {
    name: "Fera Palace Hotel Salvador",
    description:
      "Joia art déco restaurada em frente à Baía de Todos-os-Santos, combinando hospitalidade baiana com um dos rooftops mais famosos do Brasil.",
    about:
      "Inaugurado originalmente em 1934, o Fera Palace renasceu com arquitetura neoclássica impecável. Seu terraço abriga uma piscina infinita com vista panorâmica da baía e o pôr do sol mais espetacular de Salvador, a poucos passos do Elevador Lacerda e do Pelourinho.",
    address: "Rua Chile, 20 - Centro Histórico",
    city: "Salvador",
    state: "BA",
    ratingScore: 4.8,
    reviewCount: 260,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rua+Chile+20+Salvador+Bahia&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Rooftop com Piscina Infinita",
      "Restaurante Omí de Culinária Baiana",
      "Bar de Coquetéis no Terraço",
      "Café da Manhã Regional",
      "Wi-Fi de Alta Velocidade",
      "Academia",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Tower Vista Baía",
        subtitle: "62m² • Cama King • Varanda Panorâmica para o Mar",
        pricePerNight: 980.0,
        capacity: 2,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Vista Pôr do Sol", "Café da manhã incluso", "Rooftop exclusivo"],
      },
      {
        title: "Quarto Superior Art Déco",
        subtitle: "35m² • Cama Queen • Mobiliário Época Restaurado",
        pricePerNight: 520.0,
        capacity: 2,
        totalUnits: 12,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Ao lado do Pelourinho", "Wi-Fi Grátis"],
      },
    ],
    reviews: [
      {
        userName: "Juliana Peixoto",
        userAvatar: "https://i.pravatar.cc/150?img=20",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "O pôr do sol na piscina do rooftop com uma caipirinha de cacau foi o ponto alto da nossa viagem à Bahia!",
      },
      {
        userName: "Gabriel Meireles",
        userAvatar: "https://i.pravatar.cc/150?img=17",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Quartos lindos com pé-direito altíssimo e restaurante maravilhoso. Vale cada centavo.",
      },
    ],
  },

  // 6. Campos do Jordão (SP) - Serra da Mantiqueira
  {
    name: "Botanique Hotel Experience & Spa",
    description:
      "Exclusivo refúgio de bem-estar encravado na Serra da Mantiqueira, com gastronomia sustentável e spa de águas termais.",
    about:
      "Cercado por montanhas verdejantes e florestas de araucárias, o Botanique celebra a cultura brasileira contemporânea em sua arquitetura de pedras brutas e vigas históricas. Dispõe de spa holístico, cinema particular e cartas de vinhos focadas na produção nacional de excelência.",
    address: "Rua Elídio Gonçalves da Silva, 4000 - Bairro dos Mellos",
    city: "Campos do Jordão",
    state: "SP",
    ratingScore: 4.9,
    reviewCount: 178,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Campos+do+Jordao+Mellos&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Spa de Águas Curativas",
      "Restaurante Farm-to-Table",
      "Trilhas na Mata Atlântica",
      "Adega de Rótulos Brasileiros",
      "Quadra de Tênis de Saibro",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Lareira",
    ],
    rooms: [
      {
        title: "Villa da Floresta com Ofurô",
        subtitle: "105m² • Deck Privativo com Ofurô • Cama Super King • Lareira",
        pricePerNight: 2300.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Ofurô externo privativo", "Lareira a lenha", "Pensão completa opcional"],
      },
      {
        title: "Suíte Montanha Panorâmica",
        subtitle: "70m² • Paredes de Vidro com Vista para o Vale",
        pricePerNight: 1650.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Café da manhã sensorial", "Banheira de pedra", "Vista deslumbrante"],
      },
    ],
    reviews: [
      {
        userName: "Renata Vasconcellos",
        userAvatar: "https://i.pravatar.cc/150?img=25",
        rating: 5,
        stayDate: "Julho de 2026",
        comment:
          "Paz absoluta. A conexão com a natureza, os tratamentos do spa e o menu degustação foram memoráveis.",
      },
      {
        userName: "Eduardo Prado",
        userAvatar: "https://i.pravatar.cc/150?img=19",
        rating: 5,
        stayDate: "Maio de 2026",
        comment:
          "Arquitetura impressionante. Tomar banho de ofurô olhando para a Mantiqueira é renovador.",
      },
    ],
  },

  // 7. Maragogi (AL) - Costa dos Corais
  {
    name: "Pousada Maravilha dos Corais",
    description:
      "Pousada pé na areia na famosa Praia de Antunes, famosa pelo mar translúcido de águas mornas e piscinas naturais repletas de peixes coloridos.",
    about:
      "Situada em um dos trechos mais paradisíacos do litoral alagoano, a pousada convida ao sossego com bangalôs confortáveis, passeios exclusivos de catamarã para as galés e café da manhã repleto de frutas tropicais e delícias da doçaria nordestina.",
    address: "Rodovia AL-101 Norte, Km 129 - Praia de Antunes",
    city: "Maragogi",
    state: "AL",
    ratingScore: 4.8,
    reviewCount: 245,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Praia+de+Antunes+Maragogi&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Acesso Direto à Praia de Antunes",
      "Piscina com Vista Panorâmica",
      "Café da Manhã com Tapiocas Feitas na Hora",
      "Passeios de Barco e Mergulho",
      "Restaurante de Frutos do Mar",
      "Wi-Fi Grátis",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Bangalô Pé na Areia Antunes",
        subtitle: "52m² • Deck com Rede sobre a Areia • Cama King",
        pricePerNight: 850.0,
        capacity: 2,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Pé na areia", "Café da manhã incluso", "Vista mar frontal"],
      },
      {
        title: "Chalé Família dos Corais",
        subtitle: "68m² • 1 Cama King + 2 Camas Twin • Varanda Ampla",
        pricePerNight: 980.0,
        capacity: 4,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Espaço para famílias", "Cozinha compacta", "Ar Split"],
      },
    ],
    reviews: [
      {
        userName: "Fernanda Lins",
        userAvatar: "https://i.pravatar.cc/150?img=32",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "O mar de Antunes é inacreditável, parece o Caribe! A equipe da pousada é atenciosa e a comida é deliciosa.",
      },
      {
        userName: "Lucas Mendonça",
        userAvatar: "https://i.pravatar.cc/150?img=28",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Acordar e pisar direto na areia quente é indescritível. O bangalô é super limpo e muito charmoso.",
      },
    ],
  },

  // 8. Búzios (RJ) - Região dos Lagos
  {
    name: "Pousada Casas Brancas Boutique",
    description:
      "Charme mediterrâneo debruçado sobre a Baía da Armação, próximo à famosa Orla Bardot e Rua das Pedras.",
    about:
      "Pioneira na hotelaria de charme em Búzios desde 1974, a Casas Brancas combina estética minimalista em tons de branco com o relaxamento tropical. O terraço panorâmico abriga o premiado restaurante 74 e sessões de yoga ao pôr do sol.",
    address: "Rua Alto do Humaitá, 10 - Orla Bardot",
    city: "Búzios",
    state: "RJ",
    ratingScore: 4.9,
    reviewCount: 280,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rua+Alto+do+Humaita+10+Buzios&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Spa Casas Brancas",
      "Lounge com Vista para a Baía",
      "Restaurante 74 Mediterrâneo",
      "Bar de Coquetéis de Autor",
      "Wi-Fi de Alta Velocidade",
      "Aulas de Yoga e Massoterapia",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Master Vista Baía",
        subtitle: "58m² • Cama King • Terraço Panorâmico com Espreguiçadeiras",
        pricePerNight: 1250.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Vista Pôr do Sol", "Café da manhã à la carte", "Banheira de imersão"],
      },
      {
        title: "Suíte Clássica Humaitá",
        subtitle: "36m² • Cama Queen • Design Mediterrâneo Acolhedor",
        pricePerNight: 740.0,
        capacity: 2,
        totalUnits: 8,
        isAvailable: true,
        tags: ["Próximo à Rua das Pedras", "Café da manhã incluso", "Silencioso"],
      },
    ],
    reviews: [
      {
        userName: "Patrícia Gusmão",
        userAvatar: "https://i.pravatar.cc/150?img=29",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "O pôr do sol no lounge com música suave e drinques perfeitos é mágico. Um refúgio romântico sem igual.",
      },
      {
        userName: "Leonardo Ferraz",
        userAvatar: "https://i.pravatar.cc/150?img=33",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Café da manhã dos deuses servido em etapas. Localização perfeita para passear a pé por Búzios.",
      },
    ],
  },

  // 9. Paraty (RJ) - Costa Verde
  {
    name: "Pousada do Ouro Centro Histórico",
    description:
      "Casarão colonial do século XVIII com pátio florido, piscina privativa e história viva entre as ruas de pedra-sabão de Paraty.",
    about:
      "Tombada pelo patrimônio histórico e frequentada por personalidades do mundo das artes, a Pousada do Ouro une a tradição paratiense ao conforto moderno. Oferece piscina em pátio ajardinado, biblioteca rica em literatura brasileira e bar acolhedor.",
    address: "Rua Dr. Pereira, 145 - Centro Histórico",
    city: "Paraty",
    state: "RJ",
    ratingScore: 4.7,
    reviewCount: 165,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rua+Dr+Pereira+145+Paraty&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina em Pátio Tropical",
      "Sauna a Vapor",
      "Bar Colonial & Biblioteca",
      "Café da Manhã Artesanal",
      "Wi-Fi Grátis",
      "Ar-condicionado",
      "Localização Histórica Nobre",
    ],
    rooms: [
      {
        title: "Suíte Imperial com Varanda",
        subtitle: "50m² • Cama King com Dossel • Janelões Coloniais",
        pricePerNight: 620.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Cama com Dossel", "Café artesanal incluso", "Centro Histórico"],
      },
      {
        title: "Apartamento Pátio Jardim",
        subtitle: "32m² • Cama Queen • Vista para as Flores do Pátio",
        pricePerNight: 430.0,
        capacity: 2,
        totalUnits: 7,
        isAvailable: true,
        tags: ["Café da manhã incluso", "Ar-condicionado silencioso", "Wi-Fi"],
      },
    ],
    reviews: [
      {
        userName: "Marcio Esteves",
        userAvatar: "https://i.pravatar.cc/150?img=36",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Parece que viajamos no tempo com todo o conforto de hoje. A tranquilidade do pátio interno é incrível.",
      },
      {
        userName: "Clara Sampaio",
        userAvatar: "https://i.pravatar.cc/150?img=41",
        rating: 4,
        stayDate: "Julho de 2026",
        comment:
          "Muito charmosa! Café da manhã com bolos caseiros quentinhos e atendimento super caloroso.",
      },
    ],
  },

  // 10. Foz do Iguaçu (PR) - Parque Nacional
  {
    name: "Hotel das Cataratas A Belmond Hotel",
    description:
      "O único hotel situado dentro do Parque Nacional do Iguaçu, garantindo acesso exclusivo às deslumbrantes Cataratas fora dos horários convencionais.",
    about:
      "Com elegante arquitetura colonial em tom rosa pastel, o Belmond Cataratas oferece o privilégio incomparável de contemplar as quedas d'água ao amanhecer e entardecer sem multidões. Conta com piscina aquecida em meio à selva, spa de luxo e alta gastronomia.",
    address: "Rodovia BR-469, Km 28 - Parque Nacional do Iguaçu",
    city: "Foz do Iguaçu",
    state: "PR",
    ratingScore: 5.0,
    reviewCount: 420,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Hotel+das+Cataratas+Foz+do+Iguacu&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Acesso Exclusivo às Cataratas",
      "Piscina Aquecida na Floresta",
      "Spa Cataratas com Rituais da Selva",
      "Restaurante Itaipu de Alta Gastronomia",
      "Quadra de Tênis",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Cataratas Panorâmica",
        subtitle: "68m² • Cama King • Varanda com Vista para as Quedas",
        pricePerNight: 2600.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Acesso privativo às quedas", "Café da manhã imperial", "Serviço de mordomo"],
      },
      {
        title: "Quarto Superior Floresta",
        subtitle: "42m² • Cama Queen • Mobiliário Tradicional e Azulejos Pintados",
        pricePerNight: 1400.0,
        capacity: 2,
        totalUnits: 8,
        isAvailable: true,
        tags: ["Dentro do Parque Nacional", "Café da manhã incluso", "Piscina aquecida"],
      },
    ],
    reviews: [
      {
        userName: "Vitor Hugo Rocha",
        userAvatar: "https://i.pravatar.cc/150?img=52",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "Passear pelas passarelas das Cataratas completamente sozinho ao nascer do sol foi uma das melhores experiências da minha vida.",
      },
      {
        userName: "Simone Magalhães",
        userAvatar: "https://i.pravatar.cc/150?img=47",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Hotel impecável em tudo. A caipirinha à beira da piscina e o som das águas formam a combinação ideal.",
      },
    ],
  },

  // 11. Fernando de Noronha (PE)
  {
    name: "Pousada Morena Fernando de Noronha",
    description:
      "Deck panorâmico com piscina de borda infinita voltada para o Morro do Pico, aliando sustentabilidade ao conforto sofisticado na ilha.",
    about:
      "A Pousada Morena oferece uma das vistas mais disputadas de Fernando de Noronha. Dispõe de bangalôs com hidromassagem privativa no deck, restaurante contemporâneo focado em pescados frescos da ilha e serviço atencioso de concierge para agendamento de mergulhos e passeios.",
    address: "Rua Nice Cordeiro, 2600 - Floresta Nova",
    city: "Fernando de Noronha",
    state: "PE",
    ratingScore: 4.9,
    reviewCount: 235,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Fernando+de+Noronha+Floresta+Nova&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina Infinita com Vista para o Morro do Pico",
      "Restaurante de Pescados Frescos",
      "Espaço Zen de Massoterapia",
      "Café da Manhã e Chá da Tarde Inclusos",
      "Wi-Fi via Satélite",
      "Ar-condicionado Split",
      "Aluguel de Equipamento de Mergulho",
    ],
    rooms: [
      {
        title: "Bangalô Master Morro do Pico",
        subtitle: "60m² • Jacuzzi Privativa no Deck Externo • Cama King",
        pricePerNight: 2400.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Jacuzzi no deck", "Vista Morro do Pico", "Chá da tarde incluso"],
      },
      {
        title: "Apartamento Luxo Tropical",
        subtitle: "38m² • Cama Queen • Varanda com Rede e Jardim",
        pricePerNight: 1550.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Café da manhã gourmet", "Vista Jardim", "Ar-condicionado"],
      },
    ],
    reviews: [
      {
        userName: "Daniela Rangel",
        userAvatar: "https://i.pravatar.cc/150?img=49",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "A vista do Morro do Pico de dentro da piscina é surreal de tão linda. O chá da tarde depois da praia é um carinho enorme.",
      },
      {
        userName: "Bruno Castanho",
        userAvatar: "https://i.pravatar.cc/150?img=53",
        rating: 5,
        stayDate: "Julho de 2026",
        comment:
          "Melhor pousada de Noronha! Atendimento nota mil e comida maravilhosa.",
      },
    ],
  },

  // 12. Jericoacoara (CE)
  {
    name: "Essenza Hotel Jericoacoara",
    description:
      "Ícone de luxo pé na areia na praia de Jeri, famoso por suas piscinas transparentes nas varandas e lounges com saída direta para a água.",
    about:
      "Situado ao lado da Duna do Pôr do Sol, o Essenza oferece uma piscina principal de 1.300m² que circunda todas as acomodações térreas. No piso superior, as suítes contam com piscinas de vidro na varanda privativa voltadas para o oceano.",
    address: "Avenida Beira Mar, s/n - Praia de Jericoacoara",
    city: "Jijoca de Jericoacoara",
    state: "CE",
    ratingScore: 4.9,
    reviewCount: 320,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Praia+de+Jericoacoara+Ceara&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina Gigante de 1300m²",
      "Saída Direta para a Areia",
      "Restaurante Essenza Bistrô",
      "Lounge Bar com Cocktails Especiais",
      "Wi-Fi Fibra",
      "Jacuzzi & Sauna Panorâmica",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Essenza Cult com Piscina na Varanda",
        subtitle: "50m² • Piscina Privativa de Vidro na Sacada • Vista Mar",
        pricePerNight: 2150.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Piscina privativa na sacada", "Vista para o mar e pôr do sol", "Espumante de boas-vindas"],
      },
      {
        title: "Essenza Lounge com Acesso à Piscina",
        subtitle: "50m² • Saída do Quarto Direto na Água da Piscina • Cama King",
        pricePerNight: 1790.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Acesso direto à piscina", "Pé na areia", "Café da manhã à la carte"],
      },
    ],
    reviews: [
      {
        userName: "Priscila Antunes",
        userAvatar: "https://i.pravatar.cc/150?img=44",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "Nadar na piscina da varanda vendo os kitesurfers e o pôr do sol de Jericoacoara não tem preço!",
      },
      {
        userName: "Gustavo Bicalho",
        userAvatar: "https://i.pravatar.cc/150?img=59",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Experiência ímpar em Jeri. O hotel é um espetáculo e os garçons são super atenciosos.",
      },
    ],
  },

  // 13. Praia da Pipa (RN)
  {
    name: "Pousada Toca da Coruja Pipa",
    description:
      "Pousada de charme inserida em um oásis de Mata Atlântica com macacos-prego, bangalôs rústico-chiques e gastronomia premiada.",
    about:
      "Filiada à prestigiada associação Roteiros de Charme, a Toca da Coruja combina preservação ambiental com sofisticação tropical. Oferece duas piscinas ionizadas em meio a árvores nativas, spa, adega e o restaurante Oca Toca, referência gastronômica na região.",
    address: "Avenida Baía dos Golfinhos, 464 - Praia da Pipa",
    city: "Tibau do Sul",
    state: "RN",
    ratingScore: 4.9,
    reviewCount: 195,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Baia+dos+Golfinhos+Pipa+Tibau+do+Sul&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Duas Piscinas Ionizadas na Mata",
      "Restaurante Oca Toca de Alta Cozinha",
      "Beach Club Exclusivo na Praia das Minas",
      "Sauna a Vapor",
      "Café da Manhã à la Carte",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Bangalô Especial com Hidromassagem",
        subtitle: "130m² • Jacuzzi Privativa no Jardim de Bromélias • Varanda",
        pricePerNight: 1450.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Jacuzzi privativa", "130m² de conforto", "Cama super king"],
      },
      {
        title: "Bangalô Luxo Colonial",
        subtitle: "75m² • Móveis Rústicos Nobres • Varanda Suspensa na Mata",
        pricePerNight: 890.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Integrado à natureza", "Café da manhã incluso", "Ar-condicionado"],
      },
    ],
    reviews: [
      {
        userName: "Marcelo Diniz",
        userAvatar: "https://i.pravatar.cc/150?img=60",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Os macaquinhos vêm dar bom dia no café da manhã! O bangalô é enorme e o silêncio da mata à noite é reconfortante.",
      },
      {
        userName: "Larissa Rezende",
        userAvatar: "https://i.pravatar.cc/150?img=45",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Tudo impecável. O restaurante tem pratos incríveis e o translado para o beach club privativo é um diferencial.",
      },
    ],
  },

  // 14. Alto Paraíso de Goiás (GO) - Chapada dos Veadeiros
  {
    name: "Pousada Inácia Chapada dos Veadeiros",
    description:
      "Boutique hotel com vista monumental para a serra, piscina de água mineral aquecida e acesso a cachoeiras exclusivas.",
    about:
      "Instalada em uma fazenda centenária perto de cachoeiras deslumbrantes da Chapada, a Inácia destaca-se pela coleção de arte moderna exposta nos jardins e chalés, restaurante gourmet com ingredientes colhidos na horta orgânica e serviço acolhedor de alto padrão.",
    address: "Rodovia GO-118, Km 159 - Fazenda Almécegas",
    city: "Alto Paraíso de Goiás",
    state: "GO",
    ratingScore: 4.9,
    reviewCount: 172,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Alto+Paraiso+de+Goias+Almecegas&t=&z=13&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1529290130-4ca3753254ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina de Água Mineral Aquecida",
      "Trilhas Ecológicas Privativas",
      "Restaurante Orgânico Gourmet",
      "Vista para as Montanhas da Chapada",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Pet Friendly",
      "Lareira",
    ],
    rooms: [
      {
        title: "Chalé Master com Banheira e Vista",
        subtitle: "55m² • Cama Super King • Banheira com Vista para a Serra",
        pricePerNight: 850.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Vista panorâmica da Chapada", "Hidromassagem", "Lareira"],
      },
      {
        title: "Chalé Jardim das Flores",
        subtitle: "42m² • Cama Queen • Varanda com Rede • Decoração em Arte",
        pricePerNight: 610.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Café da manhã da fazenda", "Deck privativo", "Pet Friendly"],
      },
    ],
    reviews: [
      {
        userName: "Helena Guimarães",
        userAvatar: "https://i.pravatar.cc/150?img=48",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Energia incrível! A piscina aquecida sob o céu estrelado do cerrado é algo que nunca vou esquecer.",
      },
      {
        userName: "André Pires",
        userAvatar: "https://i.pravatar.cc/150?img=65",
        rating: 5,
        stayDate: "Julho de 2026",
        comment:
          "Gastronomia primorosa e cachoeiras fáceis de visitar sem aglomeração. Recomendo de olhos fechados.",
      },
    ],
  },

  // 15. Novo Airão (AM) - Amazônia / Rio Negro
  {
    name: "Anavilhanas Jungle Lodge",
    description:
      "Hotel de selva de alto luxo em frente ao arquipélago fluvial de Anavilhanas no Rio Negro, com expedições ecológicas e pensão completa.",
    about:
      "Perfeitamente integrado à floresta amazônica, o Anavilhanas alia sustentabilidade rigorosa e hospitalidade requintada. Conta com piscina panorâmica sobre o Rio Negro, passeios guiados diários por biólogos experientes e cardápio regional que valoriza os tesouros gastronômicos da Amazônia.",
    address: "Margem Direita do Rio Negro - Parque Nacional de Anavilhanas",
    city: "Novo Airão",
    state: "AM",
    ratingScore: 5.0,
    reviewCount: 160,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Novo+Airao+Amazonas+Anavilhanas&t=&z=12&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina Suspensa sobre o Rio Negro",
      "Pensão Completa Gourmet Inclusa",
      "Passeios Diários na Selva Inclusos",
      "Mirante de Observação de Pássaros",
      "Wi-Fi via Satélite",
      "Ar-condicionado Silencioso",
      "Bar com Frutas Nativas",
    ],
    rooms: [
      {
        title: "Bangalô Panorâmico na Selva",
        subtitle: "62m² • Parede de Vidro com Vista para o Rio e Mata • Cama King",
        pricePerNight: 2850.0,
        capacity: 2,
        totalUnits: 4,
        isAvailable: true,
        tags: ["Pensão completa inclusa", "Passeios inclusos", "Paredão envidraçado"],
      },
      {
        title: "Chalé Superior Floresta",
        subtitle: "45m² • Cama Super King • Varanda Privativa com Rede",
        pricePerNight: 1980.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Pensão completa", "Guia privativo opcional", "Ar-condicionado"],
      },
    ],
    reviews: [
      {
        userName: "Claudia Brandão",
        userAvatar: "https://i.pravatar.cc/150?img=38",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Experiência transformadora na Amazônia com todo o conforto de um resort de luxo. Nadar com botos e ouvir a selva é sensacional.",
      },
      {
        userName: "Henrique Castilho",
        userAvatar: "https://i.pravatar.cc/150?img=68",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "Passeios muito bem organizados e comida amazônica extraordinária, principalmente os peixes de rio.",
      },
    ],
  },

  // 16. Tiradentes (MG) - Cidades Históricas
  {
    name: "Pousada Solar da Ponte Tiradentes",
    description:
      "Casarão com bosque de 8.000m² no centro histórico, lareiras, chá colonial da tarde diário e atmosfera de fazenda mineira.",
    about:
      "Com jardins floridos cortados por um riacho cristalino, o Solar da Ponte é um dos mais tradicionais refúgios de Minas Gerais. O famoso chá da tarde com pães de queijo quentinhos, broas de milho e geleias caseiras é uma celebração aos sentidos.",
    address: "Praça das Mercês, s/n - Centro Histórico",
    city: "Tiradentes",
    state: "MG",
    ratingScore: 4.8,
    reviewCount: 190,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Praca+das+Merces+Tiradentes+Minas+Gerais&t=&z=15&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Bosque Privativo de 8.000m²",
      "Piscina Climatizada no Jardim",
      "Chá da Tarde Mineiro Diário Incluso",
      "Lareira & Biblioteca",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Apartamento Master com Varanda",
        subtitle: "52m² • Cama King • Vista para a Serra de São José",
        pricePerNight: 750.0,
        capacity: 2,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Vista Serra de São José", "Chá da tarde incluso", "Mobiliário de época"],
      },
      {
        title: "Apartamento Superior Jardim",
        subtitle: "38m² • Cama Queen • Janelas para o Pomar e Flores",
        pricePerNight: 520.0,
        capacity: 2,
        totalUnits: 8,
        isAvailable: true,
        tags: ["Café da manhã mineiro artesanal", "Ambiente sereno", "Wi-Fi"],
      },
    ],
    reviews: [
      {
        userName: "Bernardo Prado",
        userAvatar: "https://i.pravatar.cc/150?img=69",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "O chá da tarde mineiro é uma experiência indescritível! Jardim lindo com esquilos e pássaros.",
      },
      {
        userName: "Tereza Cristina",
        userAvatar: "https://i.pravatar.cc/150?img=43",
        rating: 5,
        stayDate: "Julho de 2026",
        comment:
          "Quartos aconchegantes com cheiro de madeira limpa. Dá para fazer todos os passeios em Tiradentes a pé.",
      },
    ],
  },

  // 17. Barra de São Miguel (AL)
  {
    name: "Kenoa Exclusive Beach Spa & Resort",
    description:
      "Eco-chic resort com arquitetura rústico-contemporânea sustentável, spa L'Occitane e vilas com piscinas privativas de frente para o mar.",
    about:
      "O Kenoa harmoniza o design arrojado com a preservação da mata nativa alagoana. Suas vilas oferecem decks privativos debruçados sobre a praia de areia branca, restaurante Kaamo comandado por chefs renomados e um dos spas mais conceituados do país.",
    address: "Rua Gilderval Gomes de Sá, s/n - Barra Mar",
    city: "Barra de São Miguel",
    state: "AL",
    ratingScore: 5.0,
    reviewCount: 210,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Barra+de+Sao+Miguel+Alagoas+Barra+Mar&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Spa L'Occitane Exclusivo",
      "Piscina de Borda Infinita com Pedras Naturais",
      "Restaurante Kaamo Contemporâneo",
      "Winebar no Rooftop",
      "Acesso Direto à Praia Privativa",
      "Wi-Fi de Alta Velocidade",
      "Serviço de Mordomo",
    ],
    rooms: [
      {
        title: "Villa Mar com Piscina Privativa",
        subtitle: "90m² • Piscina Privativa Aquecida no Deck • Cama King",
        pricePerNight: 2300.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Piscina privativa", "Pé na areia", "Café da manhã gourmet"],
      },
      {
        title: "Suíte Apoena com Vista Oceano",
        subtitle: "55m² • Varanda Suspensa com Vista Panorâmica do Mar",
        pricePerNight: 1450.0,
        capacity: 2,
        totalUnits: 5,
        isAvailable: true,
        tags: ["Vista Mar frontal", "Adega climatizada", "Banheiro em pedra"],
      },
    ],
    reviews: [
      {
        userName: "Julio Cesar Brandão",
        userAvatar: "https://i.pravatar.cc/150?img=70",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "O melhor hotel do Nordeste! Privacidade total na piscina da vila e gastronomia cinco estrelas.",
      },
      {
        userName: "Marcia Bottaro",
        userAvatar: "https://i.pravatar.cc/150?img=40",
        rating: 5,
        stayDate: "Agosto de 2026",
        comment:
          "O spa é relaxamento puro e a praia em frente é calma, perfeita para banho.",
      },
    ],
  },

  // 18. Bonito (MS) - Ecoturismo
  {
    name: "Zagaia Eco Resort Bonito",
    description:
      "Resort ecológico cercado por bosques nativos e lagoas cristalinas, ponto de partida ideal para flutuações e cavernas de Bonito.",
    about:
      "Em uma área verde de 600.000m² em Bonito, o Zagaia proporciona lazer para todas as idades com piscinas ao ar livre e aquecida, quadras esportivas, pista de cooper e restaurante especializado em peixes de água doce como o pintado e pacu.",
    address: "Rodovia Bonito - Três Morros, Km 0 - Zona Rural",
    city: "Bonito",
    state: "MS",
    ratingScore: 4.7,
    reviewCount: 330,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Bonito+Mato+Grosso+do+Sul+Zagaia&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Complexo de Piscinas e Sauna",
      "Agência de Passeios Integrada",
      "Restaurante de Culinária Pantaneira",
      "Quadras de Tênis e Beach Tennis",
      "Pista de Caminhada e Bosques",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Suíte Master com Hidromassagem",
        subtitle: "50m² • Cama Super King • Banheira de Hidromassagem • Varanda",
        pricePerNight: 720.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Hidromassagem relaxante", "Café da manhã farto", "Ar-condicionado"],
      },
      {
        title: "Apartamento Família Premium",
        subtitle: "45m² • 1 Cama Casal + 2 Camas Solteiro • Varanda Jardim",
        pricePerNight: 640.0,
        capacity: 4,
        totalUnits: 12,
        isAvailable: true,
        tags: ["Ideal para famílias", "Café da manhã incluso", "Vista bosque"],
      },
    ],
    reviews: [
      {
        userName: "Thiago Paes",
        userAvatar: "https://i.pravatar.cc/150?img=55",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Excelente estrutura para descansar após os passeios de flutuação e rapel em Bonito. A equipe é muito prestativa.",
      },
      {
        userName: "Carolina Duarte",
        userAvatar: "https://i.pravatar.cc/150?img=26",
        rating: 4,
        stayDate: "Agosto de 2026",
        comment:
          "Muito verde, comida gostosa e as crianças se divertiram muito nas piscinas e com a recreação.",
      },
    ],
  },

  // 19. Morro de São Paulo (BA)
  {
    name: "Vila dos Orixás Boutique Hotel",
    description:
      "Paz absoluta na paradisíaca Quarta Praia de Morro de São Paulo, cercada por coqueirais e piscinas naturais mornas.",
    about:
      "Afastado do agito central da ilha, o hotel oferece o melhor refúgio para casais em busca de serenidade. Os bangalôs espalham-se por um jardim tropical com piscina de pedras, spa de massagens ayurvédicas e restaurante gastronômico de frente para o mar.",
    address: "Quarta Praia, s/n - Morro de São Paulo",
    city: "Cairu",
    state: "BA",
    ratingScore: 4.8,
    reviewCount: 155,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Quarta+Praia+Morro+de+Sao+Paulo&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Piscina com Espreguiçadeiras Aquáticas",
      "Praia Semideserta em Frente",
      "Restaurante de Alta Cozinha Baiana",
      "Spa Holístico na Mata",
      "Translado Gratuito até a Vila",
      "Wi-Fi Grátis",
      "Ar-condicionado",
    ],
    rooms: [
      {
        title: "Bangalô com Piscina Privativa",
        subtitle: "72m² • Piscina Privativa no Jardim Particular • Cama King",
        pricePerNight: 1390.0,
        capacity: 2,
        totalUnits: 3,
        isAvailable: true,
        tags: ["Piscina exclusiva", "Pé na areia", "Café servido no bangalô"],
      },
      {
        title: "Bangalô Luxo Frente Mar",
        subtitle: "55m² • Cama Super King • Varanda com Rede Suspensa",
        pricePerNight: 880.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Vista mar frontal", "Café da manhã incluso", "Ducha externa"],
      },
    ],
    reviews: [
      {
        userName: "Natália Guitti",
        userAvatar: "https://i.pravatar.cc/150?img=35",
        rating: 5,
        stayDate: "Outubro de 2026",
        comment:
          "O paraíso existe! A Quarta Praia é calma e vazia. A piscina privativa no bangalô fez da nossa lua de mel algo inesquecível.",
      },
      {
        userName: "Fabio Leão",
        userAvatar: "https://i.pravatar.cc/150?img=61",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Comida fantástica e serviço com muito carinho. O transfer para a vila funciona perfeitamente.",
      },
    ],
  },

  // 20. Ubatuba (SP) - Litoral Norte
  {
    name: "Itamambuca Eco Resort Ubatuba",
    description:
      "Resort ecológico cercado pela Mata Atlântica e pelo encontro do rio com a praia de Itamambuca, paraíso do ecoturismo e do surf.",
    about:
      "Em uma reserva ecológica preservada, o Itamambuca combina a preservação da fauna e flora com infraestrutura de lazer completa: piscinas, passeios de caiaque pelo rio, spa armonia, quadras de tênis e acesso direto à famosa praia de Itamambuca.",
    address: "Rua Manoel Pedro de Oliveira, 8 - Praia de Itamambuca",
    city: "Ubatuba",
    state: "SP",
    ratingScore: 4.6,
    reviewCount: 275,
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Praia+de+Itamambuca+Ubatuba&t=&z=14&ie=UTF8&iwloc=&output=embed",
    photos: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    ],
    amenities: [
      "Encontro do Rio com o Mar",
      "Piscinas Adulto e Infantil",
      "Spa Armonia com Massagens",
      "Passeios Ecológicos de Caiaque",
      "Restaurante Taioba com Gastronomia Caiçara",
      "Wi-Fi Grátis",
      "Estacionamento",
      "Pet Friendly",
    ],
    rooms: [
      {
        title: "Suíte Master com Hidromassagem",
        subtitle: "48m² • Cama King • Banheira de Hidro no Quarto • Varanda",
        pricePerNight: 710.0,
        capacity: 2,
        totalUnits: 6,
        isAvailable: true,
        tags: ["Banheira de hidromassagem", "Café da manhã caiçara", "Vista mata"],
      },
      {
        title: "Apartamento Família Eco",
        subtitle: "42m² • 1 Cama Casal + 2 Camas Solteiro • Varanda com Rede",
        pricePerNight: 550.0,
        capacity: 4,
        totalUnits: 12,
        isAvailable: true,
        tags: ["Ideal para famílias", "Café da manhã incluso", "Pet Friendly"],
      },
    ],
    reviews: [
      {
        userName: "Gustavo Moretto",
        userAvatar: "https://i.pravatar.cc/150?img=58",
        rating: 5,
        stayDate: "Setembro de 2026",
        comment:
          "Adoramos atravessar o rio de caiaque para chegar na praia. Muita natureza, pássaros cantando e comida saborosa.",
      },
      {
        userName: "Sabrina Klein",
        userAvatar: "https://i.pravatar.cc/150?img=30",
        rating: 4,
        stayDate: "Agosto de 2026",
        comment:
          "Excelente refúgio para descansar de São Paulo. A estrutura é ótima e aceita cachorros com muito carinho.",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Iniciando o seeding da base de dados do Hoster...");

  // Limpa registros anteriores para evitar duplicações e respeitar foreign keys
  console.log("🧹 Limpando dados antigos...");
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.hotelQuestion.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  console.log("✨ Base limpa com sucesso!");

  console.log(`🏨 Criando ${hotelsToSeed.length} hotéis e pousadas no Brasil...`);

  let totalRoomsCreated = 0;
  let totalReviewsCreated = 0;

  for (const hotelData of hotelsToSeed) {
    const createdHotel = await prisma.hotel.create({
      data: {
        name: hotelData.name,
        description: hotelData.description,
        about: hotelData.about,
        address: hotelData.address,
        city: hotelData.city,
        state: hotelData.state,
        ratingScore: hotelData.ratingScore,
        reviewCount: hotelData.reviewCount,
        mapEmbedUrl: hotelData.mapEmbedUrl,
        photos: hotelData.photos,
        amenities: hotelData.amenities,
        rooms: {
          create: hotelData.rooms.map((room) => ({
            title: room.title,
            subtitle: room.subtitle,
            pricePerNight: room.pricePerNight,
            capacity: room.capacity,
            totalUnits: room.totalUnits,
            isAvailable: room.isAvailable,
            tags: room.tags,
          })),
        },
        reviews: {
          create: hotelData.reviews.map((rev) => ({
            userName: rev.userName,
            userAvatar: rev.userAvatar,
            rating: rev.rating,
            stayDate: rev.stayDate,
            comment: rev.comment,
          })),
        },
      },
      include: {
        rooms: true,
        reviews: true,
      },
    });

    totalRoomsCreated += createdHotel.rooms.length;
    totalReviewsCreated += createdHotel.reviews.length;
    console.log(`  ✓ [${createdHotel.city}/${createdHotel.state}] ${createdHotel.name} (${createdHotel.rooms.length} quartos, ${createdHotel.reviews.length} avaliações)`);
  }

  console.log("\n========================================");
  console.log(`🎉 Seeding concluído com sucesso no PostgreSQL!`);
  console.log(`📊 Totais cadastrados:`);
  console.log(`   - Hotéis/Pousadas: ${hotelsToSeed.length}`);
  console.log(`   - Tipos de Quartos: ${totalRoomsCreated}`);
  console.log(`   - Avaliações: ${totalReviewsCreated}`);
  console.log("========================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
