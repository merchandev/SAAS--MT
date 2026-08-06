import { prisma } from './lib/prisma';

async function main() {
  const campaignId = '37d8fdc9-d4b5-4f4a-be76-8c0ba4fe1f7e'; 

  const recipientStats = await prisma.campaignRecipient.groupBy({
    by: ['status'],
    where: { campaignId },
    _count: { id: true }
  });
  console.log("=== CampaignRecipient Stats ===");
  console.log(recipientStats);
  
  const lastUpdate = await prisma.campaignRecipient.findFirst({
      where: { campaignId },
      orderBy: { updatedAt: 'desc' }
  });
  console.log("Last updated at:", lastUpdate?.updatedAt);
}

main().catch(console.error).finally(() => prisma.$disconnect());
