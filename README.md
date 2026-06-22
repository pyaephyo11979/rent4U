
# Rent4U

A vacation home rental platform targeting Myanmar's local market. Homeowners list properties; travelers browse, book, and pay for stays.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Express.js v5, Prisma ORM, SQLite, JWT auth, bcrypt |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, TypeScript 6 |
| **Package Manager** | Bun |
| **Testing** | Jest + Supertest (backend) |

## Project Structure

```
rent4U/
├── backend/                    # Express.js API (CommonJS)
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User, Role, House, Image)
│   │   └── migrations/         # Prisma migrations
│   ├── src/
│   │   ├── app.js              # Entry point
│   │   ├── controllers/        # Business logic
│   │   ├── middlewares/        # Auth (JWT) + RBAC
│   │   ├── routers/            # Express routes
│   │   ├── utils/prisma.js     # Prisma client singleton
│   │   ├── createRoles.js      # Seed script (Admin, Host, User)
│   │   └── __tests__/          # Jest tests
│   └── .env                    # Environment variables
├── frontend/                   # React + Vite (TypeScript)
│   ├── src/
│   │   ├── App.tsx             # Root component
│   │   ├── main.tsx            # Entry point
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level pages
│   │   └── types/global.d.ts   # Shared TypeScript types
│   └── vite.config.ts
└── AGENT.md                    # Full product spec & definition of done
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
node src/createRoles.js    # Seed roles (Admin, Host, User)
bun dev                    # Starts on http://localhost:3000

# Frontend (new terminal)
cd frontend
bun install
bun dev                    # Starts on http://localhost:5173
```

### Environment Variables

Create `backend/.env`:

```env
PORT=3000
SECRET=your-jwt-secret-here
DATABASE_URL="file:./dev.db"
```

## Commands

### Backend (from `backend/`)

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server with auto-reload (Nodemon) |
| `bun start` | Production start |
| `bun test` | Run Jest tests |
| `npx prisma migrate dev` | Run/create database migrations |
| `npx prisma generate` | Regenerate Prisma client |
| `node src/createRoles.js` | Seed the 3 roles |

### Frontend (from `frontend/`)

| Command | Description |
|---------|-------------|
| `bun dev` | Start Vite dev server |
| `bun build` | TypeScript check + production build |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |

## Data Model

```
┌────────┐       ┌────────┐
│  Role  │1────N│  User  │
└────────┘       └───┬────┘
                     │
              owns  │  rents
              ┌─────┴─────┐
              │   House   │
              └─────┬─────┘
                    │1
                    N
              ┌─────────┐
              │  Image   │
              └─────────┘
```

- **Role** — Admin, Host, User
- **User** — name, username (unique), email (unique), password, profilePicture
- **House** — name, city, address, price, description, rooms, bathrooms, availability, rental status
- **Image** — url, linked to a House

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/login` | Public | Login, returns JWT |
| POST | `/users/logout` | Bearer | Logout |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Bearer | Get user by ID |
| POST | `/users` | Admin | Create user |

### Rentals
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | Welcome message |

## Status

Early development. See [`AGENT.md`](./AGENT.md) for the full product spec and definition of done.

## License

Private — not yet licensed.
