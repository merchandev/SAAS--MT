import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // 1. Crear usuario Admin principal
  const adminPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@metransfers.com" },
    update: {},
    create: {
      email: "admin@metransfers.com",
      passwordHash: adminPassword,
      fullName: "Super Admin",
      role: "SUPER_ADMIN",
    },
  });

  console.log("Admin creado:", admin.email);

  // 2. Categorías de vehículos base
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

  // 3. Vehículos base
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

  console.log("Flota base creada.");
  
  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
