# MeTransfers SaaS Platform

SaaS B2B/B2C Platform for Private Transfer Bookings, Vehicle Fleet, Hotel QR Referrals, and Payment Management.

## Stack Overview
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Redsys Gateway
- **Auth**: JWT (jose), bcryptjs

## Prerequisites
- Node.js 18+
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
   docker-compose up -d
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

## Documentation
- [Architecture Guide](docs/architecture.md)
- [Database Schema](docs/database.md)

## Development Workflow
All business logic is contained within the `modules/` directory to adhere to Domain-Driven Design principles. Please review the architecture guide before adding new routes or database models.
