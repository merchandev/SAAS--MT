import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { materializeCampaign } from "@/lib/email/campaign-materializer";
import { emailConfig } from "@/lib/email/config";

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
        legacyRecipients: data.recipients,
        marketingSegmentId: data.marketingSegmentId,
        marketingListId: data.marketingListId,
        emailTemplateId: data.emailTemplateId,
        contactPhone: data.contactPhone || "+34 662 02 41 36",
        sendingRate: data.sendingRate || emailConfig.limits.maxCampaignRatePerHour,
        sendFromHour: data.sendFromHour || null,
        sendToHour: data.sendToHour || null,
        status: "QUEUING", // It will be materializing in the background
        startedAt: new Date(),
      },
    });

    // Fire and forget materialization processing
    materializeCampaign(campaign.id).catch(console.error);

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (error: any) {
    console.error("[CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al iniciar campaña" }, { status: 500 });
  }
}
