import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { runCampaign } from "@/lib/campaign-runner";

export async function POST(req: Request) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    
    // Create Campaign in DB
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        content: data.body,
        recipients: data.recipients,
        contactPhone: data.contactPhone || "+34 662 02 41 36",
        sendingRate: data.sendingRate || 30,
        sendFromHour: data.sendFromHour || null,
        sendToHour: data.sendToHour || null,
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // Fire and forget processing
    runCampaign(campaign.id).catch(console.error);

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (error: any) {
    console.error("[CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al iniciar campaña" }, { status: 500 });
  }
}
