"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hotelCreationSchema, HotelCreationInput } from "./b2b.schemas";
import crypto from "crypto";
import { requireRole } from "../auth/permissions";

export async function createHotelAction(data: HotelCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const parsed = hotelCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const uniqueToken = crypto.randomBytes(16).toString('hex'); // Token seguro para acceso directo (QR)

    const hotel = await prisma.hotel.create({
      data: {
        ...parsed.data,
        slug,
        token: uniqueToken,
      }
    });
    
    revalidatePath("/admin/hotels");
    return { success: true, data: hotel };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "El nombre o slug del hotel ya existe." };
    }
    return { error: "Error al crear el hotel" };
  }
}

export async function regenerateHotelTokenAction(hotelId: string) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  try {
    const newToken = crypto.randomBytes(16).toString('hex');
    await prisma.hotel.update({
      where: { id: hotelId },
      data: { token: newToken }
    });
    revalidatePath("/admin/hotels");
    return { success: true };
  } catch (error) {
    return { error: "Error al regenerar token" };
  }
}
