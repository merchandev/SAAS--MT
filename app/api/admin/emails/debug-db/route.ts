import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const queuedEmails = await prisma.outboundEmail.groupBy({
    by: ['campaignId', 'status'],
    where: { status: { in: ['QUEUED', 'PROCESSING', 'DEFERRED'] } },
    _count: { id: true },
  });

  const campaigns = await prisma.emailCampaign.findMany({
    where: { id: { in: queuedEmails.map(q => q.campaignId).filter(Boolean) as string[] } },
    select: { id: true, subject: true }
  });

  const workerLogs = await prisma.outboundEmail.findMany({
    where: { status: 'ACCEPTED' },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: { id: true, campaignId: true, toEmail: true, updatedAt: true }
  });

  return NextResponse.json({
    message: "Estado real de la base de datos",
    pendingQueueByCampaign: queuedEmails.map(q => ({
      campaignName: campaigns.find(c => c.id === q.campaignId)?.subject || 'Transactional / Unknown',
      status: q.status,
      count: q._count.id
    })),
    lastEmailsSent: workerLogs
  });
}
