import { config } from "dotenv";
config({ path: ".env" });
import { prisma } from "../lib/prisma";

async function backfill() {
  console.log('Fetching campaigns...');
  const campaigns = await prisma.emailCampaign.findMany();
  
  console.log(`Found ${campaigns.length} campaigns. Backfilling metrics...`);
  
  for (const campaign of campaigns) {
    if (campaign.status === 'DRAFT') continue;
    
    // Check if metrics already exist for this campaign
    const existingMetrics = await prisma.campaignMetricDaily.findFirst({
      where: { campaignId: campaign.id }
    });
    
    if (existingMetrics) {
      console.log(`Metrics already exist for campaign ${campaign.name}, skipping...`);
      continue;
    }
    
    const date = new Date(campaign.createdAt);
    date.setUTCHours(0,0,0,0);
    
    // Instead of querying recipients, we can just use the counts stored in the campaign
    await prisma.campaignMetricDaily.create({
      data: {
          
        campaignId: campaign.id,
        date: date,
        sentCount: campaign.totalCount,
        deliveredCount: campaign.deliveredCount,
        bouncedCount: campaign.bouncedCount,
        deferredCount: campaign.deferredCount,
        openedCount: 0, // No way to know historical open count without events
        clickedCount: 0,
        unsubCount: 0
      }
    });
    
    console.log(`Created metrics for campaign: ${campaign.name}`);
  }
  
  console.log('Backfill complete!');
}

backfill()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
