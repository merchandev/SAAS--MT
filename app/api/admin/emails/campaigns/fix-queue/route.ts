import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const result = await prisma.outboundEmail.updateMany({
    where: { status: 'QUEUED' },
    data: { availableAt: new Date() }
  });
  return NextResponse.json({ success: true, count: result.count });
}
