import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pricingService } from '../modules/pricing/pricing.service';
import { prisma } from '@/lib/prisma';

// Hacemos mock de Prisma globalmente
vi.mock('@/lib/prisma', () => ({
  prisma: {
    vehicle: {
      findUnique: vi.fn()
    },
    discountCode: {
      findUnique: vi.fn()
    }
  }
}));

describe('Pricing Service', () => {
  const mockVehicle = {
    id: 'v1',
    name: 'Standard Sedan',
    pricePerKmOneWay: 1.5,
    pricePerKmRoundTrip: 1.2,
    minimumPrice: 30,
    nightSurcharge: 15,
    airportSurcharge: 10,
    isActive: true
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calculates ONE_WAY correctly for standard distance', async () => {
    // @ts-ignore
    prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

    const result = await pricingService.calculateBookingPrice({
      vehicleId: 'v1',
      distanceKm: 50,
      tripType: 'ONE_WAY',
      isNightTrip: false,
      isAirportTrip: false
    });

    // 50 km * 1.5 = 75
    expect(result.basePrice).toBe(75);
    expect(result.finalPrice).toBe(75);
    expect(result.breakdown).toEqual([
      { label: 'Precio base', type: 'BASE', amount: 75 }
    ]);
  });

  it('applies minimum price when calculated price is lower', async () => {
    // @ts-ignore
    prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

    const result = await pricingService.calculateBookingPrice({
      vehicleId: 'v1',
      distanceKm: 10, // 10 km * 1.5 = 15. The min price is 30.
      tripType: 'ONE_WAY',
      isNightTrip: false,
      isAirportTrip: false
    });

    expect(result.basePrice).toBe(30);
    expect(result.finalPrice).toBe(30);
  });

  it('calculates ROUND_TRIP with correct multiplier and surcharges', async () => {
    // @ts-ignore
    prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);

    const result = await pricingService.calculateBookingPrice({
      vehicleId: 'v1',
      distanceKm: 40, // 40 km * 1.2 = 48. But it's round trip, so 48 * 2 = 96
      tripType: 'ROUND_TRIP',
      isNightTrip: true, // +15
      isAirportTrip: true // +10
    });

    expect(result.basePrice).toBe(96);
    expect(result.surcharges.night).toBe(15);
    expect(result.surcharges.airport).toBe(10);
    expect(result.surcharges.total).toBe(25);
    expect(result.finalPrice).toBe(121);
    expect(result.breakdown).toContainEqual({ label: 'Recargo nocturno', type: 'SURCHARGE', amount: 15 });
    expect(result.breakdown).toContainEqual({ label: 'Recargo aeropuerto/zona', type: 'SURCHARGE', amount: 10 });
  });

  it('applies fixed discounts correctly', async () => {
    // @ts-ignore
    prisma.vehicle.findUnique.mockResolvedValue(mockVehicle);
    // @ts-ignore
    prisma.discountCode.findUnique.mockResolvedValue({
      id: 'd1', code: 'PROMO10', valueType: 'FIXED', value: 10, isActive: true
    });

    const result = await pricingService.calculateBookingPrice({
      vehicleId: 'v1',
      distanceKm: 50,
      tripType: 'ONE_WAY',
      isNightTrip: false,
      isAirportTrip: false,
      discountCode: 'PROMO10'
    });

    // Base: 75. Discount: 10. Total: 65.
    expect(result.discounts).toBe(10);
    expect(result.finalPrice).toBe(65);
    expect(result.breakdown).toContainEqual({ label: 'Descuento aplicado', type: 'DISCOUNT', amount: 10 });
  });
});
