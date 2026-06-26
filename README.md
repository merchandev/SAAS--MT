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
   docker compose up -d postgres pgadmin
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
PgAdmin is available at `http://localhost:5050`.

## Production Docker

Build and start the full stack:

```bash
docker compose up -d --build
```

The web app is exposed on `http://localhost:3100` by default. On the Hostinger VPS, set `NEXT_PUBLIC_APP_URL` to the public URL, for example `http://72.61.77.167:3100` or your domain. PgAdmin is exposed on `http://localhost:5051` by default. PostgreSQL is internal to the Compose network and is not published to the host.

For Hostinger Docker Manager, deploy from the GitHub repository:

```text
https://github.com/merchandev/SAAS--MT
```

This Compose file builds the `app` image from this repository with the included `Dockerfile`. The running container only applies Prisma migrations, seeds the initial admin user when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, and starts the standalone Next.js server. It does not clone the repository, install dependencies, or build Next.js on every restart.

## Documentation
- [Architecture Guide](docs/architecture.md)
- [Database Schema](docs/database.md)

## Development Workflow
All business logic is contained within the `modules/` directory to adhere to Domain-Driven Design principles. Please review the architecture guide before adding new routes or database models.
