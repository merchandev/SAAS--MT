import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString) {
    // Runtime normal: conexión directa a PostgreSQL via adapter
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter, log: ["error", "warn"] });
  }

  if (process.env.ALLOW_PRISMA_BUILD_STUB === "true") {
    // Build time estático sin DATABASE_URL (Turbopack pre-rendering).
    // Se usa accelerateUrl con string vacío — el cliente existe pero no puede
    // ejecutar queries (los errores se verán en runtime, no en build).
    return new PrismaClient({
      accelerateUrl: "prisma://placeholder-build-time",
      log: ["error", "warn"],
    });
  }

  throw new Error("FATAL: DATABASE_URL environment variable is not set.");
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
