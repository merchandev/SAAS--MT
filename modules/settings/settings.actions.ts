"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { updateSettingsSchema, UpdateSettingsInput } from "./settings.schemas";
import { requireRoleAction as requireRole } from "../auth/permissions";
import { authService } from "../auth/auth.service";

export async function upsertSettingsAction(data: UpdateSettingsInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = updateSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const operations = Object.entries(parsed.data).map(([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    const session = await authService.getSession();

    operations.push(
      prisma.auditLog.create({
        data: {
          userId: session?.userId,
          entityType: "SystemSetting",
          entityId: "global",
          action: "UPSERT",
          newValue: JSON.stringify(parsed.data),
        },
      }) as any
    );

    await prisma.$transaction(operations);

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/bookings/new");
    revalidatePath("/booking");
    updateTag("settings");
    updateTag("home-settings");

    return { success: true };
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return { error: "Error al guardar la configuraciÃ³n global." };
  }
}
