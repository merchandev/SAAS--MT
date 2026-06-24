import { z } from "zod";

export const pricingCalculationSchema = z.object({
  vehicleId: z.string().uuid(),
  distanceKm: z.number().min(0.1),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP", "HOURLY"]),
  isNightTrip: z.boolean().default(false),
  isAirportTrip: z.boolean().default(false),
  discountCode: z.string().optional(),
});

export type PricingCalculationInput = z.infer<typeof pricingCalculationSchema>;
