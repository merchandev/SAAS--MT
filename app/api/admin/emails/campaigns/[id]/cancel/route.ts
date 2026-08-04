import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
    }

    if (["COMPLETED", "FAILED", "CANCELLED"].includes(campaign.status)) {
      return NextResponse.json({ error: "La campaña ya ha finalizado o está cancelada" }, { status: 400 });
    }

    // Cancelar la campaña
    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "CANCELLED", completedAt: new Date() }
    });
    
    // Marcar como cancelados los correos en la cola
    await prisma.$executeRaw`
      UPDATE "OutboundEmail"
      SET "status" = 'CANCELLED', "updatedAt" = NOW()
      WHERE "campaignId" = ${id} AND "status" IN ('QUEUED', 'DEFERRED')
    `;

    // Marcar como cancelados los recipients
    await prisma.$executeRaw`
      UPDATE "CampaignRecipient"
      SET "status" = 'CANCELLED', "updatedAt" = NOW()
      WHERE "campaignId" = ${id} AND "status" IN ('QUEUED', 'DEFERRED')
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[CANCEL_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al cancelar campaña" }, { status: 500 });
  }
}
