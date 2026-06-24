"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { vehicleSchema, VehicleInput } from "./vehicles.schemas";

const prisma = new PrismaClient();

export async function createVehicleAction(data: VehicleInput) {
  const parsed = vehicleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: parsed.data,
    });
    revalidatePath("/admin/vehicles");
    return { success: true, data: vehicle };
  } catch (error) {
    return { error: "Error al crear el vehículo" };
  }
}

export async function toggleVehicleStatusAction(id: string, isActive: boolean) {
  try {
    await prisma.vehicle.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/vehicles");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el estado" };
  }
}

export async function deleteVehicleAction(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id },
    });
    revalidatePath("/admin/vehicles");
    return { success: true };
  } catch (error) {
    return { error: "Error al eliminar el vehículo" };
  }
}

// Para MVP, creamos una acción rápida para asegurar que exista al menos una categoría
export async function seedCategoriesAction() {
  try {
    const existing = await prisma.vehicleCategory.count();
    if (existing === 0) {
      await prisma.vehicleCategory.create({
        data: { name: "Standard", slug: "standard", description: "Vehículos estándar" }
      });
      await prisma.vehicleCategory.create({
        data: { name: "Minivan", slug: "minivan", description: "Para grupos" }
      });
    }
    return { success: true };
  } catch (error) {
    return { error: "Error seeding categories" };
  }
}
