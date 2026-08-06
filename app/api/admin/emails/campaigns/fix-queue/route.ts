import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fix = url.searchParams.get("fix") === "true";
  
  let updatedCount = 0;
  
  if (fix) {
    const result = await prisma.outboundEmail.updateMany({
      where: { status: { in: ['QUEUED', 'DEFERRED'] } },
      data: { availableAt: new Date() }
    });
    updatedCount = result.count;
  }
  
  const recipientStats = await prisma.campaignRecipient.groupBy({
    by: ['status'],
    where: { campaignId: '37d8fdc9-d4b5-4f4a-be76-8c0ba4fe1f7e' },
    _count: { id: true }
  });

  return NextResponse.json({ 
    success: true, 
    updatedToNow: updatedCount,
    recipientStats,
    message: fix ? "Emails liberados." : "Añade ?fix=true a la URL para forzar la liberación."
  });
}
