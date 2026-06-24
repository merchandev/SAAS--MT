import { prisma } from "@/lib/prisma";

export const driversQueries = {
  async getDriverBookings(userId: string) {
    const driver = await prisma.driver.findUnique({
      where: { userId },
    });

    if (!driver) return null;

    const bookings = await prisma.booking.findMany({
      where: {
        driverId: driver.id,
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
