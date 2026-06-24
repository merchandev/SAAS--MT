import { prisma } from "@/lib/prisma";
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
  },

  async getHotelDashboardData(hotelId: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          include: {
            customer: true,
            vehicle: true
          }
        }
      }
    });

    if (!hotel) return null;

    const commissionPercent = Number(hotel.commissionValue) / 100;

    let totalCommissions = 0;
    let paidBookingsCount = 0;

    for (const b of hotel.bookings) {
      if (b.paymentStatus === "PAID" && b.bookingStatus !== "CANCELADA" && b.bookingStatus !== "REEMBOLSADA") {
        totalCommissions += Number(b.basePrice) * commissionPercent;
        paidBookingsCount++;
      }
    }

    return {
      hotel,
      bookings: hotel.bookings,
      stats: {
        totalBookings: hotel.bookings.length,
        paidBookings: paidBookingsCount,
        totalCommissions
      }
    };
  }
};

