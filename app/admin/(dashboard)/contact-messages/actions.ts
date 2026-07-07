"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMessageStatus(id: string, status: string) {
  try {
    const validStatuses = ["NEW", "READ", "REPLIED", "ARCHIVED", "DELETED"];
    if (!validStatuses.includes(status)) {
      return { error: "Estado no válido" };
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/contact-messages");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { error: "No se pudo actualizar el estado" };
  }
}

export async function deleteMessagePermanently(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id },
    });

    revalidatePath("/admin/contact-messages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { error: "No se pudo eliminar el mensaje" };
  }
}
