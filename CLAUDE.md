# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rent4U is a vacation home rental platform (Airbnb-style) targeting Myanmar's local market. Homeowners list properties; travelers browse, book, and pay for stays. Early/incomplete stage — backend has basic user scaffolding, frontend is an empty shell. Full product spec and definition of done are in `AGENT.md` at the repo root.

## Commands

### Backend (run from `backend/`)
| Command | Purpose |
|---------|---------|
| `bun dev` | Start Express dev server with Nodemon (auto-reload) |
| `bun start` | Production start (`node src/app.js`) |
| `bun test` | Run Jest tests |
| `npx prisma migrate dev` | Run/create database migrations |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `node src/createRoles.js` | Seed the 3 roles: Admin, Host, User |

### Frontend (run from `frontend/`)
| Command | Purpose |
|---------|---------|
| `bun dev` | Start Vite dev server |
| `bun build` | TypeScript check + Vite production build |
| `bun lint` | ESLint |
| `bun preview` | Preview production build |

**Package manager:** Bun (bun.lock in both `frontend/` and `backend/`).

## Architecture

### Backend — Express.js MVC (CommonJS)

```
backend/src/
  app.js                 — Entry point, middleware setup, route mounting
  controllers/           — Business logic (user CRUD, login/JWT, rentals)
  middlewares/           — authenticateToken (JWT), checkRole (RBAC)
  routers/               — Express route definitions, mounted in app.js
  utils/prisma.js        — Singleton PrismaClient instance
  __tests__/             — Jest + Supertest (placeholder only)
```

- **Auth:** JWT-based. Tokens via `Authorization: Bearer <token>` header, 1hr expiry. `authenticateToken` middleware verifies and attaches `req.user`.
- **Authorization:** Role-based via `checkRole` middleware — checks `req.user.role` against required role string. Three roles seeded: Admin, Host, User.
- **Database:** SQLite via Prisma with `@prisma/adapter-better-sqlite3`. Schema at `backend/prisma/schema.prisma`. Singleton client at `utils/prisma.js`.

### Frontend — React + Vite + Tailwind (TypeScript)

Currently an empty shell (`App.tsx` returns `<></>`). Planned structure:
- `src/components/` — Reusable UI components
- `src/pages/` — Route-level page components
- `types/global.d.ts` — Shared TypeScript types matching the Prisma schema (User, Role, House, Image)

### Data Model

- **User** — name, username (unique), email (unique), password, profilePicture; belongs to Role; owns Houses; can rent Houses
- **Role** — Admin, Host, User
- **House** — name, city, address, price, description, rooms, bathrooms, dateAvailable, rented status/dates, isAvailable; belongs to owner (User), optionally rented by User; has many Images
- **Image** — url; belongs to a House

## Known Bugs (pre-existing)

These issues exist in the current codebase and will cause runtime errors:

1. **`app.js:5`** — Requires `./routers/home_router` but file is `./routers/rental_router`
2. **`rental_controller.js:1`** — Requires `../prisma` instead of `../utils/prisma`; also references `prisma.rental` which doesn't exist (model is `House`)
3. **`roleCheck.js`** — Never calls `next()` on successful role check, so requests hang
4. **`user_controller.js` createUser** — Does not provide the required `username` field when creating users

## Environment Variables (backend/.env)

- `PORT` — Server port (default: 3000)
- `SECRET` — JWT signing secret
- `DATABASE_URL` — Prisma connection string (currently `file:./dev.db` for SQLite)
