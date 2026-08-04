"use server";

import { prisma } from "@/lib/prisma";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";
import { revalidatePath } from "next/cache";

export async function softDeleteCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/emails/campaigns");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al mover a papelera" };
  }
}

export async function restoreCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/admin/emails/campaigns");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al restaurar" };
  }
}

export async function hardDeleteCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.delete({
      where: { id },
    });
    revalidatePath("/admin/emails/campaigns");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al eliminar definitivamente" };
  }
}
