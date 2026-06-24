"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { driverCreationSchema, DriverCreationInput } from "./drivers.schemas";
import { requireRole } from "../auth/permissions";
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
