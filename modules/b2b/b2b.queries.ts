import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const b2bQueries = {
  async getAllHotels() {
    return prisma.hotel.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });
  },

  async getHotelByToken(token: string) {
    return prisma.hotel.findUnique({
      where: { token },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
        }
      }
    });
  }
};
