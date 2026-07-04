const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const b = await prisma.booking.create({
    data: {
      publicCode: 'TEST999',
      customerName: 'Test',
      customerEmail: 'test@test.com',
      customerPhone: '123',
      originAddress: 'O',
      destinationAddress: 'D',
      serviceDate: new Date(),
      serviceTime: '10:00',
      finalPrice: 100,
      basePrice: 100,
      tripType: 'ONE_WAY',
      passengers: 1,
      luggage: 1,
      bookingStatus: 'PENDING',
      paymentStatus: 'PENDING'
    }
  });
  console.log('Created booking:', b.publicCode);
}
main().finally(() => prisma.$disconnect());
