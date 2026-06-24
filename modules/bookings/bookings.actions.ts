"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { adminBookingSchema, AdminBookingInput } from "./bookings.schemas";
import { pricingService } from "../pricing/pricing.service";

const prisma = new PrismaClient();

export async function createAdminBookingAction(data: AdminBookingInput) {
  const parsed = adminBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  const {
    customerName, customerEmail, customerPhone,
    vehicleId, originAddress, destinationAddress,
    distanceKm, durationMinutes, serviceDate, serviceTime,
    tripType, passengers, luggage, flightNumber, internalNotes, customerNotes
  } = parsed.data;

  try {
    // 1. Usar el motor de precios (Principio de Responsabilidad Única)
    const pricingResult = await pricingService.calculateBookingPrice({
      vehicleId,
      distanceKm,
      tripType,
      isNightTrip: false, // Lógica a mejorar (detectar si serviceTime es de noche)
      isAirportTrip: originAddress.toLowerCase().includes("aeropuerto") || destinationAddress.toLowerCase().includes("aeropuerto"),
    });

    // 2. Transacción de creación (Cliente + Reserva + Auditoría)
    const booking = await prisma.$transaction(async (tx) => {
      // Upsert Customer
      const customer = await tx.customer.upsert({
        where: { email: customerEmail },
        update: { fullName: customerName, phone: customerPhone },
        create: { email: customerEmail, fullName: customerName, phone: customerPhone },
      });

      // Generar código único temporal
      const publicCode = `MT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Crear Booking
      const newBooking = await tx.booking.create({
        data: {
          publicCode,
          customerId: customer.id,
          vehicleId,
          originAddress,
          destinationAddress,
          distanceKm,
          durationMinutes,
          serviceDate: new Date(serviceDate),
          serviceTime,
          tripType,
          passengers,
          luggage,
          flightNumber,
          basePrice: pricingResult.basePrice,
          surchargeAmount: pricingResult.surcharges.total,
          discountAmount: pricingResult.discounts,
          finalPrice: pricingResult.finalPrice,
          currency: pricingResult.currency,
          sourceType: "MANUAL_ADMIN",
          bookingStatus: "DRAFT", // Creado manualmente
          paymentStatus: "PENDING",
          internalNotes,
          customerNotes,
        }
      });

      // Auditoría
      await tx.auditLog.create({
        data: {
          entityType: "Booking",
          entityId: newBooking.id,
          action: "CREATE",
          newValue: JSON.stringify({ source: "MANUAL_ADMIN", finalPrice: pricingResult.finalPrice }),
        }
      });

      return newBooking;
    });

    revalidatePath("/admin/bookings");
    return { success: true, data: booking };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { error: error.message || "Error al crear la reserva interna" };
  }
}
