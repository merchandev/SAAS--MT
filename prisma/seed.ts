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

  const economicCategory = await prisma.vehicleCategory.upsert({
    where: { slug: "economic" },
    update: {
      name: "Economic",
      description: "Berlina Mercedes para traslados privados eficientes.",
    },
    create: {
      name: "Economic",
      slug: "economic",
      description: "Berlina Mercedes para traslados privados eficientes.",
    },
  });

  const businessCategory = await prisma.vehicleCategory.upsert({
    where: { slug: "business" },
    update: {
      name: "Business",
      description: "Berlina Mercedes ejecutiva para servicios premium.",
    },
    create: {
      name: "Business",
      slug: "business",
      description: "Berlina Mercedes ejecutiva para servicios premium.",
    },
  });

  const vanCategory = await prisma.vehicleCategory.upsert({
    where: { slug: "minivan" },
    update: {
      name: "Mini Van",
      description: "Mercedes Vito y Clase V para grupos, familias y equipaje.",
    },
    create: {
      name: "Mini Van",
      slug: "minivan",
      description: "Mercedes Vito y Clase V para grupos, familias y equipaje.",
    },
  });

  await prisma.vehicle.upsert({
    where: { slug: "mercedes-e-class" },
    update: {
      name: "ECONOMIC CLASS",
      categoryId: economicCategory.id,
      imageUrl: "/images/vehicles/economic-class.png",
      passengerCapacity: 3,
      luggageCapacity: 3,
      sortOrder: 1,
      isActive: true,
    },
    create: {
      name: "ECONOMIC CLASS",
      slug: "mercedes-e-class",
      imageUrl: "/images/vehicles/economic-class.png",
      categoryId: economicCategory.id,
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
    where: { slug: "business-class" },
    update: {
      name: "BUSINESS CLASS",
      categoryId: businessCategory.id,
      imageUrl: "/images/vehicles/business-class.png",
      passengerCapacity: 3,
      luggageCapacity: 3,
      sortOrder: 2,
      isActive: true,
    },
    create: {
      name: "BUSINESS CLASS",
      slug: "business-class",
      imageUrl: "/images/vehicles/business-class.png",
      categoryId: businessCategory.id,
      passengerCapacity: 3,
      luggageCapacity: 3,
      pricePerKmOneWay: 3.0,
      pricePerKmRoundTrip: 2.8,
      pricePerHour: 75.0,
      minimumPrice: 65.0,
      sortOrder: 2,
    },
  });

  await prisma.vehicle.upsert({
    where: { slug: "mini-van-economic" },
    update: {
      name: "MINI VAN ECONOMIC",
      categoryId: vanCategory.id,
      imageUrl: "/images/vehicles/mini-van-economic.png",
      passengerCapacity: 7,
      luggageCapacity: 7,
      sortOrder: 3,
      isActive: true,
    },
    create: {
      name: "MINI VAN ECONOMIC",
      slug: "mini-van-economic",
      imageUrl: "/images/vehicles/mini-van-economic.png",
      categoryId: vanCategory.id,
      passengerCapacity: 7,
      luggageCapacity: 7,
      pricePerKmOneWay: 3.0,
      pricePerKmRoundTrip: 2.8,
      pricePerHour: 80.0,
      minimumPrice: 70.0,
      sortOrder: 3,
    },
  });

  await prisma.vehicle.upsert({
    where: { slug: "mercedes-v-class" },
    update: {
      name: "MINI VAN «V» CLASS",
      categoryId: vanCategory.id,
      imageUrl: "/images/vehicles/mini-van-v-class.png",
      passengerCapacity: 7,
      luggageCapacity: 7,
      sortOrder: 4,
      isActive: true,
    },
    create: {
      name: "MINI VAN «V» CLASS",
      slug: "mercedes-v-class",
      imageUrl: "/images/vehicles/mini-van-v-class.png",
      categoryId: vanCategory.id,
      passengerCapacity: 7,
      luggageCapacity: 7,
      pricePerKmOneWay: 3.0,
      pricePerKmRoundTrip: 2.8,
      pricePerHour: 80.0,
      minimumPrice: 70.0,
      sortOrder: 4,
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
