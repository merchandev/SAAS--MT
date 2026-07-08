"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { sendEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";

export async function sendCampaignAction(data: {
  name: string;
  subject: string;
  body: string;
  recipients: string[];
}) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    // Create Campaign in DB
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        content: data.body,
        recipients: data.recipients,
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // We shouldn't await all emails synchronously if the list is huge,
    // but for simplicity in this SAAS MVP we can process them asynchronously.
    // We will fire and forget the sending process so the action returns quickly.
    
    processCampaign(campaign.id, data.subject, data.body, data.recipients).catch(console.error);

    revalidatePath("/admin/emails/campaigns");
    
    return { success: true, id: campaign.id };
  } catch (error: any) {
    console.error("[CAMPAIGN_ERROR]", error);
    return { error: error.message || "Error al iniciar campaña" };
  }
}

async function processCampaign(campaignId: string, subject: string, body: string, recipients: string[]) {
  const { DynamicLayoutEmail } = await import("@/components/emails/DynamicLayoutEmail");
  const { render } = await import("@react-email/render");
  const React = await import("react");

  const html = await render(
    React.createElement(DynamicLayoutEmail, {
      previewText: subject,
      dynamicHtml: body,
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
