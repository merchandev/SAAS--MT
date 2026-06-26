import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";

type PartnerSettlement = {
  key: string;
  type: "HOTEL" | "AGENCY";
  name: string;
  bookings: number;
  paidRevenue: number;
  commissionValue: number;
  commissionAmount: number;
};

export const paymentsQueries = {
  async getAdminPaymentsDashboard() {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const [payments, paidAggregate, pendingAggregate, failedCount, b2bBookings] = await Promise.all([
      prisma.payment.findMany({
        where: { booking: { deletedAt: null } },
        orderBy: { createdAt: "desc" },
        take: 150,
        include: {
          booking: {
            include: {
              customer: true,
              hotel: true,
              agency: true,
            },
          },
        },
      }),
      prisma.payment.aggregate({
        where: { status: "PAID", booking: { deletedAt: null } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.payment.aggregate({
        where: { status: "PENDING", booking: { deletedAt: null } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.payment.count({ where: { status: "FAILED", booking: { deletedAt: null } } }),
      prisma.booking.findMany({
        where: {
          deletedAt: null,
          paymentStatus: "PAID",
          OR: [{ hotelId: { not: null } }, { agencyId: { not: null } }],
        },
        include: {
          hotel: true,
          agency: true,
        },
      }),
    ]);

    const settlements = new Map<string, PartnerSettlement>();

    for (const booking of b2bBookings) {
      const partner = booking.hotel ?? booking.agency;
      if (!partner) continue;

      const type = booking.hotel ? "HOTEL" : "AGENCY";
      const key = `${type}:${partner.id}`;
      const paidRevenue = Number(booking.finalPrice);
      const commissionValue = Number(partner.commissionValue || 0);
      const commissionAmount = (paidRevenue * commissionValue) / 100;
      const current =
        settlements.get(key) ??
        ({
          key,
          type,
          name: partner.name,
          bookings: 0,
          paidRevenue: 0,
          commissionValue,
          commissionAmount: 0,
        } satisfies PartnerSettlement);

      current.bookings += 1;
      current.paidRevenue += paidRevenue;
      current.commissionAmount += commissionAmount;
      settlements.set(key, current);
    }

    return {
      metrics: {
        paidTotal: Number(paidAggregate._sum.amount || 0),
        paidCount: paidAggregate._count._all,
        pendingTotal: Number(pendingAggregate._sum.amount || 0),
        pendingCount: pendingAggregate._count._all,
        failedCount,
        b2bCommissionTotal: Array.from(settlements.values()).reduce(
          (sum, item) => sum + item.commissionAmount,
          0
        ),
      },
      payments: payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
        booking: {
          ...payment.booking,
          basePrice: Number(payment.booking.basePrice),
          discountAmount: Number(payment.booking.discountAmount),
          surchargeAmount: Number(payment.booking.surchargeAmount),
          finalPrice: Number(payment.booking.finalPrice),
          distanceKm: Number(payment.booking.distanceKm),
          hotel: payment.booking.hotel
            ? {
                ...payment.booking.hotel,
                commissionValue: Number(payment.booking.hotel.commissionValue),
                discountValue: Number(payment.booking.hotel.discountValue),
              }
            : null,
          agency: payment.booking.agency
            ? {
                ...payment.booking.agency,
                commissionValue: Number(payment.booking.agency.commissionValue),
                discountValue: Number(payment.booking.agency.discountValue),
              }
            : null,
        },
      })),
      settlements: Array.from(settlements.values()).sort((a, b) => b.commissionAmount - a.commissionAmount),
    };
  },
};
