"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/modules/auth/permissions";

export async function clearSystemCacheAction() {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    // Revalidar el layout principal invalida todas las páginas anidadas
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing cache:", error);
    return { error: "No se pudo limpiar la caché." };
  }
}
