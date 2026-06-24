import { prisma } from "@/lib/prisma";
export const bookingsQueries = {
  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        customer: true,
        vehicle: true,
        hotel: true,
        agency: true,
      },
      orderBy: { createdAt: "desc" },
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
  }
};
