# Rent4U API Project Documentation

## Project Overview
Rent4U API is a backend service for a property rental application. It provides endpoints for user management, authentication, and property listings. The project is built using Node.js and Express, with Prisma as the ORM and SQLite as the database.

### Key Technologies
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** SQLite (using `better-sqlite3`)
- **Authentication:** JSON Web Tokens (JWT)
- **Testing:** Jest & Supertest

## Getting Started

### Prerequisites
- Node.js installed.
- `.env` file with necessary environment variables (see `.env.example` or inferred below).

### Installation
```bash
npm install
```

### Environment Variables
Ensure your `.env` file contains:
- `PORT`: Port for the server (default: 3000)
- `DATABASE_URL`: Path to the SQLite database (e.g., `file:./dev.db`)
- `SECRET`: Secret key for JWT signing

### Database Setup
1. **Migrations:**
   ```bash
   npx prisma migrate dev
   ```
2. **Generate Client:**
   The Prisma client is generated into `src/generated/prisma`.
   ```bash
   npx prisma generate
   ```
3. **Seed Roles:**
   ```bash
   node src/createRoles.js
   ```

## Development Commands

- **Run in development mode:**
  ```bash
  npm run dev
  ```
- **Start production server:**
  ```bash
  npm start
  ```
- **Run tests:**
  ```bash
  npm test
  ```

## Architecture & Conventions

### Directory Structure
- `src/app.js`: Application entry point and middleware configuration.
- `src/controllers/`: Logic for handling requests and interacting with the database.
- `src/routers/`: Route definitions and mounting of controllers.
- `src/middlewares/`: Custom middlewares for authentication and role checking.
- `src/utils/`: Utility functions and shared instances (e.g., Prisma client).
- `prisma/`: Prisma schema and migration files.

### Coding Style
- **CommonJS:** Uses `require` and `module.exports`.
- **Asynchronous Code:** Prefer `async/await` for all database and I/O operations.
- **Error Handling:** Controllers should wrap logic in `try-catch` blocks and return appropriate HTTP status codes.
- **Routing:** Routes are organized by resource (e.g., `/users`).

### Authentication & Authorization
- **JWT:** Authentication is handled via JWT. The token should be passed in the `Authorization` header as `Bearer <token>`.
- **Role-Based Access:** Middleware `checkRole` is used to restrict access to specific roles (e.g., 'admin').

## Known Issues / TODOs
- **Home Router:** `src/app.js` references `home_router.js`, but `src/routers/rental_router.js` seems to be serving as the home router.
- **Rental Controller:** Currently references a non-existent `prisma.rental` model. It should likely be updated to use the `House` model.
- **Test Coverage:** `src/__tests__/app.test.js` is currently a placeholder and needs comprehensive test cases.
