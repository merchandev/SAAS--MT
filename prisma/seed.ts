import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run prisma/seed.ts.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function getAdminSeedCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }

  return { email, password };
}

async function seedAdminUser() {
  const credentials = getAdminSeedCredentials();

  if (!credentials) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set. Skipping admin user seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(credentials.password, 10);
  const admin = await prisma.user.upsert({
    where: { email: credentials.email },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      email: credentials.email,
      passwordHash,
      fullName: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin seed user ready:", admin.email);
}

async function main() {
  console.log("Starting seed...");

  await seedAdminUser();

  const premiumCategory = await prisma.vehicleCategory.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      name: "Premium",
      slug: "premium",
      description: "Vehículos de alta gama (Mercedes E-Class, Audi A6)",
    },
  });

  const vanCategory = await prisma.vehicleCategory.upsert({
    where: { slug: "minivan" },
    update: {},
    create: {
      name: "Minivan",
      slug: "minivan",
      description: "Furgonetas para grupos (Mercedes V-Class, VW Transporter)",
    },
  });

  await prisma.vehicle.upsert({
    where: { slug: "mercedes-e-class" },
    update: {},
    create: {
      name: "Mercedes E-Class",
      slug: "mercedes-e-class",
      categoryId: premiumCategory.id,
      passengerCapacity: 3,
      luggageCapacity: 3,
      pricePerKmOneWay: 2.5,
      pricePerKmRoundTrip: 2.3,
      pricePerHour: 60.0,
      minimumPrice: 50.0,
      sortOrder: 1,
    },
  });

  await prisma.vehicle.upsert({
    where: { slug: "mercedes-v-class" },
    update: {},
    create: {
      name: "Mercedes V-Class",
      slug: "mercedes-v-class",
      categoryId: vanCategory.id,
      passengerCapacity: 7,
      luggageCapacity: 7,
      pricePerKmOneWay: 3.0,
      pricePerKmRoundTrip: 2.8,
      pricePerHour: 80.0,
      minimumPrice: 70.0,
      sortOrder: 2,
    },
  });

  console.log("Base fleet seed ready.");
  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
