"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { adminBookingSchema, AdminBookingInput } from "./bookings.schemas";
import { pricingService } from "../pricing/pricing.service";
import { generateUniquePublicCode } from "./public-code";
import { mapsService } from "../maps/maps.service";

function isNightTime(timeStr: string) {
  if (!timeStr) return false;
  const [hours] = timeStr.split(':').map(Number);
  return hours >= 22 || hours < 6;
}

function isAirportTrip(origin: string, destination: string) {
  const keywords = ["aeropuerto", "airport", "aeroport", "terminal", "el prat", "bcn", "aeropuerto de palma"];
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();
  return keywords.some(kw => o.includes(kw) || d.includes(kw));
}

export async function getDistanceEstimationAction(origin: string, destination: string) {
  if (!origin || !destination) {
    return { success: false as const, error: "Origen y destino son obligatorios." };
  }

  try {
    const estimation = await mapsService.calculateDistanceAndDuration(origin, destination);
    return { success: true as const, ...estimation };
  } catch (error) {
    console.error("Distance estimation error:", error);
    return {
      success: false as const,
      error: "No se pudo calcular la ruta real. Revisa las direcciones o la configuración de Google Maps.",
    };
  }
}

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
    const mapResult = await mapsService.calculateDistanceAndDuration(originAddress, destinationAddress);
    const finalDistanceKm = mapResult.distanceKm;
    const finalDurationMinutes = mapResult.durationMinutes;

    // 1. Usar el motor de precios (Principio de Responsabilidad Única)
    const pricingResult = await pricingService.calculateBookingPrice({
      vehicleId,
      distanceKm: finalDistanceKm,
      tripType,
      isNightTrip: isNightTime(serviceTime),
      isAirportTrip: isAirportTrip(originAddress, destinationAddress),
    });

    // 2. Transacción de creación (Cliente + Reserva + Auditoría)
    const booking = await prisma.$transaction(async (tx) => {
      // Upsert Customer
      const customer = await tx.customer.upsert({
        where: { email: customerEmail },
        update: { fullName: customerName, phone: customerPhone },
        create: { email: customerEmail, fullName: customerName, phone: customerPhone },
      });

      // Generar código público único para seguimiento y pagos
      const publicCode = await generateUniquePublicCode(tx);

      // Crear Booking
      const newBooking = await tx.booking.create({
        data: {
          publicCode,
          customerId: customer.id,
          vehicleId,
          originAddress,
          destinationAddress,
          distanceKm: finalDistanceKm,
          durationMinutes: finalDurationMinutes,
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

export async function createPublicBookingAction(data: AdminBookingInput, hotelToken?: string) {
  // Nota: Para el MVP usamos el mismo esquema, pero en producción habría publicBookingSchema
  const parsed = adminBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  const {
    customerName, customerEmail, customerPhone,
    vehicleId, originAddress, destinationAddress,
    distanceKm, durationMinutes, serviceDate, serviceTime,
    tripType, passengers, luggage, flightNumber, customerNotes
  } = parsed.data;

  try {
    let hotelId = null;
    let discountCode = undefined;
    let sourceType = "WEB_DIRECT";

    // Si viene de un token B2B
    if (hotelToken) {
      const hotel = await prisma.hotel.findUnique({ where: { token: hotelToken } });
      if (hotel && hotel.isActive) {
        hotelId = hotel.id;
        sourceType = "HOTEL_QR";
        // Si el hotel ofrece descuento al cliente final, aquí se integraría a discountCode o lógica análoga
      }
    }

    const mapResult = await mapsService.calculateDistanceAndDuration(originAddress, destinationAddress);
    const finalDistanceKm = mapResult.distanceKm;
    const finalDurationMinutes = mapResult.durationMinutes;

    const pricingResult = await pricingService.calculateBookingPrice({
      vehicleId,
      distanceKm: finalDistanceKm,
      tripType,
      isNightTrip: isNightTime(serviceTime),
      isAirportTrip: isAirportTrip(originAddress, destinationAddress),
      discountCode
    });

    const booking = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email: customerEmail },
        update: { fullName: customerName, phone: customerPhone },
        create: { email: customerEmail, fullName: customerName, phone: customerPhone },
      });

      const publicCode = await generateUniquePublicCode(tx);

      const newBooking = await tx.booking.create({
        data: {
          publicCode,
          customerId: customer.id,
          vehicleId,
          hotelId, // B2B
          originAddress,
          destinationAddress,
          distanceKm: finalDistanceKm,
          durationMinutes: finalDurationMinutes,
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
          sourceType: sourceType as any,
          bookingStatus: "PENDING_PAYMENT", 
          paymentStatus: "PENDING",
          customerNotes,
        }
      });

      await tx.auditLog.create({
        data: {
          entityType: "Booking",
          entityId: newBooking.id,
          action: "CREATE_PUBLIC",
          newValue: JSON.stringify({ source: sourceType, finalPrice: pricingResult.finalPrice }),
        }
      });

      return newBooking;
    });

    return { success: true, bookingId: booking.id, publicCode: booking.publicCode };
  } catch (error: any) {
    console.error("Public Booking Error:", error);
    return { error: error.message || "Error al procesar tu reserva. Intenta de nuevo." };
  }
}
