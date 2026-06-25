import { Prisma, Vehicle } from "@prisma/client";
import { PricingCalculationInput } from "./pricing.schemas";
import { prisma } from "@/lib/prisma";

type Decimal = Prisma.Decimal;

export interface PricingResult {
  basePrice: number;
  surcharges: {
    night: number;
    airport: number;
    total: number;
  };
  discounts: number;
  finalPrice: number;
  currency: string;
  breakdown: Array<{
    label: string;
    type: "BASE" | "SURCHARGE" | "DISCOUNT";
    amount: number;
  }>;
}

export const pricingService = {
  /**
   * Calcula el precio puro y seguro de un trayecto desde el servidor.
   */
  async calculateBookingPrice(input: PricingCalculationInput): Promise<PricingResult> {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: input.vehicleId }
    });

    if (!vehicle) {
      throw new Error("Vehículo no encontrado");
    }

    // 1. Cálculo Base
    let basePrice = 0;
    
    if (input.fixedPriceOverride !== undefined) {
      basePrice = input.fixedPriceOverride;
      if (input.tripType === "ROUND_TRIP") {
        basePrice = basePrice * 2;
      }
    } else {
      const pricePerKmOneWay = Number(vehicle.pricePerKmOneWay);
      const pricePerKmRoundTrip = Number(vehicle.pricePerKmRoundTrip);
      const minimumPrice = Number(vehicle.minimumPrice);

      if (input.tripType === "ONE_WAY") {
        basePrice = input.distanceKm * pricePerKmOneWay;
      } else if (input.tripType === "ROUND_TRIP") {
        basePrice = (input.distanceKm * pricePerKmRoundTrip) * 2; // Asumiendo distanceKm es solo ida
      }

      // Asegurar que no sea menor al precio mínimo
      if (basePrice < minimumPrice) {
        basePrice = minimumPrice;
      }
    }

    // 2. Recargos (Surcharges)
    let nightSurcharge = 0;
    let airportSurcharge = 0;

    if (input.isNightTrip) {
      nightSurcharge = Number(vehicle.nightSurcharge);
    }
    
    if (input.isAirportTrip) {
      airportSurcharge = Number(vehicle.airportSurcharge);
    }

    const totalSurcharges = nightSurcharge + airportSurcharge;

    // 3. Descuentos
    let totalDiscounts = 0;
    if (input.discountCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: input.discountCode }
      });
      
      if (discount && discount.isActive) {
        const now = new Date();
        const isStarted = discount.validFrom == null || now >= discount.validFrom;
        const isNotExpired = discount.validUntil == null || now <= discount.validUntil;
        const hasUsesLeft = discount.maxUses == null || (discount.usedCount || 0) < discount.maxUses;

        if (isStarted && isNotExpired && hasUsesLeft) {
          if (discount.valueType === "FIXED") {
            totalDiscounts = Number(discount.value);
          } else if (discount.valueType === "PERCENTAGE") {
            totalDiscounts = (basePrice + totalSurcharges) * (Number(discount.value) / 100);
          }
        } else {
          throw new Error("El código de descuento no es válido, ha caducado o ha alcanzado su límite de usos.");
        }
      } else {
        throw new Error("El código de descuento no es válido o está inactivo.");
      }
    }

    // 4. Final
    const finalPrice = basePrice + totalSurcharges - totalDiscounts;
    const roundedBasePrice = Number(basePrice.toFixed(2));
    const roundedNightSurcharge = Number(nightSurcharge.toFixed(2));
    const roundedAirportSurcharge = Number(airportSurcharge.toFixed(2));
    const roundedTotalSurcharges = Number(totalSurcharges.toFixed(2));
    const roundedDiscounts = Number(totalDiscounts.toFixed(2));
    const roundedFinalPrice = Number(Math.max(0, finalPrice).toFixed(2));
    const breakdown: PricingResult["breakdown"] = [
      { label: "Precio base", type: "BASE", amount: roundedBasePrice },
    ];

    if (roundedNightSurcharge > 0) {
      breakdown.push({ label: "Recargo nocturno", type: "SURCHARGE", amount: roundedNightSurcharge });
    }

    if (roundedAirportSurcharge > 0) {
      breakdown.push({ label: "Recargo aeropuerto/zona", type: "SURCHARGE", amount: roundedAirportSurcharge });
    }

    if (roundedDiscounts > 0) {
      breakdown.push({ label: "Descuento aplicado", type: "DISCOUNT", amount: roundedDiscounts });
    }

    return {
      basePrice: roundedBasePrice,
      surcharges: {
        night: roundedNightSurcharge,
        airport: roundedAirportSurcharge,
        total: roundedTotalSurcharges,
      },
      discounts: roundedDiscounts,
      finalPrice: roundedFinalPrice, // Nunca menor a 0
      currency: "EUR",
      breakdown,
    };
  }
};
