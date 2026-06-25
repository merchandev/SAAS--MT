"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "../auth/permissions";
import { authService } from "../auth/auth.service";

// --- DISCOUNT CODES ---

export async function getDiscountCodes() {
  return await prisma.discountCode.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createDiscountCode(data: {
  code: string;
  description?: string;
  valueType: string;
  value: number;
  maxUses?: number;
  validFrom?: Date;
  validUntil?: Date;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    const code = await prisma.discountCode.create({
      data: {
        ...data,
        code: data.code.toUpperCase().trim(),
        value: data.value,
      }
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "DiscountCode",
        entityId: code.id,
        action: "CREATE",
        newValue: JSON.stringify(data),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error creating discount code:", error);
    return { success: false, error: "No se pudo crear el código de descuento. Es posible que el código ya exista." };
  }
}

export async function updateDiscountCode(id: string, data: {
  code: string;
  description?: string;
  valueType: string;
  value: number;
  maxUses?: number | null;
  validFrom?: Date | null;
  validUntil?: Date | null;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    await prisma.discountCode.update({
      where: { id },
      data: {
        ...data,
        code: data.code.toUpperCase().trim(),
      }
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "DiscountCode",
        entityId: id,
        action: "UPDATE",
        newValue: JSON.stringify(data),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error updating discount code:", error);
    return { success: false, error: "No se pudo actualizar el código de descuento." };
  }
}

export async function toggleDiscountCodeStatus(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    const current = await prisma.discountCode.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Not found" };

    await prisma.discountCode.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "DiscountCode",
        entityId: id,
        action: "TOGGLE_STATUS",
        newValue: JSON.stringify({ isActive: !current.isActive }),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function deleteDiscountCode(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    await prisma.discountCode.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "DiscountCode",
        entityId: id,
        action: "DELETE",
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}

// --- PRICE RULES ---

export async function getPriceRules() {
  return await prisma.priceRule.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPriceRule(data: {
  name: string;
  description?: string;
  type: string;
  valueType: string;
  value: number;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    const rule = await prisma.priceRule.create({ data });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "PriceRule",
        entityId: rule.id,
        action: "CREATE",
        newValue: JSON.stringify(data),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error creating price rule:", error);
    return { success: false, error: "No se pudo crear la regla de precio." };
  }
}

export async function updatePriceRule(id: string, data: {
  name: string;
  description?: string;
  type: string;
  valueType: string;
  value: number;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    await prisma.priceRule.update({
      where: { id },
      data
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "PriceRule",
        entityId: id,
        action: "UPDATE",
        newValue: JSON.stringify(data),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error updating price rule:", error);
    return { success: false, error: "No se pudo actualizar la regla de precio." };
  }
}

export async function togglePriceRuleStatus(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    const current = await prisma.priceRule.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Not found" };

    await prisma.priceRule.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "PriceRule",
        entityId: id,
        action: "TOGGLE_STATUS",
        newValue: JSON.stringify({ isActive: !current.isActive }),
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function deletePriceRule(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  const session = await authService.getSession();
  try {
    await prisma.priceRule.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: session?.userId,
        entityType: "PriceRule",
        entityId: id,
        action: "DELETE",
      }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}
