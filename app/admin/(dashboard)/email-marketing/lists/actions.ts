"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { revalidatePath } from "next/cache";

export async function createList(data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const list = await prisma.marketingList.create({
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive ?? true,
      }
    });
    
    revalidatePath("/admin/email-marketing/lists");
    return { success: true, list };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe una lista con este nombre." };
    }
    return { success: false, error: error.message || "Error al crear la lista" };
  }
}

export async function updateList(id: string, data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const list = await prisma.marketingList.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        isActive: data.isActive,
      }
    });
    
    revalidatePath("/admin/email-marketing/lists");
    return { success: true, list };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Ya existe una lista con este nombre." };
    }
    return { success: false, error: error.message || "Error al actualizar la lista" };
  }
}

export async function deleteList(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    await prisma.marketingList.delete({
      where: { id }
    });
    
    revalidatePath("/admin/email-marketing/lists");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al borrar la lista" };
  }
}
