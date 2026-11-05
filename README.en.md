<div align="center">

# 🏨 Hoster API — Backend Engine

[![Português](https://img.shields.io/badge/Language-Portugu%C3%AAs-2ea44f?style=for-the-badge&logo=brazil)](./README.md)
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
  <strong>Enterprise-grade high-performance RESTful API engineered to manage accommodations, room reservations, anti-overbooking inventory control, guest favorites, and community Q&A.</strong>
</p>

---

</div>

## 📌 Overview

**`hoster-api`** is the backend engine powering the **Hoster** hospitality platform. It centralizes all core business logic, transactional integrity, and communication with the frontend client ([`hotel-react-vite`](../hotel-react-vite)).

Architected following decoupled, enterprise-grade layered design patterns, the project solves critical hospitality platform challenges:
- **Concurrent Booking & Overbooking Prevention**: guarantees strict room inventory consistency via atomic database transactions.
- **Dynamic Period-Based Availability Filtering**: real-time query engine that filters out accommodations whose room units are fully booked during the requested date interval (`checkIn` and `checkOut`).
- **Decentralized Authentication Validation**: secure Bearer token verification via **Firebase Admin SDK**, synchronizing user profiles idempotently (`upsert`).
- **Cloud-Native Resilience & Performance**: optimized connection pooling with `@prisma/adapter-pg` and native support for serverless databases (Neon Postgres).

---

## 🏛️ Architecture & Data Flow

The application follows the **Layered Architecture (Controller-Service-Repository)** pattern, enforcing strict separation of concerns, testability, and long-term maintainability.

```mermaid
flowchart TD
    Client["💻 Frontend Client (hotel-react-vite)\nReact 18 + Vite + Axios"] -->|"HTTP / HTTPS Requests\n(Bearer Firebase JWT)"| App["🛡️ Express 5 Application (app.ts)"]

    subgraph Security_Layer ["Security Layer & Middlewares"]
        Helmet["🛡️ Helmet Security Headers"]
        Cors["🌐 Dynamic CORS Origin Whitelist"]
        AuthMiddleware["🔑 Firebase Auth Middleware\n(Token Verification)"]
        ErrorHandler["🚨 Centralized Error Handler"]
    end

    App --> Helmet --> Cors --> AuthMiddleware

    subgraph Controllers_Layer ["Controllers Layer"]
        HotelCtrl["HotelController"]
        BookingCtrl["BookingController"]
        UserCtrl["UserController"]
        SugCtrl["SuggestionController"]
    end

    AuthMiddleware --> HotelCtrl
    AuthMiddleware --> BookingCtrl
    AuthMiddleware --> UserCtrl
    AuthMiddleware --> SugCtrl

    subgraph Services_Layer ["Business Logic Layer (Services)"]
        HotelService["HotelService\n• Date-overlap availability filtering\n• Geographic ranking with smart fallback\n• Dynamic lowest daily rate calculation"]
        BookingService["BookingService\n• Atomic anti-overbooking transaction\n• Night count & service fee computation"]
        UserService["UserService\n• Idempotent user profile synchronization\n• Favorites management"]
        SugService["SuggestionService\n• Dynamic destination autocomplete & defaults"]
    end

    HotelCtrl --> HotelService
    BookingCtrl --> BookingService
    UserCtrl --> UserService
    SugCtrl --> SugService

    subgraph Persistence_Layer ["Persistence & Database Layer"]
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

## 🚀 Key API Features

### 1. Concurrent Overbooking Prevention (Atomic Transactions)
When processing a reservation (`POST /api/bookings`), the application executes an isolated `prisma.$transaction` block. It inspects active reservations with `CONFIRMED` or `PENDING` status for the target room whose dates overlap:
$$\text{checkIn} \le \text{booking.checkOut} \quad \text{AND} \quad \text{checkOut} \ge \text{booking.checkIn}$$
If the number of conflicting bookings matches or exceeds the room's total physical capacity (`totalUnits`), the transaction is aborted with an HTTP 400 error, eliminating double bookings.

### 2. Dynamic Date Availability Filtering
On `GET /api/hotels`, when `checkIn` and `checkOut` query parameters are provided, the query engine performs relational filtering returning solely accommodations that have at least one room type available:
$$\text{active\_conflicts} < \text{room.totalUnits}$$
Rooms operating at 100% capacity for the given dates are pruned before delivering the payload to the frontend.

### 3. Geographic Ranking & Smart Fallback
- **Direct Matching**: Hotels located in the searched city are prioritized and sorted at the top by review score (`ratingScore`).
- **State-Level Expansion**: Results automatically broaden to the surrounding state.
- **Safe Fallback**: If no accommodations are registered in the target area, the API delivers the country's top-rated hotels, preserving continuous UI engagement.

### 4. User Favorites & Guest Q&A System
- **Favorites**: Authenticated users can bookmark and remove accommodations with composite uniqueness enforced by `@@unique([userId, hotelId])`.
- **Public Questions**: Guests can ask questions about specific accommodations (`POST /api/hotels/:id/questions`), tied directly to their verified Firebase profile.

---

## 🗄️ Data Model (Prisma Schema)

The PostgreSQL relational schema consists of 7 models and 1 enum:

```mermaid
erDiagram
    User ||--o{ Booking : "places"
    User ||--o{ Favorite : "owns"
    User ||--o{ HotelQuestion : "submits"

    Hotel ||--o{ Room : "contains"
    Hotel ||--o{ Review : "receives"
    Hotel ||--o{ Favorite : "marked in"
    Hotel ||--o{ HotelQuestion : "receives"

    Room ||--o{ Booking : "allocated in"

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

## 🛠️ Installation, Configuration & Execution Guide

### Prerequisites
- **Node.js**: `v20.x` LTS or higher
- **NPM**: `v10.x` or higher (or Yarn / PNPM)
- **PostgreSQL Instance**: running database (local via Docker or cloud via [Neon.tech](https://neon.tech))
- **Firebase Project**: configured project in the Firebase console for user authentication

### 1. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/marcos-goulart/hoster-api.git
cd hoster-api
npm install
```

### 2. Configure Environment Variables
Copy the environment variables template:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```ini
# Runtime Environment
NODE_ENV=development

# Server Port
PORT=3001

# PostgreSQL Database Connection (Neon Serverless or Local)
DATABASE_URL="postgresql://user:password@ep-example.us-east-2.aws.neon.tech/hoster_db?sslmode=require"

# Firebase Admin SDK Service Account Credentials
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-firebase-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 3. Migrations & Database Initialization
Generate typed Prisma Client artifacts and apply migrations:
```bash
# Validate schema definition
npx prisma validate

# Generate typed Prisma client
npm run prisma:generate

# Apply migrations to the database
npm run prisma:migrate
```

### 4. Database Seeding
Populate the database with over 20 realistic accommodations across Brazil (including rooms, high-resolution Unsplash photos, and verified reviews):
```bash
npm run seed
```

### 5. Running the Application

```bash
# Development Mode (Hot-reload with tsx)
npm run dev

# Compile to Production (TypeScript Compiler)
npm run build

# Start in Production Mode
npm run start
```
The server starts by default at `http://localhost:3001`.

---

## 🧪 Automated Testing Suite

The project leverages **Vitest** and **Supertest** for end-to-end integration and security testing. The test suite covers route contracts, anti-overbooking concurrency verification, date availability filtering, and Bearer token access barriers.

```bash
# Run complete test suite (CI Mode)
npm test

# Run tests in interactive Watch Mode
npm run test:watch
```

### Test Coverage Highlights
- **Availability Filter Accuracy**: verifies that accommodations operating at 100% capacity for given search dates are excluded from responses, and reappear once the period is free.
- **Route Security & Access Control**: rejects unauthenticated requests with HTTP 401 across protected routes (`/api/bookings`, `/api/user/favorites`, `/api/hotels/:id/questions`, `/api/auth/me`).
- **Resilience & Fault Handling**: asserts HTTP 404 for non-existent IDs and tests search suggestion lookups.

---

## 📡 Concise API Endpoints Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Public | Root metadata, API version, and status. |
| `GET` | `/api/health` | Public | Service healthcheck (uptime & ISO timestamp). |
| `GET` | `/api/searchSuggestions` | Public | Search autocomplete suggestions (`?q=term`). |
| `GET` | `/api/hotels` | Public | List accommodations with city, price, guests, amenities, and date filters (`?city=...&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD`). |
| `GET` | `/api/hotels/:id` | Public | Complete accommodation details (rooms, top 3 reviews, guest Q&A). |
| `POST` | `/api/hotels/:id/questions` | 🔒 Bearer JWT | Submits a public question for the specified hotel. |
| `POST` | `/api/bookings` | 🔒 Bearer JWT | Creates a booking with atomic anti-overbooking concurrency lock. |
| `GET` | `/api/bookings/my-bookings` | 🔒 Bearer JWT | Retrieves reservation history for the authenticated user. |
| `GET` | `/api/user/favorites` | 🔒 Bearer JWT | Lists all accommodations bookmarked by the user. |
| `POST` | `/api/user/favorites` | 🔒 Bearer JWT | Adds an accommodation to favorites (`body: { hotelId }`). |
| `DELETE` | `/api/user/favorites/:hotelId` | 🔒 Bearer JWT | Removes an accommodation from favorites. |
| `GET` | `/api/auth/me` | 🔒 Bearer JWT | Validates Firebase token and returns user profile payload. |

---

## 🔄 Frontend Client Integration

This API directly serves the frontend repository **[`hotel-react-vite`](../hotel-react-vite)**:
- **Dynamic Period Search**: `checkIn` and `checkOut` query parameters chosen in the frontend `CalendarPicker` are forwarded to `GET /api/hotels` via the `useHotelSearch.ts` hook.
- **Persistent Sessions**: Firebase authentication tokens generated in the web app are transmitted via `Authorization: Bearer <token>` on all restricted calls.
- **Conflict Handling**: transactional overbooking errors are serialized and displayed in the UI, notifying users immediately of room unavailability.

---

## 📜 License & Authorship

Conceived and developed by:

**Marcos Vinicius de Souza Goulart**  
*Full Stack Developer & Software Engineer*

Distributed under the **ISC** License. See the license file for further information.

