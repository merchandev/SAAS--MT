import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { runCampaign } from "@/lib/campaign-runner";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const original = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!original) {
      return NextResponse.json({ error: "Campaña original no encontrada" }, { status: 404 });
    }

    const recipientsArray = Array.isArray(original.recipients) 
      ? original.recipients 
      : typeof original.recipients === "string"
      ? [original.recipients]
      : [];

    const newCampaign = await prisma.emailCampaign.create({
      data: {
        name: `${original.name} (Reenvío)`,
        subject: original.subject,
        content: original.content,
        recipients: recipientsArray,
        contactPhone: original.contactPhone,
        sendingRate: original.sendingRate,
        sendFromHour: original.sendFromHour,
        sendToHour: original.sendToHour,
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // Fire and forget
    runCampaign(newCampaign.id).catch(console.error);

    return NextResponse.json({ success: true, id: newCampaign.id });
  } catch (error: any) {
    console.error("[RESEND_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al reenviar campaña" }, { status: 500 });
  }
}
