import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fix = url.searchParams.get("fix") === "true";
  
  let updatedCount = 0;
  
  if (fix) {
    // 1. Cancel orphaned emails
    const orphaned = await prisma.outboundEmail.updateMany({
      where: { 
        campaignId: null,
        status: { in: ['QUEUED', 'DEFERRED', 'PROCESSING'] }
      },
      data: { status: 'CANCELLED' }
    });

    // 2. Cancel all emails for DRAFT, PAUSED, CANCELLED, FAILED campaigns to clean up the queue
    const cancelledCampaigns = await prisma.outboundEmail.updateMany({
      where: {
        status: { in: ['QUEUED', 'DEFERRED', 'PROCESSING'] },
        campaign: {
          status: { in: ['DRAFT', 'PAUSED', 'CANCELLED', 'FAILED'] }
        }
      },
      data: { status: 'CANCELLED' }
    });
    
    // 3. For any stuck emails from SENDING campaigns, we shouldn't just set availableAt to NOW 
    // because that breaks time boundaries (sendFromHour/sendToHour).
    // Instead, we will CANCEL them if they are beyond 24 hours, so the user has to re-create the campaign.
    const distantFuture = new Date();
    distantFuture.setHours(distantFuture.getHours() + 24);

    const stuckFuture = await prisma.outboundEmail.updateMany({
      where: {
        status: { in: ['QUEUED', 'DEFERRED'] },
        availableAt: { gt: distantFuture }
      },
      data: { status: 'CANCELLED' }
    });

    updatedCount = orphaned.count + cancelledCampaigns.count + stuckFuture.count;
  }
  
  const queuedCount = await prisma.outboundEmail.count({
    where: { status: 'QUEUED' }
  });

  return NextResponse.json({ 
    success: true, 
    cancelledStuckEmails: updatedCount,
    remainingQueuedEmails: queuedCount,
    message: fix ? "Correos huérfanos y atascados han sido cancelados. Por favor recrea tu campaña." : "Añade ?fix=true a la URL para purgar la cola."
  });
}
