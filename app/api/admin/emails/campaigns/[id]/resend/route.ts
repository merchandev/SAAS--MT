import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { sendEmail } from "@/lib/mailer";
import { DynamicLayoutEmail } from "@/components/emails/DynamicLayoutEmail";
import { render } from "@react-email/render";
import * as React from "react";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const original = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!original) {
      return NextResponse.json({ error: "Campaña original no encontrada" }, { status: 404 });
    }

    const recipientsArray = Array.isArray(original.recipients) 
      ? original.recipients 
      : typeof original.recipients === "string"
      ? [original.recipients]
      : [];

    const newCampaign = await prisma.emailCampaign.create({
      data: {
        name: `${original.name} (Reenvío)`,
        subject: original.subject,
        content: original.content,
        recipients: recipientsArray,
        contactPhone: original.contactPhone,
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // Fire and forget
    processCampaign(
      newCampaign.id,
      newCampaign.subject,
      newCampaign.content,
      recipientsArray as string[],
      newCampaign.contactPhone || "+34 662 02 41 36"
    ).catch(console.error);

    return NextResponse.json({ success: true, id: newCampaign.id });
  } catch (error: any) {
    console.error("[RESEND_CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al reenviar campaña" }, { status: 500 });
  }
}

async function processCampaign(campaignId: string, subject: string, body: string, recipients: string[], contactPhone: string) {
  const html = await render(
    React.createElement(DynamicLayoutEmail, {
      previewText: subject,
      dynamicHtml: body,
      contactPhone,
    })
  );

  let sentCount = 0;
  let failedCount = 0;

  for (const email of recipients) {
    const ok = await sendEmail({
      to: email,
      subject,
      html,
      eventType: "CAMPAIGN",
    });

    if (ok) {
      sentCount++;
    } else {
      failedCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(res => setTimeout(res, 500));
  }

  // Update Campaign
  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      status: failedCount === recipients.length ? "FAILED" : "COMPLETED",
      sentCount,
      failedCount,
      completedAt: new Date(),
    },
  });
}
