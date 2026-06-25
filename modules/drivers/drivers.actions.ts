"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { driverCreationSchema, DriverCreationInput } from "./drivers.schemas";
import { requireRole } from "../auth/permissions";
import { authService } from "../auth/auth.service";
import bcrypt from "bcryptjs";

export async function createDriverAction(data: DriverCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = driverCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const driver = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: parsed.data.email,
          passwordHash,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          role: "DRIVER",
        }
      });

      return await tx.driver.create({
        data: {
          userId: user.id,
          licenseNumber: parsed.data.licenseNumber,
          status: "ACTIVE",
        },
        include: { user: true }
      });
    });

    revalidatePath("/admin/drivers");
    return { success: true, data: driver };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "El correo ya está en uso." };
    }
    return { error: "Error al registrar el conductor" };
  }
}

export async function toggleDriverStatusAction(driverId: string, currentStatus: boolean) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const driver = await prisma.driver.findUnique({ where: { id: driverId }, include: { user: true } });
    if (!driver) return { error: "Conductor no encontrado" };

    await prisma.user.update({
      where: { id: driver.userId },
      data: { isActive: !currentStatus }
    });

    revalidatePath("/admin/drivers");
    return { success: true };
  } catch (error) {
    return { error: "Error al cambiar estado" };
  }
}

export async function updateDriverBookingStatusAction(bookingId: string, driverId: string, newDriverStatus: any) {
  const session = await authService.getSession();
  await requireRole(["SUPER_ADMIN", "ADMIN", "DRIVER"]);

  try {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return { error: "Reserva no encontrada" };

    if (session?.role === "DRIVER") {
      const driver = await prisma.driver.findUnique({ where: { userId: session.userId } });
      if (!driver) return { error: "Perfil de conductor no encontrado" };
      if (booking.driverId !== driver.id) return { error: "No tienes permisos para actualizar esta reserva." };
    } else {
      // Es ADMIN / SUPER_ADMIN
      if (driverId && booking.driverId !== driverId) {
        return { error: "El conductor proporcionado no coincide con la reserva." };
      }
    }

    let newBookingStatus = booking.bookingStatus;
    if (newDriverStatus === "EN_CAMINO" || newDriverStatus === "EN_PUNTO_DE_RECOGIDA" || newDriverStatus === "CLIENTE_RECOGIDO") {
      newBookingStatus = "EN_CURSO" as any;
    } else if (newDriverStatus === "SERVICIO_FINALIZADO") {
      newBookingStatus = "COMPLETADA" as any;
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          driverStatus: newDriverStatus,
          bookingStatus: newBookingStatus
        }
      });
      
      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          oldStatus: booking.bookingStatus,
          newStatus: newBookingStatus,
          changedBy: "DRIVER_SYSTEM",
        }
      });
    });

    revalidatePath("/driver/dashboard");
    revalidatePath(`/admin/bookings/${bookingId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating driver status:", error);
    return { error: "Error al actualizar el estado de la reserva" };
  }
}

