import { prisma } from "@/lib/prisma";
import { requireRole } from "../auth/permissions";
import { requireCustomerProfile } from "./customer.auth";

const completedStatuses = ["COMPLETADA"] as const;
const billablePaymentStatuses = ["PAID", "REFUNDED"] as const;

export async function getCustomerDashboard() {
  const { customer } = await requireCustomerProfile();

  const bookings = await prisma.booking.findMany({
    where: { customerId: customer.id, deletedAt: null },
    orderBy: [{ serviceDate: "desc" }, { serviceTime: "desc" }],
    include: {
      vehicle: true,
      invoice: true,
      review: true,
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const suggestions = await prisma.customerSuggestion.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const billableBookings = bookings.filter((booking) =>
    billablePaymentStatuses.includes(booking.paymentStatus as (typeof billablePaymentStatuses)[number])
  );
  const completedBookings = bookings.filter((booking) =>
    completedStatuses.includes(booking.bookingStatus as (typeof completedStatuses)[number])
  );
  const pendingReviewBookings = completedBookings.filter((booking) => !booking.review);

  const totalSpent = billableBookings.reduce((sum, booking) => sum + Number(booking.finalPrice), 0);
  const totalDistanceKm = completedBookings.reduce((sum, booking) => sum + Number(booking.distanceKm), 0);

  return {
    customer,
    bookings,
    suggestions,
    pendingReviewBookings,
    metrics: {
      totalBookings: bookings.length,
      completedTransfers: completedBookings.length,
      totalDistanceKm,
      totalSpent,
      averageSpend: billableBookings.length > 0 ? totalSpent / billableBookings.length : 0,
    },
    expenses: billableBookings.map((booking) => ({
      id: booking.id,
      publicCode: booking.publicCode,
      serviceDate: booking.serviceDate,
      serviceTime: booking.serviceTime,
      route: `${booking.originAddress} -> ${booking.destinationAddress}`,
      vehicleName: booking.vehicle.name,
      distanceKm: Number(booking.distanceKm),
      amount: Number(booking.finalPrice),
      currency: booking.currency,
      paymentStatus: booking.paymentStatus,
      invoiceNumber: booking.invoice?.invoiceNumber ?? null,
    })),
  };
}

export async function getAdminCustomersDirectory() {
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);

  const customers = await prisma.customer.findMany({
    orderBy: { updatedAt: "desc" },
    take: 150,
    include: {
      user: {
        select: {
          id: true,
          isActive: true,
          role: true,
          createdAt: true,
        },
      },
      bookings: {
        where: { deletedAt: null },
        orderBy: [{ serviceDate: "desc" }, { serviceTime: "desc" }],
        select: {
          id: true,
          publicCode: true,
          serviceDate: true,
          serviceTime: true,
          originAddress: true,
          destinationAddress: true,
          distanceKm: true,
          finalPrice: true,
          currency: true,
          bookingStatus: true,
          paymentStatus: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      suggestions: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
          suggestions: true,
          invoices: true,
        },
      },
    },
  });

  const directory = customers.map((customer) => {
    const billableBookings = customer.bookings.filter((booking) =>
      ["PAID", "REFUNDED"].includes(booking.paymentStatus)
    );
    const completedBookings = customer.bookings.filter((booking) => booking.bookingStatus === "COMPLETADA");
    const totalSpent = billableBookings.reduce((sum, booking) => sum + Number(booking.finalPrice), 0);
    const totalDistanceKm = completedBookings.reduce((sum, booking) => sum + Number(booking.distanceKm), 0);
    const lastBooking = customer.bookings[0] ?? null;
    const activeBookingsCount = customer.bookings.length;

    return {
      id: customer.id,
      userId: customer.userId,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      country: customer.country,
      preferredLanguage: customer.preferredLanguage,
      isActive: customer.user?.isActive ?? true,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      counts: {
        ...customer._count,
        bookings: activeBookingsCount,
      },
      reviews: customer.reviews,
      suggestions: customer.suggestions,
      lastBooking,
      metrics: {
        totalBookings: activeBookingsCount,
        completedTransfers: completedBookings.length,
        totalSpent,
        totalDistanceKm,
        averageSpend: billableBookings.length > 0 ? totalSpent / billableBookings.length : 0,
      },
    };
  });

  const totals = directory.reduce(
    (acc, customer) => {
      acc.customers += 1;
      acc.activeCustomers += customer.isActive ? 1 : 0;
      acc.totalSpent += customer.metrics.totalSpent;
      acc.totalDistanceKm += customer.metrics.totalDistanceKm;
      acc.totalBookings += customer.metrics.totalBookings;
      return acc;
    },
    {
      customers: 0,
      activeCustomers: 0,
      totalSpent: 0,
      totalDistanceKm: 0,
      totalBookings: 0,
    }
  );

  return { customers: directory, totals };
}
