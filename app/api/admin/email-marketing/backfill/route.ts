import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/modules/auth/tenant.service";

export async function GET() {
  try {
    const campaigns = await prisma.emailCampaign.findMany({ where: {
        companyId: await getTenantId() } });
    let count = 0;
    
    for (const campaign of campaigns) {
      if (campaign.status === 'DRAFT') continue;
      
      const existingMetrics = await prisma.campaignMetricDaily.findFirst({
        where: { campaignId: campaign.id }
      });
      
      if (existingMetrics) continue;
      
      const date = new Date(campaign.createdAt);
      date.setUTCHours(0,0,0,0);
      
      await prisma.campaignMetricDaily.create({
        data: {
            
            campaignId: campaign.id,
          date: date,
          sentCount: campaign.totalCount,
          deliveredCount: campaign.deliveredCount,
          bouncedCount: campaign.bouncedCount,
          deferredCount: campaign.deferredCount,
          openedCount: 0,
          clickedCount: 0,
          unsubCount: 0
        }
      });
      count++;
    }
    return NextResponse.json({ success: true, backfilled: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
