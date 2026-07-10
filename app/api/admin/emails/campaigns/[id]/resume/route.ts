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

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
    }

    if (campaign.status !== "PAUSED") {
      return NextResponse.json({ error: "La campaña no está pausada" }, { status: 400 });
    }

    await prisma.emailCampaign.update({
      where: { id },
      data: { status: "SENDING" }
    });

    // Fire and forget
    runCampaign(id).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[RESUME_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al reanudar campaña" }, { status: 500 });
  }
}
