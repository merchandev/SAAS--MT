import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRoleApi } from "@/modules/auth/permissions";
import { emailsService } from "@/modules/notifications/emails.service";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const notificationSchema = z.object({
  email: z.string().email(),
  publicCode: z.string().min(1),
  customerName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const parsed = notificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de notificación inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { publicCode: parsed.data.publicCode }
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Reserva no encontrada" },
      { status: 404 }
    );
  }

  await emailsService.sendBookingConfirmation(
    parsed.data.email,
    parsed.data.publicCode,
    parsed.data.customerName,
    booking
  );

  return NextResponse.json({ success: true });
}
