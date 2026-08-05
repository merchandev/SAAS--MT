import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaigns = await prisma.emailCampaign.findMany({
    select: { id: true, name: true, status: true, totalCount: true, startedAt: true, _count: { select: { campaignRecipients: true, emails: true } } },
    orderBy: { startedAt: 'desc' },
    take: 5
  });
  return NextResponse.json(campaigns);
}
