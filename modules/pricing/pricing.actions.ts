"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  try {
    await prisma.discountCode.create({
      data: {
        ...data,
        code: data.code.toUpperCase().trim(),
        value: data.value,
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
  try {
    await prisma.discountCode.update({
      where: { id },
      data: {
        ...data,
        code: data.code.toUpperCase().trim(),
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
  try {
    const current = await prisma.discountCode.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Not found" };

    await prisma.discountCode.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function deleteDiscountCode(id: string) {
  try {
    await prisma.discountCode.delete({ where: { id } });
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
  try {
    await prisma.priceRule.create({ data });
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
  try {
    await prisma.priceRule.update({
      where: { id },
      data
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    console.error("Error updating price rule:", error);
    return { success: false, error: "No se pudo actualizar la regla de precio." };
  }
}

export async function togglePriceRuleStatus(id: string) {
  try {
    const current = await prisma.priceRule.findUnique({ where: { id } });
    if (!current) return { success: false, error: "Not found" };

    await prisma.priceRule.update({
      where: { id },
      data: { isActive: !current.isActive }
    });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function deletePriceRule(id: string) {
  try {
    await prisma.priceRule.delete({ where: { id } });
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete" };
  }
}
