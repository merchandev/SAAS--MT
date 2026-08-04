import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const recipient = await prisma.campaignRecipient.findUnique({
      where: { unsubscribeToken: token }
    });

    if (!recipient) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    // Insert into suppression list
    await prisma.emailSuppression.upsert({
      where: {
        normalizedEmail_scope: {
          normalizedEmail: recipient.normalizedEmail,
          scope: "MARKETING"
        }
      },
      update: {
        reason: "UNSUBSCRIBED",
        source: "User click",
        campaignId: recipient.campaignId,
        updatedAt: new Date()
      },
      create: {
        email: recipient.email,
        normalizedEmail: recipient.normalizedEmail,
        reason: "UNSUBSCRIBED",
        scope: "MARKETING",
        source: "User click",
        campaignId: recipient.campaignId
      }
    });

    // Update the recipient status
    await prisma.campaignRecipient.update({
      where: { id: recipient.id },
      data: {
        status: "SUPPRESSED",
        suppressedAt: new Date(),
        lastError: "User unsubscribed"
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[UNSUBSCRIBE_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
