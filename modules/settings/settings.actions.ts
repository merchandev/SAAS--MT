"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateSettingsSchema, UpdateSettingsInput } from "./settings.schemas";
import { requireRole } from "../auth/permissions";
import { authService } from "../auth/auth.service";

export async function upsertSettingsAction(data: UpdateSettingsInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = updateSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const operations = Object.entries(parsed.data).map(([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    const session = await authService.getSession();
    
    // Push the audit log creation into the transaction array
    operations.push(
      prisma.auditLog.create({
        data: {
          userId: session?.userId,
          entityType: "SystemSetting",
          entityId: "global",
          action: "UPSERT",
          newValue: JSON.stringify(parsed.data),
        }
      }) as any
    );

    await prisma.$transaction(operations);

    revalidatePath("/admin/settings");
    revalidatePath("/admin/bookings/new");
    revalidatePath("/booking"); // Revalidar front público de reservas
    
    return { success: true };
  } catch (error: any) {
    console.error("Settings Update Error:", error);
    return { error: "Error al guardar la configuración global." };
  }
}
