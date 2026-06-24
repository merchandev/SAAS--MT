import { Vehicle } from "@prisma/client";
import { PricingCalculationInput } from "./pricing.schemas";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

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

    // 3. Descuentos (Draft MVP, se puede expandir)
    let totalDiscounts = 0;
    if (input.discountCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: input.discountCode }
      });
      
      if (discount && discount.isActive) {
        if (discount.valueType === "FIXED") {
          totalDiscounts = Number(discount.value);
        } else if (discount.valueType === "PERCENTAGE") {
          totalDiscounts = (basePrice + totalSurcharges) * (Number(discount.value) / 100);
        }
      }
    }

    // 4. Final
    const finalPrice = basePrice + totalSurcharges - totalDiscounts;

    return {
      basePrice: Number(basePrice.toFixed(2)),
      surcharges: {
        night: Number(nightSurcharge.toFixed(2)),
        airport: Number(airportSurcharge.toFixed(2)),
        total: Number(totalSurcharges.toFixed(2)),
      },
      discounts: Number(totalDiscounts.toFixed(2)),
      finalPrice: Number(Math.max(0, finalPrice).toFixed(2)), // Nunca menor a 0
      currency: "EUR"
    };
  }
};
