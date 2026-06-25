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
    return { success: true, data: { id: hotel.id } };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "El nombre o slug del hotel ya existe." };
    }
    return { error: "Error al crear el hotel" };
  }
}

export async function updateHotelAction(hotelId: string, data: import("./b2b.schemas").HotelUpdateInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const { updateHotelSchema } = await import("./b2b.schemas");
  const parsed = updateHotelSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const hotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: {
        ...parsed.data,
        slug
      }
    });
    
    revalidatePath("/admin/hotels");
    return { success: true, data: { id: hotel.id } };
  } catch (error: any) {
    console.error("Error updating hotel:", error);
    if (error.code === 'P2002') {
      return { error: "El nombre o slug del hotel ya existe." };
    }
    return { error: `Error al actualizar el hotel: ${error.message}` };
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

export async function createHotelUserAction(data: import("./b2b.schemas").HotelUserCreationInput) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  // Need to import bcryptjs inside or at top, better to require it here to avoid changing top imports just for this
  const bcrypt = require("bcryptjs");
  const { hotelUserCreationSchema } = require("./b2b.schemas");

  const parsed = hotelUserCreationSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos", details: parsed.error.flatten() };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        fullName: parsed.data.fullName,
        role: "HOTEL",
        hotelId: parsed.data.hotelId,
      }
    });

    revalidatePath("/admin/hotels");
    return { success: true, userId: user.id };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "El correo ya está en uso." };
    }
    return { error: "Error al crear el usuario B2B" };
  }
}

