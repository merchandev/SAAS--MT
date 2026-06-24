import { prisma } from "@/lib/prisma";

export const reportsQueries = {
  /**
   * Obtiene las métricas globales para las tarjetas KPI
   */
  async getGlobalKPIs() {
    // 1. Ingresos totales (PAGADOS)
    const paidBookings = await prisma.booking.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { finalPrice: true }
    });

    // 2. Número de reservas activas (no canceladas ni fallidas)
    const activeBookingsCount = await prisma.booking.count({
      where: {
        bookingStatus: {
          notIn: ['CANCELADA', 'FALLIDA', 'REEMBOLSADA', 'NO_SHOW']
        }
      }
    });

    // 3. Comisiones estimadas a pagar (B2B)
    const b2bBookings = await prisma.booking.findMany({
      where: { 
        hotelId: { not: null },
        paymentStatus: 'PAID'
      },
      include: { hotel: true }
    });

    const pendingCommissions = b2bBookings.reduce((acc, booking) => {
      const commissionPct = Number(booking.hotel?.commissionValue || 0);
      const commissionAmount = (Number(booking.finalPrice) * commissionPct) / 100;
      return acc + commissionAmount;
    }, 0);

    return {
      grossRevenue: Number(paidBookings._sum.finalPrice || 0),
      activeBookings: activeBookingsCount,
      pendingCommissions
    };
  },

  /**
   * Obtiene los últimos traslados agendados
   */
  async getRecentBookings(limit: number = 5) {
    return await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        customer: true,
        vehicle: true
      }
    });
  }
};
