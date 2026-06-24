
# Rent4U

A vacation home rental platform targeting Myanmar's local market. Homeowners list properties; travelers browse, book, and pay for stays.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Express.js v5, Prisma 7 ORM, SQLite, JWT (access + refresh tokens), bcrypt, Zod validation |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, TypeScript 6, react-router-dom v7, axios, i18next |
| **Package Manager** | Bun |
| **Testing** | Jest 30 + Supertest (backend) |

## Features

- **Property Listings** — Hosts create, edit, and delete property listings with multiple images, pricing in MMK, and availability management
- **Search & Filters** — Full-text search across name/description/city, filter by city/price range/rooms, sort by price/date/rooms, paginated results with URL-synced params
- **Booking & Payments** — Authenticated users book available properties; payment gateway abstraction (strategy pattern) with a sample gateway for development
- **Authentication** — JWT access tokens (15min, in-memory) + refresh tokens (7d, HTTP-only cookies) with automatic token rotation
- **Role-Based Access** — Admin, Host, and User roles with middleware-enforced authorization and ownership checks
- **Localization** — Full i18n support for English and Myanmar (Burmese) with language toggle
- **Host Dashboard** — Hosts manage their listings and create new ones via modal form; all users view their booking history with status badges
- **Security** — Helmet headers, CORS, rate limiting (global + auth), AES-256-GCM field-level encryption of PII, Zod strict-mode input validation
- **Responsive UI** — Mobile-first responsive design with skeleton loading states, error/retry handling, and accessible modals

## Project Structure

```
rent4U/
├── backend/                          # Express.js API (CommonJS)
│   ├── prisma/
│   │   ├── schema.prisma             # Data models (User, Role, House, Image, RefreshToken, Payment)
│   │   └── migrations/
│   ├── src/
│   │   ├── app.js                    # Entry point, middleware stack, graceful shutdown
│   │   ├── config/index.js           # Centralized env config
│   │   ├── middlewares/              # Auth, RBAC, encryption, rate limiting, error handling, logging
│   │   ├── modules/
│   │   │   ├── auth/                 # Register, login, refresh, logout (service + controller + routes + validator)
│   │   │   ├── house/                # CRUD listings with search/filter/pagination
│   │   │   ├── payment/              # Create, verify, refund payments + gateway abstraction
│   │   │   ├── role/                 # Role seeding and lookup
│   │   │   └── user/                 # User management (CRUD + profile)
│   │   ├── utils/                    # Crypto, errors, logger (Winston), Prisma client, response helpers
│   │   └── __tests__/               # Jest integration tests
│   └── .env
├── frontend/                         # React + Vite (TypeScript)
│   ├── src/
│   │   ├── App.tsx                   # Root component with routing
│   │   ├── main.tsx                  # Entry point
│   │   ├── components/
│   │   │   ├── forms/                # LoginForm, RegisterForm, HouseForm
│   │   │   ├── layout/              # Layout, Navbar (with language toggle), Footer
│   │   │   └── ui/                   # Button, Card, Input, Modal, Skeleton, Spinner
│   │   ├── features/
│   │   │   ├── auth/                 # AuthProvider (context), ProtectedRoute
│   │   │   ├── booking/             # BookingCard, BookingForm
│   │   │   └── house/               # HouseCard, HouseDetail, HouseFilters, HouseGrid
│   │   ├── hooks/                    # useAuth, useDebounce, useHouses
│   │   ├── i18n/                     # i18next config, en.json, my.json
│   │   ├── services/api.ts          # Axios client with token refresh queue
│   │   └── types/global.d.ts        # Shared TypeScript types
│   └── vite.config.ts
└── slides/                           # Presentation slides
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1+)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd rent4U

# Backend
cd backend
bun install
npx prisma migrate dev
npm run seed:roles          # Seed roles (Admin, Host, User)
bun dev                     # Starts on http://localhost:3000

# Frontend (new terminal)
cd frontend
bun install
bun dev                     # Starts on http://localhost:5173
```

### Environment Variables

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
DATABASE_PROVIDER=sqlite
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
ENCRYPTION_KEY=your-encryption-key
CORS_ORIGIN=http://localhost:5173
PAYMENT_PROVIDER=sample
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Commands

### Backend (from `backend/`)

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server with auto-reload (Nodemon) |
| `bun start` | Production start |
| `bun test` | Run Jest tests |
| `npm run seed:roles` | Seed the 3 roles |
| `npm run db:migrate` | Run/create database migrations |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio GUI |

### Frontend (from `frontend/`)

| Command | Description |
|---------|-------------|
| `bun dev` | Start Vite dev server |
| `bun build` | TypeScript check + production build |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |

## Data Model

```
┌────────┐       ┌────────┐       ┌──────────────┐
│  Role  │1────N│  User  │1────N│ RefreshToken │
└────────┘       └───┬────┘       └──────────────┘
                     │
              owns  │  rents
              ┌─────┴─────┐
              │   House   │
              └──┬────┬───┘
                 │1   │1
                 N    N
           ┌───────┐ ┌─────────┐
           │ Image │ │ Payment │
           └───────┘ └─────────┘
```

- **Role** — Admin, Host, User
- **User** — name, username (unique), email (unique), password (bcrypt), profilePicture
- **House** — name, city, address, price, description, rooms, bathrooms, dateAvailable, rented, rentedAt, rentedUntil, isAvailable, owner, rentedBy
- **Image** — url, linked to a House (cascade delete)
- **RefreshToken** — token (unique), expiresAt, revoked, linked to a User (cascade delete)
- **Payment** — externalId, amount, currency (MMK), status (pending/completed/refunded), provider, metadata, linked to User and House

## API Endpoints

Base path: `/api/v1`

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | Public | Health check |

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login, returns access token + refresh token cookie |
| POST | `/auth/refresh` | Public | Refresh access token (token rotation) |
| POST | `/auth/logout` | Bearer | Revoke refresh token(s) |

### Users (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Bearer | Get user by ID (includes houses) |
| PATCH | `/users/:id` | Owner/Admin | Update user profile |
| DELETE | `/users/:id` | Admin | Delete user |

### Houses (`/houses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/houses` | Public | List houses (paginated, filterable, sortable) |
| GET | `/houses/:id` | Public | Get house with images, owner, and renter |
| POST | `/houses` | Host/Admin | Create a new listing |
| PATCH | `/houses/:id` | Owner/Admin | Update listing |
| DELETE | `/houses/:id` | Owner/Admin | Delete listing |

### Payments (`/payments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments` | Bearer | Initiate a payment for a house |
| GET | `/payments/my` | Bearer | Get current user's payments |
| GET | `/payments/:id` | Owner/Admin | Get single payment |
| POST | `/payments/:id/verify` | Owner | Verify and complete payment |
| POST | `/payments/:id/refund` | Admin | Refund a completed payment |

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero banner with CTA, featured listings grid |
| `/login` | Login | Email + password login form |
| `/register` | Register | User registration form |
| `/search` | Search | Browse listings with filters, sorting, and pagination |
| `/houses/:id` | House Detail | Image gallery, property info, booking form |
| `/dashboard` | Dashboard | My listings (Host/Admin), my bookings, create new listing |
| `*` | Not Found | 404 page |

## Status

Active development. The platform supports full property listing, search, booking, and payment flows with role-based access control and bilingual UI.

## License

Private — not yet licensed.
