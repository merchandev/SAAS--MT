import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { vehicleSchema, type VehicleInput } from "./vehicles.schemas";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";
import { authService } from "@/modules/auth/auth.service";

export async function createVehicleAction(data: VehicleInput) {
  const session = await authService.getSession();
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de vehÃ­culo invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: parsed.data,
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "Vehicle",
        entityId: vehicle.id,
        action: "CREATE",
        newValue: JSON.stringify(parsed.data),
      }
    });
    
    revalidatePath("/admin/vehicles");
    return { success: true, data: vehicle };
  } catch (error: any) {
    return { error: "Error al crear el vehÃ­culo. AsegÃºrate de que el slug sea Ãºnico." };
  }
}

export async function updateVehicleAction(id: string, data: VehicleInput) {
  const session = await authService.getSession();
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de vehÃ­culo invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: parsed.data,
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "Vehicle",
        entityId: id,
        action: "UPDATE",
        newValue: JSON.stringify(parsed.data),
      }
    });
    
    revalidatePath("/admin/vehicles");
    revalidatePath("/booking"); // Purgar la cachÃ© de la vista pÃºblica tambiÃ©n
    return { success: true, data: vehicle };
  } catch (error: any) {
    return { error: "Error al actualizar el vehÃ­culo." };
  }
}

export async function toggleVehicleStatusAction(id: string, currentStatus: boolean) {
  const session = await authService.getSession();
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "Vehicle",
        entityId: id,
        action: "TOGGLE_STATUS",
        newValue: JSON.stringify({ isActive: !currentStatus }),
      }
    });
    
    revalidatePath("/admin/vehicles");
    revalidatePath("/booking");
    return { success: true, isActive: vehicle.isActive };
  } catch (error: any) {
    return { error: "Error al cambiar el estado del vehÃ­culo." };
  }
}
