# MeTransfers SaaS Platform

SaaS B2B/B2C Platform for Private Transfer Bookings, Vehicle Fleet, Hotel QR Referrals, and Payment Management.

## Stack Overview
- **Framework**: Next.js 16.2.9 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Redsys Gateway
- **Auth**: JWT (jose), bcryptjs

## Prerequisites
- Node.js 20.19+ (Node 22 recommended)
- Docker & Docker Compose (for local database)

## Quick Start

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start Local Database**
   ```bash
   docker compose up -d postgres
   ```

   PgAdmin is optional and bound to localhost through the development profile:
   ```bash
   docker compose --profile dev up -d pgadmin
   ```

4. **Initialize Database Schema**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.
PgAdmin is available at `http://localhost:5051` when started with the `dev` profile.

## Production Docker

Build and start the full stack:

```bash
docker compose up -d --build
```

The web app is exposed on `http://localhost:3100` by default. On the Hostinger VPS, set `NEXT_PUBLIC_APP_URL` to the public URL, for example `http://72.61.77.167:3100` or your domain. PostgreSQL is internal to the Compose network and is not published to the host. PgAdmin is not started by default in production; if enabled with `--profile dev`, it binds to `127.0.0.1:${PGADMIN_PORT:-5051}` only.

For Hostinger Docker Manager, deploy from the GitHub repository:

```text
https://github.com/merchandev/SAAS--MT
```

This Compose file builds the `app` image from this repository with the included `Dockerfile`. The running container only applies Prisma migrations and starts the standalone Next.js server. It does not clone the repository, install dependencies, build Next.js, or run database seeds on every restart.

Run the seed only for first setup or manual recovery:

```bash
docker compose run --rm app node node_modules/ts-node/dist/bin.js prisma/seed.ts
```

## Documentation
- [Architecture Guide](docs/architecture.md)
- [Database Schema](docs/database.md)

## Development Workflow
All business logic is contained within the `modules/` directory to adhere to Domain-Driven Design principles. Please review the architecture guide before adding new routes or database models.
