import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const vehiclesQueries = {
  async getAllVehicles() {
    return prisma.vehicle.findMany({
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  async getVehicleById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  async getActiveVehicles() {
    return prisma.vehicle.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  async getAllCategories() {
    return prisma.vehicleCategory.findMany({
      orderBy: { name: "asc" },
    });
  }
};
