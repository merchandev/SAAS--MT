import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { materializeCampaign } from "@/lib/email/campaign-materializer";

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

    const newCampaign = await prisma.emailCampaign.create({
      data: {
        name: `${original.name} (Reenvío)`,
        subject: original.subject,
        content: original.content,
        legacyRecipients: original.legacyRecipients ? (original.legacyRecipients as any) : undefined,
        marketingSegmentId: original.marketingSegmentId,
        marketingListId: original.marketingListId,
        emailTemplateId: original.emailTemplateId,
        contactPhone: original.contactPhone,
        sendingRate: original.sendingRate,
        sendFromHour: original.sendFromHour,
        sendToHour: original.sendToHour,
        status: "QUEUING", // Must start as QUEUING for materializer
        startedAt: new Date(),
      },
    });

    // Fire and forget
    materializeCampaign(newCampaign.id).catch(console.error);

    return NextResponse.json({ success: true, id: newCampaign.id });
  } catch (error: any) {
    console.error("[RESEND_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al reenviar campaña" }, { status: 500 });
  }
}
