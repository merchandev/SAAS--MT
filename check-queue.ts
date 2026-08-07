import { prisma } from './lib/prisma';

async function main() {
  const counts = await prisma.outboundEmail.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  });
  console.log("OutboundEmail statuses:", counts);

  const lastQueued = await prisma.outboundEmail.findFirst({
    where: { status: 'QUEUED' },
    orderBy: { availableAt: 'desc' },
    select: { id: true, availableAt: true, lockedUntil: true, attempts: true, campaignId: true }
  });
  console.log("Last QUEUED availableAt:", lastQueued?.availableAt);

  const nextQueued = await prisma.outboundEmail.findFirst({
    where: { status: 'QUEUED' },
    orderBy: { availableAt: 'asc' },
    select: { id: true, availableAt: true, lockedUntil: true, attempts: true, campaignId: true }
  });
  console.log("Next QUEUED availableAt:", nextQueued?.availableAt);

  const activeCampaigns = await prisma.emailCampaign.findMany({
    where: { status: 'SENDING' },
    select: { id: true, name: true, scheduledAt: true, sendFromHour: true, sendToHour: true }
  });
  console.log("Active campaigns:", activeCampaigns);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
