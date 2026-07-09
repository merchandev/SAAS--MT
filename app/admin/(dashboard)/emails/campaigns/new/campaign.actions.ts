"use server";

import { prisma } from "@/lib/prisma";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";
import { sendEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";

export async function sendCampaignAction(data: {
  name: string;
  subject: string;
  body: string;
  recipients: string[];
  contactPhone?: string;
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
        contactPhone: data.contactPhone || "+34 662 02 41 36",
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // We shouldn't await all emails synchronously if the list is huge,
    // but for simplicity in this SAAS MVP we can process them asynchronously.
    // We will fire and forget the sending process so the action returns quickly.
    
    processCampaign(campaign.id, data.subject, data.body, data.recipients, campaign.contactPhone || "+34 662 02 41 36").catch(console.error);

    revalidatePath("/admin/emails/campaigns");
    
    return { success: true, id: campaign.id };
  } catch (error: any) {
    console.error("[CAMPAIGN_ERROR]", error);
    return { error: error.message || "Error al iniciar campaña" };
  }
}

async function processCampaign(campaignId: string, subject: string, body: string, recipients: string[], contactPhone: string) {
  const { DynamicLayoutEmail } = await import("@/components/emails/DynamicLayoutEmail");
  const { render } = await import("@react-email/render");
  const React = await import("react");

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

export async function resendCampaignAction(campaignId: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    const original = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!original) throw new Error("Campaña original no encontrada");

    // Array validation for JSON field
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

    // Start background processing
    processCampaign(
      newCampaign.id,
      newCampaign.subject,
      newCampaign.content,
      recipientsArray as string[],
      newCampaign.contactPhone || "+34 662 02 41 36"
    ).catch(console.error);

    revalidatePath("/admin/emails/campaigns");
    
    return { success: true, id: newCampaign.id };
  } catch (error: any) {
    console.error("[RESEND_CAMPAIGN_ERROR]", error);
    return { error: error.message || "Error al reenviar campaña" };
  }
}

export async function softDeleteCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/admin/emails/campaigns");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al mover a papelera" };
  }
}

export async function restoreCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/admin/emails/campaigns");
export async function hardDeleteCampaignAction(id: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);
    await prisma.emailCampaign.delete({
      where: { id },
    });
    revalidatePath("/admin/emails/campaigns");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al eliminar definitivamente" };
  }
}

export async function previewCampaignHtmlAction(subject: string, body: string, contactPhone: string) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
    const { DynamicLayoutEmail } = await import("@/components/emails/DynamicLayoutEmail");
    const { render } = await import("@react-email/render");
    const React = await import("react");

    const html = await render(
      React.createElement(DynamicLayoutEmail, {
        previewText: subject,
        dynamicHtml: body,
        contactPhone: contactPhone || "+34 662 02 41 36",
      })
    );

    return { success: true, html };
  } catch (error: any) {
    console.error("[PREVIEW_CAMPAIGN_ERROR]", error);
    return { error: "Error al generar la previsualización" };
  }
}
