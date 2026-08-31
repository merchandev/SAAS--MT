import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

export const driversQueries = {
  async getDriverBookings(userId: string) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) return null;

    const bookings = await prisma.booking.findMany({
      where: {
          companyId: await getTenantId(),
        driverId: driver.id,
        deletedAt: null,
      },
      orderBy: [
        { serviceDate: 'asc' },
        { serviceTime: 'asc' }
      ],
      include: {
        customer: true,
        vehicle: true,
      }
    });

    return {
      driver,
      bookings
    };
  }
};
