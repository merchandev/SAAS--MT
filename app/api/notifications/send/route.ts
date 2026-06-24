import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/auth/permissions";
import { emailsService } from "@/modules/notifications/emails.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const notificationSchema = z.object({
  email: z.string().email(),
  publicCode: z.string().min(1),
  customerName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);

  const body = await request.json();
  const parsed = notificationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de notificación inválidos", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await emailsService.sendBookingConfirmation(
    parsed.data.email,
    parsed.data.publicCode,
    parsed.data.customerName
  );

  return NextResponse.json({ success: true });
}
