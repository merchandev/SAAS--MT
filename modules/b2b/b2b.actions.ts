"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { authService } from "../auth/auth.service";
import { requireRoleAction as requireRole } from "../auth/permissions";
import {
  agencyCreationSchema,
  agencyUserCreationSchema,
  hotelCreationSchema,
  hotelUserCreationSchema,
  updateAgencySchema,
  updateHotelSchema,
  type AgencyCreationInput,
  type AgencyUpdateInput,
  type AgencyUserCreationInput,
  type HotelCreationInput,
  type HotelUpdateInput,
  type HotelUserCreationInput,
} from "./b2b.schemas";

function buildSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildToken() {
  return crypto.randomBytes(16).toString("hex");
}

async function audit(entityType: string, entityId: string, action: string, value?: unknown) {
  const session = await authService.getSession();

  await prisma.auditLog.create({
    data: {
      userId: session?.userId,
      entityType,
      entityId,
      action,
      newValue: value ? JSON.stringify(value) : undefined,
    },
  });
}

export async function createHotelAction(data: HotelCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = hotelCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const hotel = await prisma.hotel.create({
      data: {
        ...parsed.data,
        slug: buildSlug(parsed.data.name),
        token: buildToken(),
      },
    });

    await audit("Hotel", hotel.id, "CREATE", parsed.data);
    revalidatePath("/admin/hotels");
    return { success: true, data: { id: hotel.id } };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "El nombre o slug del hotel ya existe." };
    }
    return { error: "Error al crear el hotel" };
  }
}

export async function updateHotelAction(hotelId: string, data: HotelUpdateInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = updateHotelSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...parsed.data,
        slug: buildSlug(parsed.data.name),
      },
    });

    await audit("Hotel", hotel.id, "UPDATE", parsed.data);
    revalidatePath("/admin/hotels");
    return { success: true, data: { id: hotel.id } };
  } catch (error: any) {
    console.error("Error updating hotel:", error);
    if (error.code === "P2002") {
      return { error: "El nombre o slug del hotel ya existe." };
    }
    return { error: `Error al actualizar el hotel: ${error.message}` };
  }
}

export async function regenerateHotelTokenAction(hotelId: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { token: buildToken() },
    });

    await audit("Hotel", hotel.id, "REGENERATE_TOKEN");
    revalidatePath("/admin/hotels");
    return { success: true };
  } catch (error) {
    return { error: "Error al regenerar token" };
  }
}

export async function createHotelUserAction(data: HotelUserCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = hotelUserCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        fullName: parsed.data.fullName,
        role: "HOTEL",
        hotelId: parsed.data.hotelId,
      },
    });

    await audit("User", user.id, "CREATE_HOTEL_USER", {
      hotelId: parsed.data.hotelId,
      email: user.email,
    });
    revalidatePath("/admin/hotels");
    revalidatePath("/admin/users");
    return { success: true, userId: user.id };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "El correo ya estÃ¡ en uso." };
    }
    return { error: "Error al crear el usuario B2B" };
  }
}

export async function createAgencyAction(data: AgencyCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = agencyCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const agency = await prisma.agency.create({
      data: {
        ...parsed.data,
        slug: buildSlug(parsed.data.name),
        token: buildToken(),
      },
    });

    await audit("Agency", agency.id, "CREATE", parsed.data);
    revalidatePath("/admin/agencies");
    return { success: true, data: { id: agency.id } };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "El nombre o slug de la agencia ya existe." };
    }
    return { error: "Error al crear la agencia" };
  }
}

export async function updateAgencyAction(agencyId: string, data: AgencyUpdateInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = updateAgencySchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        ...parsed.data,
        slug: buildSlug(parsed.data.name),
      },
    });

    await audit("Agency", agency.id, "UPDATE", parsed.data);
    revalidatePath("/admin/agencies");
    return { success: true, data: { id: agency.id } };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "El nombre o slug de la agencia ya existe." };
    }
    return { error: `Error al actualizar la agencia: ${error.message}` };
  }
}

export async function toggleAgencyStatusAction(agencyId: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const current = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!current) return { error: "Agencia no encontrada" };

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { isActive: !current.isActive },
    });

    await audit("Agency", agency.id, "TOGGLE_STATUS", { isActive: agency.isActive });
    revalidatePath("/admin/agencies");
    return { success: true };
  } catch (error) {
    return { error: "Error al cambiar el estado de la agencia" };
  }
}

export async function regenerateAgencyTokenAction(agencyId: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { token: buildToken() },
    });

    await audit("Agency", agency.id, "REGENERATE_TOKEN");
    revalidatePath("/admin/agencies");
    return { success: true };
  } catch (error) {
    return { error: "Error al regenerar token" };
  }
}

export async function createAgencyUserAction(data: AgencyUserCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = agencyUserCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos invÃ¡lidos", details: parsed.error.flatten() };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email.toLowerCase(),
        passwordHash,
        fullName: parsed.data.fullName,
        role: "AGENCY",
        agencyId: parsed.data.agencyId,
      },
    });

    await audit("User", user.id, "CREATE_AGENCY_USER", {
      agencyId: parsed.data.agencyId,
      email: user.email,
    });
    revalidatePath("/admin/agencies");
    revalidatePath("/admin/users");
    return { success: true, userId: user.id };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "El correo ya estÃ¡ en uso." };
    }
    return { error: "Error al crear el usuario de agencia" };
  }
}

export async function toggleHotelStatusAction(hotelId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);

  try {
    const current = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!current) return { error: 'Hotel no encontrado' };

    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { isActive: !current.isActive },
    });

    await audit('Hotel', hotel.id, 'TOGGLE_STATUS', { isActive: hotel.isActive });
    revalidatePath('/admin/hotels');
    return { success: true };
  } catch (error) {
    return { error: 'Error al cambiar el estado del hotel' };
  }
}

export async function softDeleteHotelAction(hotelId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { deletedAt: new Date(), isActive: false },
    });
    await audit('Hotel', hotel.id, 'SOFT_DELETE');
    revalidatePath('/admin/hotels');
    return { success: true };
  } catch (error) {
    return { error: 'Error al mover el hotel a la papelera' };
  }
}

export async function restoreHotelAction(hotelId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { deletedAt: null, isActive: true },
    });
    await audit('Hotel', hotel.id, 'RESTORE');
    revalidatePath('/admin/hotels');
    return { success: true };
  } catch (error) {
    return { error: 'Error al restaurar el hotel' };
  }
}

export async function hardDeleteHotelAction(hotelId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    await prisma.hotel.delete({
      where: { id: hotelId },
    });
    await audit('Hotel', hotelId, 'HARD_DELETE');
    revalidatePath('/admin/hotels');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { error: 'No se puede eliminar permanentemente porque tiene reservas asociadas. Mantenlo en la papelera.' };
    }
    return { error: 'Error al eliminar el hotel permanentemente' };
  }
}


export async function softDeleteAgencyAction(agencyId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { deletedAt: new Date(), isActive: false },
    });
    await audit('Agency', agency.id, 'SOFT_DELETE');
    revalidatePath('/admin/agencies');
    return { success: true };
  } catch (error) {
    return { error: 'Error al mover la agencia a la papelera' };
  }
}

export async function restoreAgencyAction(agencyId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { deletedAt: null, isActive: true },
    });
    await audit('Agency', agency.id, 'RESTORE');
    revalidatePath('/admin/agencies');
    return { success: true };
  } catch (error) {
    return { error: 'Error al restaurar la agencia' };
  }
}

export async function hardDeleteAgencyAction(agencyId: string) {
  await requireRole(['SUPER_ADMIN', 'ADMIN']);
  try {
    await prisma.agency.delete({
      where: { id: agencyId },
    });
    await audit('Agency', agencyId, 'HARD_DELETE');
    revalidatePath('/admin/agencies');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { error: 'No se puede eliminar permanentemente porque tiene reservas asociadas. Mantenla en la papelera.' };
    }
    return { error: 'Error al eliminar la agencia permanentemente' };
  }
}

