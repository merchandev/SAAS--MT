import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";

function money(value: unknown) {
  return Number(value || 0);
}

export const usersQueries = {
  async getAdminUsers() {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        hotel: { select: { id: true, name: true } },
        agency: { select: { id: true, name: true } },
        driverProfile: {
          include: {
            _count: { select: { bookings: true } },
          },
        },
        customerProfile: {
          include: {
            _count: { select: { bookings: true, invoices: true, reviews: true, suggestions: true } },
          },
        },
      },
    });

    return users.map(({ passwordHash, customerProfile, ...user }) => ({
      ...user,
      customerProfile: customerProfile
        ? {
            ...customerProfile,
            totalSpent: money(customerProfile.totalSpent),
          }
        : null,
    }));
  },

  async getUserByIdForAdmin(id: string) {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        hotel: { select: { id: true, name: true } },
        agency: { select: { id: true, name: true } },
        driverProfile: {
          include: {
            _count: { select: { bookings: true } },
          },
        },
        customerProfile: {
          include: {
            _count: { select: { bookings: true, invoices: true, reviews: true, suggestions: true } },
          },
        },
      },
    });

    if (!user) return null;

    const { passwordHash, customerProfile, ...safeUser } = user;
    return {
      ...safeUser,
      customerProfile: customerProfile
        ? {
            ...customerProfile,
            totalSpent: money(customerProfile.totalSpent),
          }
        : null,
    };
  },

  async getUserFormOptions() {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const [hotels, agencies] = await Promise.all([
      prisma.hotel.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.agency.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return { hotels, agencies };
  },
};

export type AdminUserListItem = Awaited<ReturnType<typeof usersQueries.getAdminUsers>>[number];
export type AdminUserDetail = NonNullable<Awaited<ReturnType<typeof usersQueries.getUserByIdForAdmin>>>;
