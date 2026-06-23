# Rent4U Backend — Project Conventions

## Architecture
- **Pattern:** Module-based (auth, user, house, role, payment)
- **Layers:** Routes → Controllers → Services → Prisma
- **Each module:** own controller, service, routes, validator

## Stack
- Express 5, Prisma 7, SQLite (local) / PostgreSQL (prod), JWT auth, AES-256-GCM encryption, Zod validation

## Commands
```bash
bun dev              # Start dev server with nodemon
bun start            # Start production server
bun test             # Run Jest tests
bun run seed:roles   # Seed default roles (Admin, Host, User)
bun run db:migrate   # Run Prisma migrations
bun run db:generate  # Regenerate Prisma client
bun run db:studio    # Open Prisma Studio
```

## Code Style
- CommonJS (`require`/`module.exports`)
- camelCase for functions/variables, PascalCase for classes
- All env vars accessed via `config/index.js`, never `process.env` directly
- Zod schemas for all input validation
- Custom error classes from `utils/errors.js`
- Standardized responses via `utils/response.js`

## Security
- JWT: access token (15min, Bearer header) + refresh token (7d, HTTP-only cookie)
- Refresh tokens stored in DB for revocation with rotation
- AES-256-GCM field-level encryption on PII in responses
- Helmet security headers, CORS whitelist, rate limiting
- bcrypt cost factor 12+

## Database
- SQLite for local dev, PostgreSQL for production
- Provider switch via `DATABASE_PROVIDER` env var
- No raw SQL with user input — Prisma handles parameterization
- Cascade deletes on dependent records

## API
- Base path: `/api/v1/`
- Auth: `/api/v1/auth` (register, login, refresh, logout)
- Users: `/api/v1/users` (CRUD)
- Houses: `/api/v1/houses` (CRUD, search, filter, paginate)
- Payments: `/api/v1/payments` (create, verify, refund)

## Modules
```
src/modules/{module}/
├── {module}.controller.js   # Request/response handling
├── {module}.service.js      # Business logic
├── {module}.routes.js       # Route definitions + middleware
└── {module}.validator.js    # Zod schemas
```

## Payment Gateway
- Interface: `src/modules/payment/gateways/base.gateway.js`
- Implementation: `src/modules/payment/gateways/sample.gateway.js`
- Factory: `src/modules/payment/gateways/index.js`
- Switch provider via `PAYMENT_PROVIDER` env var
- To add a real gateway: extend `BaseGateway`, register in factory

## Key Files
- `src/config/index.js` — Validated environment configuration
- `src/utils/prisma.js` — Prisma client singleton
- `src/utils/crypto.js` — AES-256-GCM encrypt/decrypt
- `src/utils/logger.js` — Winston structured logging
- `src/utils/errors.js` — Custom error classes
- `src/utils/response.js` — Standardized response helpers
- `src/middlewares/` — Auth, authorization, encryption, error handling, rate limiting
