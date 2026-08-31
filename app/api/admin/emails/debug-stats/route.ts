import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaignId = '37d8fdc9-d4b5-4f4a-be76-8c0ba4fe1f7e'; // Trying this ID assuming it's the right one

  const stats = await prisma.campaignRecipient.groupBy({
    by: ['status'],
    where: { campaignId },
    _count: { id: true }
  });
  
  const emails = await prisma.outboundEmail.findMany({
    where: {
        
        campaignId },
    take: 10,
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ stats, latestEmails: emails.map(e => ({ id: e.id, status: e.status, updatedAt: e.updatedAt })) });
}
