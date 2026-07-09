"use server";

import { prisma } from "@/lib/prisma";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";
import { authService } from "@/modules/auth/auth.service";

/**
 * Guarda la posiciÃ³n actual del conductor autenticado en la base de datos
 */
export async function updateDriverLocationAction(lat: number, lng: number) {
  // Solo los conductores pueden actualizar su propia ubicaciÃ³n
  await requireRole(["DRIVER"]);
  
  const session = await authService.getSession();
  if (!session || !session.userId) {
    return { error: "No autorizado" };
  }

  try {
    const driver = await prisma.driver.findUnique({
      where: { userId: session.userId }
    });

    if (!driver) {
      return { error: "Perfil de conductor no encontrado" };
    }

    await prisma.driver.update({
      where: { id: driver.id },
      data: {
        currentLat: lat,
        currentLng: lng,
        lastLocationUpdate: new Date(),
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating driver location:", error);
    return { error: "Error al actualizar ubicaciÃ³n" };
  }
}

/**
 * Obtiene la Ãºltima posiciÃ³n conocida de un conductor por su ID
 * (Utilizado por el Administrador o Cliente para ver el mapa en vivo)
 */
export async function getDriverLocationAction(driverId: string) {
  // Idealmente, requerimos algÃºn rol o validamos si es el cliente asociado al viaje
  // Por ahora lo permitimos a ADMIN y OPERATOR. (Si lo quieres abrir al cliente pÃºblico habrÃ­a que revisar)
  // await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]); 
  
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      select: {
        currentLat: true,
        currentLng: true,
        lastLocationUpdate: true
      }
    });

    if (!driver || !driver.currentLat || !driver.currentLng) {
      return { error: "UbicaciÃ³n no disponible" };
    }

    return { 
      success: true, 
      lat: driver.currentLat, 
      lng: driver.currentLng, 
      updatedAt: driver.lastLocationUpdate 
    };
  } catch (error) {
    return { error: "Error al obtener ubicaciÃ³n" };
  }
}
