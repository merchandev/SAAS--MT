"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { revalidatePath } from "next/cache";

export async function createSegment(data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const segment = await prisma.marketingSegment.create({
      data: {
        name: data.name,
        description: data.description || null,
        rules: data.rules || {},
        isActive: data.isActive ?? true,
      }
    });
    
    revalidatePath("/admin/email-marketing/segments");
    return { success: true, segment };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe un segmento con este nombre." };
    }
    return { success: false, error: error.message || "Error al crear el segmento" };
  }
}

export async function updateSegment(id: string, data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const segment = await prisma.marketingSegment.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        rules: data.rules,
        isActive: data.isActive,
      }
    });
    
    revalidatePath("/admin/email-marketing/segments");
    return { success: true, segment };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe un segmento con este nombre." };
    }
    return { success: false, error: error.message || "Error al actualizar el segmento" };
  }
}

export async function deleteSegment(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    await prisma.marketingSegment.delete({
      where: { id }
    });
    
    revalidatePath("/admin/email-marketing/segments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al borrar el segmento" };
  }
}
