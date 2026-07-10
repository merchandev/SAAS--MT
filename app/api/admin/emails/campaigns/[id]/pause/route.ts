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

    if (campaign.status !== "SENDING") {
      return NextResponse.json({ error: "Solo puedes pausar campañas en envío" }, { status: 400 });
    }

    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "PAUSED" }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[PAUSE_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al pausar campaña" }, { status: 500 });
  }
}
