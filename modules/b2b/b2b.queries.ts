import { prisma } from "@/lib/prisma";
export const b2bQueries = {
  async getAllHotels() {
    const hotels = await prisma.hotel.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { bookings: true, users: true }
        }
      }
    });

    // Convert Decimals to numbers to prevent Next.js serialization errors
    return hotels.map(h => ({
      ...h,
      commissionValue: Number(h.commissionValue),
      discountValue: Number(h.discountValue),
    }));
  },

  async getAllAgencies() {
    const agencies = await prisma.agency.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { bookings: true, users: true }
        }
      }
    });

    return agencies.map((agency) => ({
      ...agency,
      commissionValue: Number(agency.commissionValue),
      discountValue: Number(agency.discountValue),
    }));
  },

  async getAgencyById(id: string) {
    const agency = await prisma.agency.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { bookings: true, users: true },
        },
      },
    });

    if (!agency) return null;

    return {
      ...agency,
      commissionValue: Number(agency.commissionValue),
      discountValue: Number(agency.discountValue),
    };
  },

  async getHotelById(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { bookings: true, users: true },
        },
      },
    });

    if (!hotel) return null;

    return {
      ...hotel,
      commissionValue: Number(hotel.commissionValue),
      discountValue: Number(hotel.discountValue),
    };
  },

  async getHotelByToken(token: string) {
    return prisma.hotel.findUnique({
      where: { token },
      include: {
        bookings: {
          where: { deletedAt: null },
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
          where: { deletedAt: null },
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
    let effectiveBookingsCount = 0;

    for (const b of hotel.bookings) {
      const isPaid = b.paymentStatus === "PAID" || b.paymentStatus === "REFUNDED";
      const isEffectiveStatus = ["CONFIRMADA", "ASIGNADA", "EN_CURSO", "COMPLETADA"].includes(b.bookingStatus);
      
      if (isPaid && isEffectiveStatus) {
        effectiveBookingsCount++;
      }

      if (b.paymentStatus === "PAID" && b.bookingStatus !== "CANCELADA" && b.bookingStatus !== "REEMBOLSADA") {
        totalCommissions += Number(b.basePrice) * commissionPercent;
        paidBookingsCount++;
      }
    }

    return {
      hotel,
      bookings: hotel.bookings,
      stats: {
        totalBookings: effectiveBookingsCount,
        paidBookings: paidBookingsCount,
        totalCommissions
      }
    };
  }
};
