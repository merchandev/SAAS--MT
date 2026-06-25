import { z } from "zod";

export const pricingCalculationSchema = z.object({
  vehicleId: z.string().uuid(),
  distanceKm: z.number().min(0.1),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP"]),
  isNightTrip: z.boolean().default(false),
  isAirportTrip: z.boolean().default(false),
  discountCode: z.string().optional(),
  fixedPriceOverride: z.number().optional(),
});

export type PricingCalculationInput = z.infer<typeof pricingCalculationSchema>;

export const discountCodeSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  valueType: z.enum(["FIXED", "PERCENTAGE"]),
  value: z.number().min(0),
  maxUses: z.number().nullable().optional(),
  validFrom: z.date().nullable().optional(),
  validUntil: z.date().nullable().optional(),
});

export const priceRuleSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.string(),
  valueType: z.enum(["FIXED", "PERCENTAGE"]),
  value: z.number().min(0),
});
