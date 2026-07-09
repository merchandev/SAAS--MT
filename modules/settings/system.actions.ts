"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";

export async function clearSystemCacheAction() {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    // Revalidar el layout principal invalida todas las pÃ¡ginas anidadas
    revalidatePath("/", "layout");
    updateTag("settings");
    updateTag("home-settings");
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing cache:", error);
    return { error: "No se pudo limpiar la cachÃ©." };
  }
}
