import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

export const bookingsQueries = {
  async getAllBookings() {
    return prisma.booking.findMany({
      where: {
          companyId: await getTenantId(),
        deletedAt: null },
      include: {
        customer: true,
        vehicle: true,
        hotel: true,
        agency: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getDeletedBookings() {
    return prisma.booking.findMany({
      where: {
          companyId: await getTenantId(),
        deletedAt: { not: null } },
      include: {
        customer: true,
        vehicle: true,
        hotel: true,
        agency: true,
      },
      orderBy: { deletedAt: "desc" },
    });
  },

  async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        hotel: true,
        agency: true,
        driver: {
          include: { user: true }
        },
        payments: true,
      },
    });
  },

  async getAbandonedBookings() {
    return prisma.booking.findMany({
      where: {
          companyId: await getTenantId(),
        deletedAt: null,
        bookingStatus: {
          in: ["DRAFT", "PENDING_PAYMENT", "FALLIDA"]
        }
      },
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
};
