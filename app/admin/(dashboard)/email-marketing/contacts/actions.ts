"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { revalidatePath } from "next/cache";

export async function createContact(data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const contact = await prisma.marketingContact.create({
      data: {
        email: data.email.toLowerCase(),
        normalizedEmail: data.email.toLowerCase(),
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
        country: data.country || null,
        hasConsent: data.hasConsent ?? false,
        consentDate: data.hasConsent ? new Date() : null,
      }
    });
    
    revalidatePath("/admin/email-marketing/contacts");
    return { success: true, contact };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "El email ya existe en la base de datos." };
    }
    return { success: false, error: error.message || "Error al crear el contacto" };
  }
}

export async function updateContact(id: string, data: any) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    const contact = await prisma.marketingContact.update({
      where: { id },
      data: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phone: data.phone || null,
        country: data.country || null,
        hasConsent: data.hasConsent,
      }
    });
    
    revalidatePath("/admin/email-marketing/contacts");
    return { success: true, contact };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar el contacto" };
  }
}

export async function deleteContact(id: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);
  
  try {
    await prisma.marketingContact.delete({
      where: { id }
    });
    
    revalidatePath("/admin/email-marketing/contacts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al borrar el contacto" };
  }
}
