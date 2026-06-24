import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const statusUpdateSchema = z
  .object({
    bookingStatus: z.enum([
      "DRAFT",
      "PENDING_PAYMENT",
      "PAID",
      "POR_CONFIRMAR",
      "CONFIRMADA",
      "ASIGNADA",
      "EN_CURSO",
      "COMPLETADA",
      "CANCELADA",
      "NO_SHOW",
      "REEMBOLSADA",
      "FALLIDA",
    ]).optional(),
    paymentStatus: z.enum([
      "PENDING",
      "AUTHORIZED",
      "PAID",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
    ]).optional(),
    internalNotes: z.string().optional(),
  })
  .refine((value) => value.bookingStatus || value.paymentStatus || value.internalNotes, {
    message: "No hay cambios para aplicar",
  });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  const { id } = await params;
  const body = await request.json();
  const parsed = statusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de estado inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const currentBooking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, bookingStatus: true },
  });

  if (!currentBooking) {
    return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 });
  }

  const updatedBooking = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id },
      data: parsed.data,
    });

    if (parsed.data.bookingStatus && parsed.data.bookingStatus !== currentBooking.bookingStatus) {
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          oldStatus: currentBooking.bookingStatus,
          newStatus: parsed.data.bookingStatus,
          changedBy: session.userId,
          notes: parsed.data.internalNotes,
        },
      });
    }

    return updated;
  });

  return NextResponse.json({ success: true, booking: updatedBooking });
}
