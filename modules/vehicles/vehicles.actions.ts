import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { vehicleSchema, type VehicleInput } from "./vehicles.schemas";
import { requireRole } from "@/modules/auth/permissions";

export async function createVehicleAction(data: VehicleInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de vehículo inválidos", details: parsed.error.flatten() };
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: parsed.data,
    });
    
    revalidatePath("/admin/vehicles");
    return { success: true, data: vehicle };
  } catch (error: any) {
    return { error: "Error al crear el vehículo. Asegúrate de que el slug sea único." };
  }
}

export async function updateVehicleAction(id: string, data: VehicleInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de vehículo inválidos", details: parsed.error.flatten() };
  }

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: parsed.data,
    });
    
    revalidatePath("/admin/vehicles");
    revalidatePath("/booking"); // Purgar la caché de la vista pública también
    return { success: true, data: vehicle };
  } catch (error: any) {
    return { error: "Error al actualizar el vehículo." };
  }
}

export async function toggleVehicleStatusAction(id: string, currentStatus: boolean) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    
    revalidatePath("/admin/vehicles");
    revalidatePath("/booking");
    return { success: true, isActive: vehicle.isActive };
  } catch (error: any) {
    return { error: "Error al cambiar el estado del vehículo." };
  }
}
