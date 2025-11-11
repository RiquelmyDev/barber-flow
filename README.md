# BarberFlow

BarberFlow is a multi-tenant SaaS platform for barbershop management. It provides tenant isolation, role-based access control, omnichannel notifications, webhook integrations, and an Apple-inspired interface for administrators and clients.

## Features

- **Multi-tenancy** with per-barbershop isolation enforced at the API and database level.
- **RBAC** covering Super Admin, Barbershop Admin, Barber, Receptionist, Accountant, and Inventory Manager roles.
- **NestJS API** with Prisma ORM (PostgreSQL), JWT authentication, refresh tokens, and tenant-aware guards.
- **Next.js frontend** with Tailwind CSS and ready-to-translate UI (English and Brazilian Portuguese).
- **Integrations scaffolding** for SendGrid, Meta WhatsApp Business Cloud API, AWS S3, Redis job queues (BullMQ), and signed webhooks.
- **Background jobs** for notifications, reminders, webhook retries, and maintenance tasks.
- **Docker Compose** for local development including PostgreSQL, Redis, backend, and frontend.

## Tech Stack

- Backend: NestJS, TypeScript, Prisma, PostgreSQL, BullMQ, JWT, class-validator.
- Frontend: Next.js (App Router), React, Tailwind CSS, SWR, next-themes.
- Infrastructure: Docker, Redis, AWS S3 (via SDK), SendGrid, WhatsApp Business Cloud API.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/barber-flow.git
cd barber-flow
```

### 2. Install dependencies

Install backend and frontend dependencies separately:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Configure environment variables

Copy the example configuration and adjust values as needed:

```bash
cp ../.env.example ../.env
```

Key settings:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET` / `JWT_REFRESH_SECRET`: secrets for access and refresh tokens.
- `REDIS_URL`: Redis connection used by BullMQ.
- Integration keys for SendGrid, WhatsApp Business, AWS S3, webhook signing, etc.
- `NEXT_PUBLIC_API_URL`: URL consumed by the Next.js frontend to reach the API.

### 4. Run database migrations

Use Prisma CLI from the backend folder:

```bash
cd backend
npx prisma migrate dev
```

Generate the Prisma client if necessary:

```bash
npm run prisma:generate
```

### 5. Seed the database

Populate the database with a Super Admin, an example barbershop, and demo data:

```bash
npm run prisma:seed
```

Default credentials:

- Super Admin: `super@barberflow.app` / `ChangeMe123!`
- Barbershop Admin: `admin@primebarbers.com` / `Admin123!`
- Barber: `barber@primebarbers.com` / `Barber123!`

### 6. Run the application (Docker Compose)

From the repository root:

```bash
docker-compose up --build
```

The stack exposes:

- Backend API: http://localhost:4000/api
- Next.js frontend: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 7. Running locally without Docker

In separate terminals:

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

Ensure PostgreSQL and Redis are running locally with the credentials from `.env`.

### 8. Testing & Linting

(Placeholder) Add unit/integration tests as the project evolves. ESLint is configured for both backend and frontend:

```bash
cd backend
npm run lint

cd ../frontend
npm run lint
```

## Project Structure

```
backend/      # NestJS API (modules, auth, queue, integrations, Prisma)
frontend/     # Next.js application (App Router, Tailwind components, API proxies)
backend/prisma/ # Prisma schema & seed scripts
docker-compose.yml
.env.example
```

## Background Jobs & Integrations

- **Queue Service**: BullMQ with Redis for notification delivery, webhook retries, and scheduled maintenance tasks.
- **EmailService**: Sends transactional emails via SendGrid (API-based, no hard-coded keys).
- **WhatsappService**: Wraps Meta WhatsApp Business Cloud API to send template messages.
- **StorageService**: Uploads images to AWS S3 using presigned keys.
- **WebhooksService**: Dispatches signed events (`booking.created`, `booking.updated`, `payment.recorded`, `client.created`, `client.updated`).

## Security & Tenancy

- JWT payload includes `role` and `barbershopId` to enforce tenant isolation.
- Guards ensure only Super Admins access platform-level routes and tenant users stay within scope.
- Prisma queries always filter by `barbershopId` for tenant-scoped resources.

## Localization

- Translation dictionaries in `frontend/public/locales/en` and `frontend/public/locales/pt`.
- Helper utilities provided in `frontend/lib/i18n.ts` for loading dictionaries.
- UI texts built with minimal placeholders ready for integration with a full i18n provider.

## Roadmap Ideas

- Expand automated tests (unit + E2E).
- Integrate payment providers (Stripe, Pagar.me).
- Add advanced reporting, KPI dashboards, and multi-location analytics.
- Implement live calendar sync and kiosk check-in experiences.

## License

MIT © BarberFlow Team
