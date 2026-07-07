"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteBulkPosts(ids: string[]) {
  try {
    await prisma.post.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    revalidatePath("/admin/posts");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error deleting bulk posts:", error);
    return { success: false, error: "Error al borrar las entradas" };
  }
}

export async function updateBulkPostsStatus(ids: string[], isActive: boolean) {
  try {
    await prisma.post.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isActive,
      },
    });
    revalidatePath("/admin/posts");
    return { success: true, count: ids.length };
  } catch (error) {
    console.error("Error updating bulk posts status:", error);
    return { success: false, error: "Error al actualizar los estados" };
  }
}
