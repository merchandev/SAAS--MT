"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteBulkPages(ids: string[]) {
  try {
    // RoutePages
    await prisma.routePage.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    // StaticPages
    await prisma.staticPage.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    
    revalidatePath("/admin/pages");
    revalidatePath("/admin/dashboard/pages");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error deleting bulk pages:", error);
    return { success: false, error: "Error al borrar las páginas" };
  }
}

export async function updateBulkPagesStatus(ids: string[], isActive: boolean) {
  try {
    // RoutePages
    await prisma.routePage.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive,
      },
    });
    // StaticPages
    await prisma.staticPage.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive,
      },
    });
    
    revalidatePath("/admin/pages");
    revalidatePath("/admin/dashboard/pages");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error updating bulk pages status:", error);
    return { success: false, error: "Error al actualizar los estados" };
  }
}
