<div align="center">

# 🏨 Hoster API — Backend Engine

[![Português](https://img.shields.io/badge/Idioma-Portugu%C3%AAs-2ea44f?style=for-the-badge&logo=brazil)](./README.md)
[![English](https://img.shields.io/badge/Language-English-0969da?style=for-the-badge&logo=united-states)](./README.en.md)

<br />

[![CI Pipeline](https://img.shields.io/badge/CI%20Pipeline-Passing-success?style=flat-square&logo=githubactions)](https://github.com)
[![Node.js Version](https://img.shields.io/badge/Node.js-20.x%20LTS-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20ES2022-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.x%20ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-4169E1?style=flat-square&logo=postgresql)](https://neon.tech)
[![Firebase Admin](https://img.shields.io/badge/Firebase-Admin%20SDK-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%20%2B%20Supertest-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

<p align="center">
  <strong>API RESTful corporativa de alta performance desenvolvida para gerenciar acomodações, reservas de quartos, controle de estoque anti-overbooking, favoritos e dúvidas de hóspedes.</strong>
</p>

---

</div>

## 📌 Visão Geral

O **`hoster-api`** é o motor backend da plataforma **Hoster**, responsável por centralizar toda a inteligência de negócios, integridade transacional e comunicação com o ecossistema frontend ([`hotel-react-vite`](../hotel-react-vite)).

Construído sob uma arquitetura desacoplada em camadas, o projeto resolve os desafios mais críticos da hotelaria moderna:
- **Reserva concorrente e prevenção de overbooking**: garantia de consistência de estoque de quartos através de transações atômicas no banco de dados.
- **Filtro dinâmico de disponibilidade por período**: consulta em tempo real que desconsidera hotéis cujas unidades de quartos estejam integralmente ocupadas no intervalo de datas desejado (`checkIn` e `checkOut`).
- **Autenticação centralizada descentralizada**: validação segura de tokens Bearer via **Firebase Admin SDK**, sincronizando perfis de usuário de maneira idempotente (`upsert`).
- **Resiliência e performance cloud-native**: pool de conexões otimizado com `@prisma/adapter-pg` e suporte nativo a bancos de dados serverless (Neon Postgres).

---

## 🏛️ Arquitetura e Fluxo de Dados

A aplicação implementa o padrão arquitetural **Layered Architecture (Controller-Service-Repository)**, assegurando separação estrita de responsabilidades, testabilidade e manutenibilidade.

```mermaid
flowchart TD
    Client["💻 Frontend Client (hotel-react-vite)\nReact 18 + Vite + Axios"] -->|"HTTP / HTTPS Requests\n(Bearer Firebase JWT)"| App["🛡️ Express 5 Application (app.ts)"]

    subgraph Security_Layer ["Camada de Segurança e Middlewares"]
        Helmet["🛡️ Helmet Security Headers"]
        Cors["🌐 Dynamic CORS Origin Whitelist"]
        AuthMiddleware["🔑 Firebase Auth Middleware\n(Token Verification)"]
        ErrorHandler["🚨 Centralized Error Handler"]
    end

    App --> Helmet --> Cors --> AuthMiddleware

    subgraph Controllers_Layer ["Camada de Controladores (Controllers)"]
        HotelCtrl["HotelController"]
        BookingCtrl["BookingController"]
        UserCtrl["UserController"]
        SugCtrl["SuggestionController"]
    end

    AuthMiddleware --> HotelCtrl
    AuthMiddleware --> BookingCtrl
    AuthMiddleware --> UserCtrl
    AuthMiddleware --> SugCtrl

    subgraph Services_Layer ["Camada de Regras de Negócio (Services)"]
        HotelService["HotelService\n• Filtro de disponibilidade por sobreposição de datas\n• Ranking geográfico com fallback\n• Cálculo do menor valor de diária"]
        BookingService["BookingService\n• Transação atômica anti-overbooking\n• Cálculo de noites e taxas de serviço"]
        UserService["UserService\n• Sincronização idempotente de usuários\n• Gestão de hotéis favoritos"]
        SugService["SuggestionService\n• Autocomplete dinâmico e fallback inteligente"]
    end

    HotelCtrl --> HotelService
    BookingCtrl --> BookingService
    UserCtrl --> UserService
    SugCtrl --> SugService

    subgraph Persistence_Layer ["Camada de Persistência & Dados"]
        Prisma["⚡ Prisma ORM v7\n(@prisma/adapter-pg + pg.Pool)"]
        Postgres[("🐘 PostgreSQL / Neon Serverless DB\n(Hotels, Rooms, Bookings, Users, Favorites, Reviews, Questions)")]
    end

    HotelService --> Prisma
    BookingService --> Prisma
    UserService --> Prisma
    SugService --> Prisma

    Prisma <--> Postgres

    App -.-> ErrorHandler
```

---

## 🚀 Principais Funcionalidades da API

### 1. Prevenção Concorrente de Overbooking (Atomic Transactions)
Ao registrar uma reserva (`POST /api/bookings`), a aplicação executa um bloco isolado `prisma.$transaction`. O sistema calcula se existem reservas ativas com status `CONFIRMED` ou `PENDING` para o mesmo quarto cuja sobreposição satisfaça a condição:
$$\text{checkIn} \le \text{reserva.checkOut} \quad \text{AND} \quad \text{checkOut} \ge \text{reserva.checkIn}$$
Se o número de conflitos atingir a capacidade total de unidades do quarto (`totalUnits`), a transação é imediatamente revertida com erro 400, impedindo o duplo agendamento.

### 2. Filtro Dinâmico de Disponibilidade por Datas
No endpoint `GET /api/hotels`, quando os parâmetros `checkIn` e `checkOut` são fornecidos, a API realiza uma busca relacional trazendo apenas acomodações que possuem ao menos um quarto disponível:
$$\text{conflitosAtivos} < \text{room.totalUnits}$$
Quartos com 100% de ocupação no intervalo informado são filtrados antes da entrega ao frontend.

### 3. Ranking Geográfico e Fallback Inteligente
- **Correspondência Direta**: Se a cidade pesquisada possuir hotéis cadastrados, eles são ordenados no topo por pontuação (`ratingScore`).
- **Escopo Estadual**: A busca expande automaticamente para todo o estado do hotel correspondente.
- **Fallback Seguro**: Se nenhum registro for encontrado para a localidade, a API devolve os hotéis mais bem avaliados do país para manter o engajamento da UI.

### 4. Gestão de Favoritos e Dúvidas Comunitárias
- **Favoritos**: Permite que usuários autenticados salvem e removam acomodações preferidas com unicidade composta `@@unique([userId, hotelId])`.
- **Perguntas e Respostas**: Hóspedes podem submeter perguntas públicas (`POST /api/hotels/:id/questions`) diretamente aos anfitriões, associadas ao seu perfil Firebase.

---

## 🗄️ Modelo de Dados (Prisma Schema)

O esquema relacional do banco de dados PostgreSQL é composto por 7 modelos e 1 enum:

```mermaid
erDiagram
    User ||--o{ Booking : "realiza"
    User ||--o{ Favorite : "possui"
    User ||--o{ HotelQuestion : "envia"

    Hotel ||--o{ Room : "possui"
    Hotel ||--o{ Review : "recebe"
    Hotel ||--o{ Favorite : "marcado em"
    Hotel ||--o{ HotelQuestion : "recebe"

    Room ||--o{ Booking : "alocado em"

    User {
        string id PK
        string firebaseUid UK
        string name
        string email UK
        string avatar
        string phone
        string document
        datetime createdAt
        datetime updatedAt
    }

    Hotel {
        string id PK
        string name
        string description
        string about
        string address
        string city
        string state
        float ratingScore
        int reviewCount
        string mapEmbedUrl
        string[] photos
        string[] amenities
        datetime createdAt
        datetime updatedAt
    }

    Room {
        string id PK
        string hotelId FK
        string title
        string subtitle
        float pricePerNight
        int capacity
        int totalUnits
        boolean isAvailable
        string[] tags
        datetime createdAt
        datetime updatedAt
    }

    Booking {
        string id PK
        string userId FK
        string roomId FK
        datetime checkIn
        datetime checkOut
        int nights
        string period
        int guestsCount
        float roomPricePerNight
        float serviceFee
        float totalPrice
        enum status
        string guestFullName
        string guestEmail
        string guestDocument
        string guestPhone
        datetime createdAt
        datetime updatedAt
    }

    Review {
        string id PK
        string hotelId FK
        string userName
        string userAvatar
        int rating
        string stayDate
        string comment
        datetime createdAt
    }

    Favorite {
        string id PK
        string userId FK
        string hotelId FK
        datetime createdAt
    }

    HotelQuestion {
        string id PK
        string hotelId FK
        string userId FK
        string question
        string answer
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🛠️ Guia de Instalação, Configuração e Execução

### Pré-requisitos
- **Node.js**: `v20.x` LTS ou superior
- **NPM**: `v10.x` ou superior (ou Yarn / PNPM)
- **Instância PostgreSQL**: banco de dados ativo (local via Docker ou nuvem via [Neon.tech](https://neon.tech))
- **Projeto Firebase**: projeto configurado no console Firebase para autenticação de usuários

### 1. Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/seu-usuario/hoster-api.git
cd hoster-api
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o template de variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```ini
# Ambiente de Execução
NODE_ENV=development

# Porta do Servidor
PORT=3001

# Conexão com o Banco de Dados PostgreSQL (Neon Serverless ou Local)
DATABASE_URL="postgresql://usuario:senha@ep-exemplo.us-east-2.aws.neon.tech/hoster_db?sslmode=require"

# Credenciais de Serviço do Firebase Admin SDK
FIREBASE_PROJECT_ID="seu-projeto-firebase"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@seu-projeto-firebase.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 3. Migrações e Inicialização do Banco de Dados
Gere os artefatos do cliente Prisma e aplique o schema:
```bash
# Validar o arquivo de schema
npx prisma validate

# Gerar o cliente Prisma tipado
npm run prisma:generate

# Aplicar as migrações ao banco de dados
npm run prisma:migrate
```

### 4. Povoar o Banco com Dados Reais (Seed)
Execute o script de seed para popular o banco de dados com mais de 20 hotéis hiper-realistas por todo o Brasil (incluindo quartos, fotos em alta definição do Unsplash e avaliações):
```bash
npm run seed
```

### 5. Executar o Servidor

```bash
# Modo de Desenvolvimento (Hot-reload com tsx)
npm run dev

# Compilar para Produção (TypeScript Compiler)
npm run build

# Iniciar em Produção
npm run start
```
O servidor inicializará por padrão em `http://localhost:3001`.

---

## 🧪 Suíte de Testes Automatizados

O projeto utiliza **Vitest** e **Supertest** para testes de integração e validação de segurança. A suíte contempla testes end-to-end de rotas, verificação de concorrência anti-overbooking, filtros de disponibilidade e barreiras de autenticação JWT Bearer.

```bash
# Executar toda a suíte de testes (Modo CI/Run)
npm test

# Executar testes em modo interativo/observador (Watch Mode)
npm run test:watch
```

### Cenários Cobertos pelos Testes
- **Validação de Disponibilidade**: confirma que hotéis 100% ocupados para as datas pesquisadas são excluídos da resposta, e voltam a ser listados quando o período está livre.
- **Segurança e Proteção de Rotas**: bloqueio imediato (HTTP 401) para chamadas não autenticadas em rotas restritas (`/api/bookings`, `/api/user/favorites`, `/api/hotels/:id/questions`, `/api/auth/me`).
- **Resiliência e Fallbacks**: resposta HTTP 404 para consultas de acomodações com IDs inexistentes e funcionamento de sugestões de busca.

---

## 📡 Documentação Sucinta dos Endpoints

| Método | Endpoint | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Pública | Informações gerais, versão e status da API. |
| `GET` | `/api/health` | Pública | Healthcheck da API (uptime e timestamp ISO). |
| `GET` | `/api/searchSuggestions` | Pública | Sugestões inteligentes para o autocomplete de destinos (`?q=termo`). |
| `GET` | `/api/hotels` | Pública | Lista de hotéis com suporte a filtros de cidade, preço, hóspedes, comodidades e datas (`?city=...&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`). |
| `GET` | `/api/hotels/:id` | Pública | Detalhes completos de uma acomodação (quartos, top 3 avaliações e perguntas). |
| `POST` | `/api/hotels/:id/questions` | 🔒 Bearer JWT | Envia uma dúvida pública sobre o hotel selecionado. |
| `POST` | `/api/bookings` | 🔒 Bearer JWT | Cria uma reserva com bloqueio atômico contra overbooking. |
| `GET` | `/api/bookings/my-bookings` | 🔒 Bearer JWT | Retorna o histórico completo de reservas do usuário autenticado. |
| `GET` | `/api/user/favorites` | 🔒 Bearer JWT | Lista todos os hotéis favoritados pelo usuário autenticado. |
| `POST` | `/api/user/favorites` | 🔒 Bearer JWT | Adiciona um hotel à lista de favoritos (`body: { hotelId }`). |
| `DELETE` | `/api/user/favorites/:hotelId` | 🔒 Bearer JWT | Remove um hotel da lista de favoritos do usuário. |
| `GET` | `/api/auth/me` | 🔒 Bearer JWT | Valida o token do Firebase e retorna os dados do usuário. |

---

## 🔄 Integração com o Frontend

Esta API atende diretamente ao repositório frontend **[`hotel-react-vite`](../hotel-react-vite)**:
- **Busca Dinâmica**: os parâmetros `checkIn` e `checkOut` selecionados no `CalendarPicker` do frontend são consumidos pelo endpoint `GET /api/hotels` via hook `useHotelSearch.ts`.
- **Sessão Persistente**: os tokens emitidos pelo Firebase Authentication na camada web são transmitidos no cabeçalho `Authorization: Bearer <token>` em todas as operações restritas.
- **Detecção de Conflitos**: erros de sobreposição disparados na reserva são serializados e refletidos na UI informando ao usuário a indisponibilidade imediata do quarto.

---

## 📜 Licença e Créditos

Este projeto foi idealizado e desenvolvido por:

**Marcos Vinicius de Souza Goulart**  
*Desenvolvedor Full Stack & Engenheiro de Software*

Distribuído sob a licença **ISC**. Consulte o arquivo de licença para mais detalhes.

