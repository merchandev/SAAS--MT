import { prisma } from './lib/prisma';
async function main() {
  const camp = await prisma.emailCampaign.findFirst({ orderBy: { startedAt: 'desc' }, select: { id: true, name: true, sendingRate: true, totalCount: true, status: true } });
  if (!camp) return;
  console.log(camp);
  const emails = await prisma.outboundEmail.groupBy({
    by: ['status'],
    where: { campaignId: camp.id },
    _count: { id: true }
  });
  console.log(emails);
  const nextEmail = await prisma.outboundEmail.findFirst({
    where: { campaignId: camp.id, status: 'QUEUED' },
    orderBy: { availableAt: 'asc' },
    select: { availableAt: true }
  });
  console.log('Next available at:', nextEmail?.availableAt);
}
main();
