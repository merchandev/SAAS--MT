import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fix = url.searchParams.get("fix") === "true";
  
  let updatedCount = 0;
  
  if (fix) {
    // EMERGENCY: Cancel ALL queued emails because the previous old script set 25,000+ emails to availableAt=NOW
    const emergency = await prisma.outboundEmail.updateMany({
      where: { status: { in: ['QUEUED', 'DEFERRED', 'PROCESSING'] } },
      data: { status: 'CANCELLED' }
    });
    
    updatedCount = emergency.count;
  }
  
  const queuedCount = await prisma.outboundEmail.count({
    where: { status: 'QUEUED' }
  });

  return NextResponse.json({ 
    success: true, 
    cancelledStuckEmails: updatedCount,
    remainingQueuedEmails: queuedCount,
    message: fix ? "EMERGENCIA: Todos los 25,000+ correos han sido CANCELADOS para evitar spam masivo. Por favor, recrea tu campaña ahora." : "Añade ?fix=true a la URL para purgar la cola."
  });
}
