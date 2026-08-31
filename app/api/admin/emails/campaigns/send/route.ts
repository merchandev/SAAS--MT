import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";
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
    
    const campaignData = {
      companyId: await getTenantId(),
      name: data.name,
      subject: data.subject,
      content: data.body,
      legacyRecipients: data.recipients ? (data.recipients as any) : undefined,
      marketingSegmentId: data.marketingSegmentId,
      marketingListId: data.marketingListId,
      emailTemplateId: data.emailTemplateId,
      contactPhone: data.contactPhone || "+34 662 02 41 36",
      sendingRate: data.sendingRate || emailConfig.limits.maxCampaignRatePerHour,
      sendFromHour: data.sendFromHour || null,
      sendToHour: data.sendToHour || null,
      maxDailySends: data.maxDailySends ? parseInt(data.maxDailySends, 10) : 5000,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      status: "QUEUING", // It will be materializing in the background
      startedAt: new Date(),
    };
    
    let campaign;
    if (data.id) {
      campaign = await prisma.emailCampaign.update({
        where: { id: data.id },
        data: campaignData,
      });
    } else {
      campaign = await prisma.emailCampaign.create({
        data: campaignData,
      });
    }

    // Fire and forget materialization processing
    materializeCampaign(campaign.id).catch(console.error);

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (error: any) {
    console.error("[CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al iniciar campaña" }, { status: 500 });
  }
}
