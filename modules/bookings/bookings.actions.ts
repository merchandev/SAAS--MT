"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { adminBookingSchema, AdminBookingInput } from "./bookings.schemas";
import { pricingService } from "../pricing/pricing.service";
import { generateUniquePublicCode } from "./public-code";
import { mapsService } from "../maps/maps.service";
import { requireRole } from "../auth/permissions";
import { distanceInputSchema, type DistanceInput } from "../maps/maps.schemas";

import { settingsQueries } from "../settings/settings.queries";

async function isNightTime(timeStr: string) {
  if (!timeStr) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const currentTime = hours * 60 + minutes;

  const startStr = await settingsQueries.getSettingValue("NIGHT_START_TIME", "22:00");
  const endStr = await settingsQueries.getSettingValue("NIGHT_END_TIME", "06:00");

  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);

  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
}

function isAirportTrip(origin: string, destination: string) {
  const keywords = ["aeropuerto", "airport", "aeroport", "terminal", "el prat", "bcn", "aeropuerto de palma"];
  const o = origin.toLowerCase();
  const d = destination.toLowerCase();
  return keywords.some(kw => o.includes(kw) || d.includes(kw));
}

async function getZoneType(address: string, placeId?: string) {
  if (placeId) {
    const zone = await prisma.zone.findUnique({
      where: { placeId },
      select: { type: true },
    });

    if (zone) {
      return zone.type;
    }
  }

  const normalizedAddress = address.toLowerCase();
  const zones = await prisma.zone.findMany({
    where: { isActive: true },
    select: { type: true, keywords: true },
  });

  return zones.find((zone) =>
    zone.keywords.some((keyword) => normalizedAddress.includes(keyword.toLowerCase()))
  )?.type;
}

async function detectTripContext(
  originAddress: string,
  destinationAddress: string,
  originPlaceId?: string,
  destinationPlaceId?: string
) {
  const [originZoneType, destinationZoneType] = await Promise.all([
    getZoneType(originAddress, originPlaceId),
    getZoneType(destinationAddress, destinationPlaceId),
  ]);

  return {
    originZoneType,
    destinationZoneType,
    isAirportTrip:
      originZoneType === "AIRPORT" ||
      destinationZoneType === "AIRPORT" ||
      isAirportTrip(originAddress, destinationAddress),
  };
}

export async function getDistanceEstimationAction(input: DistanceInput) {
  const parsed = distanceInputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Origen y destino son obligatorios." };
  }

  try {
    const estimation = await mapsService.calculateDistanceAndDuration(
      { address: parsed.data.originAddress, placeId: parsed.data.originPlaceId },
      { address: parsed.data.destinationAddress, placeId: parsed.data.destinationPlaceId }
    );
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
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);

  const parsed = adminBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  const {
    customerName, customerEmail, customerPhone,
    vehicleId, originAddress, originPlaceId, destinationAddress, destinationPlaceId,
    serviceDate, serviceTime,
    tripType, passengers, luggage, flightNumber, internalNotes, customerNotes
  } = parsed.data;

  try {
    const mapResult = await mapsService.calculateDistanceAndDuration(
      { address: originAddress, placeId: originPlaceId },
      { address: destinationAddress, placeId: destinationPlaceId }
    );
    const finalDistanceKm = mapResult.distanceKm;
    const finalDurationMinutes = mapResult.durationMinutes;
    const tripContext = await detectTripContext(
      originAddress,
      destinationAddress,
      originPlaceId,
      destinationPlaceId
    );

    // 1. Usar el motor de precios (Principio de Responsabilidad Única)
    const pricingResult = await pricingService.calculateBookingPrice({
      vehicleId,
      distanceKm: finalDistanceKm,
      tripType,
      isNightTrip: await isNightTime(serviceTime),
      isAirportTrip: tripContext.isAirportTrip,
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
          originPlaceId,
          destinationAddress,
          destinationPlaceId,
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
          priceBreakdown: pricingResult.breakdown,
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
          newValue: JSON.stringify({
            source: "MANUAL_ADMIN",
            finalPrice: pricingResult.finalPrice,
            originZoneType: tripContext.originZoneType,
            destinationZoneType: tripContext.destinationZoneType,
          }),
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

export async function createPublicBookingAction(data: import("./bookings.schemas").PublicBookingInput, hotelToken?: string) {
  const { publicBookingSchema } = await import("./bookings.schemas");
  const parsed = publicBookingSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
    return { error: `Datos inválidos: ${fieldErrors}`, details: parsed.error.flatten() };
  }

  const {
    customerName, customerEmail, customerPhone,
    vehicleId, originAddress, originPlaceId, destinationAddress, destinationPlaceId,
    serviceDate, serviceTime,
    tripType, passengers, luggage, flightNumber, customerNotes
  } = parsed.data;

  try {
    let hotelId = null;
    let discountCode = undefined;
    let sourceType = "WEB_DIRECT";
    let fixedPriceOverride: number | undefined = undefined;

    // Si viene de un token B2B
    if (hotelToken) {
      const hotel = await prisma.hotel.findUnique({ where: { token: hotelToken } });
      if (hotel && hotel.isActive) {
        hotelId = hotel.id;
        sourceType = "HOTEL_QR";
        
        // Comprobar si coincide con una ruta fija predefinida
        if (hotel.routesSettings && typeof hotel.routesSettings === 'object' && 'destinations' in hotel.routesSettings) {
          const dests = (hotel.routesSettings as any).destinations as any[];
          if (Array.isArray(dests)) {
            const matchedDest = dests.find(d => d.placeId === originPlaceId || d.placeId === destinationPlaceId);
            if (matchedDest && matchedDest.prices && matchedDest.prices[vehicleId]) {
              fixedPriceOverride = Number(matchedDest.prices[vehicleId]);
            }
          }
        }
      }
    }

    const mapResult = await mapsService.calculateDistanceAndDuration(
      { address: originAddress, placeId: originPlaceId },
      { address: destinationAddress, placeId: destinationPlaceId }
    );
    const finalDistanceKm = mapResult.distanceKm;
    const finalDurationMinutes = mapResult.durationMinutes;
    const tripContext = await detectTripContext(
      originAddress,
      destinationAddress,
      originPlaceId,
      destinationPlaceId
    );

    const pricingResult = await pricingService.calculateBookingPrice({
      vehicleId,
      distanceKm: finalDistanceKm,
      tripType,
      isNightTrip: await isNightTime(serviceTime),
      isAirportTrip: tripContext.isAirportTrip,
      discountCode,
      fixedPriceOverride
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
          originPlaceId,
          destinationAddress,
          destinationPlaceId,
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
          priceBreakdown: pricingResult.breakdown,
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
          newValue: JSON.stringify({
            source: sourceType,
            finalPrice: pricingResult.finalPrice,
            originZoneType: tripContext.originZoneType,
            destinationZoneType: tripContext.destinationZoneType,
          }),
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

import { BookingStatus } from "@prisma/client";
import { z } from "zod";

const updateStatusSchema = z.nativeEnum(BookingStatus);

export async function updateBookingStatusAction(id: string, newStatus: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  
  const parsedStatus = updateStatusSchema.safeParse(newStatus);
  if (!parsedStatus.success) {
    return { error: "Estado inválido" };
  }
  
  const validatedStatus = parsedStatus.data;

  try {
    const booking = await prisma.booking.findUnique({ 
      where: { id },
      include: { customer: true }
    });
    if (!booking) return { error: "Reserva no encontrada" };

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({ where: { id }, data: { bookingStatus: validatedStatus } });
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          oldStatus: booking.bookingStatus,
          newStatus: validatedStatus,
          changedBy: "ADMIN_SYSTEM",
        }
      });
    });

    // Send email notification if status changed to CONFIRMADA
    if (validatedStatus === "CONFIRMADA" && booking.bookingStatus !== "CONFIRMADA") {
      try {
        const { emailsService } = await import("../notifications/emails.service");
        await emailsService.sendBookingConfirmation(
          booking.customer.email,
          booking.publicCode,
          booking.customer.fullName,
          booking
        );
      } catch (emailError) {
        console.error("Error sending booking confirmation email:", emailError);
      }
    }

    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (err) {
    return { error: "Error al actualizar el estado" };
  }
}

export async function assignDriverToBookingAction(id: string, driverId: string | null) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true }
    });
    
    if (!booking) return { error: "Reserva no encontrada" };

    await prisma.booking.update({
      where: { id },
      data: {
        driverId,
        driverStatus: driverId ? "ASIGNADO" : null,
      }
    });

    // Send email notification if a driver was assigned
    if (driverId && booking.driverId !== driverId) {
      try {
        const driver = await prisma.driver.findUnique({
          where: { id: driverId },
          include: { user: true }
        });
        
        if (driver) {
          const { emailsService } = await import("../notifications/emails.service");
          await emailsService.sendDriverAssignedNotification(
            booking.customer.email,
            booking.publicCode,
            booking.customer.fullName,
            { name: driver.user.fullName, phone: driver.user.phone },
            booking
          );
        }
      } catch (emailError) {
        console.error("Error sending driver assignment email:", emailError);
      }
    }

    revalidatePath(`/admin/bookings/${id}`);
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (err) {
    return { error: "Error al asignar el conductor" };
  }
}

export async function updateInternalNotesAction(id: string, internalNotes: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  try {
    await prisma.booking.update({
      where: { id },
      data: { internalNotes }
    });
    revalidatePath(`/admin/bookings/${id}`);
    return { success: true };
  } catch (err) {
    return { error: "Error al actualizar las notas" };
  }
}
