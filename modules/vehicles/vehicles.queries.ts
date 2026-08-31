import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

export const vehiclesQueries = {
  async getAllVehicles() {
    return prisma.vehicle.findMany({
        where: {
            companyId: await getTenantId() },
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
      where: {
          companyId: await getTenantId(),
        isActive: true },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    });
  },

  async getAllCategories() {
    return prisma.vehicleCategory.findMany({
        where: {
            companyId: await getTenantId() },
        orderBy: { name: "asc" },
    });
  }
};
