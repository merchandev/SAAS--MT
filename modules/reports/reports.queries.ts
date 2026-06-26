import { prisma } from "@/lib/prisma";

export const reportsQueries = {
  /**
   * Obtiene las métricas globales para las tarjetas KPI
   */
  async getGlobalKPIs() {
    // 1. Ingresos totales (PAGADOS)
    const paidBookings = await prisma.booking.aggregate({
      where: { paymentStatus: 'PAID', deletedAt: null },
      _sum: { finalPrice: true }
    });

    // 2. Número de reservas activas (no canceladas ni fallidas)
    const activeBookingsCount = await prisma.booking.count({
      where: {
        deletedAt: null,
        bookingStatus: {
          notIn: ['CANCELADA', 'FALLIDA', 'REEMBOLSADA', 'NO_SHOW']
        }
      }
    });

    // 3. Comisiones estimadas a pagar (B2B)
    const b2bBookings = await prisma.booking.findMany({
      where: { 
        deletedAt: null,
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
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        customer: true,
        vehicle: true
      }
    });
  },

  /**
   * Obtiene los ingresos por mes de los últimos 6 meses (reservas PAGADAS)
   */
  async getRevenueByMonth() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const bookings = await prisma.booking.findMany({
      where: {
        deletedAt: null,
        paymentStatus: 'PAID',
        createdAt: { gte: sixMonthsAgo }
      },
      select: { finalPrice: true, createdAt: true }
    });

    const monthsMap = new Map<string, number>();
    
    // Inicializar los últimos 6 meses a 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      monthsMap.set(monthStr, 0);
    }

    // Sumar ingresos
    bookings.forEach(b => {
      const monthStr = b.createdAt.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      if (monthsMap.has(monthStr)) {
        monthsMap.set(monthStr, monthsMap.get(monthStr)! + Number(b.finalPrice));
      }
    });

    return Array.from(monthsMap.entries()).map(([name, total]) => ({ name, total }));
  },

  /**
   * Obtiene la distribución de reservas por estado
   */
  async getBookingsByStatus() {
    const grouped = await prisma.booking.groupBy({
      by: ['bookingStatus'],
      where: { deletedAt: null },
      _count: { _all: true }
    });

    return grouped.map(g => ({
      name: g.bookingStatus,
      value: g._count._all
    }));
  }
};
