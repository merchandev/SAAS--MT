import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { DynamicLayoutEmail } from "@/components/emails/DynamicLayoutEmail";
import { render } from "@react-email/render";
import * as React from "react";

// Helper function to check allowed hours
function isWithinAllowedHours(sendFromHour: string | null, sendToHour: string | null): boolean {
  if (!sendFromHour || !sendToHour) return true;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotal = currentHour * 60 + currentMinute;

  const [fromH, fromM] = sendFromHour.split(":").map(Number);
  const [toH, toM] = sendToHour.split(":").map(Number);
  const fromTotal = fromH * 60 + fromM;
  const toTotal = toH * 60 + toM;

  if (fromTotal < toTotal) {
    return currentTotal >= fromTotal && currentTotal <= toTotal;
  } else {
    // Crosses midnight
    return currentTotal >= fromTotal || currentTotal <= toTotal;
  }
}

/**
 * Executes a mass email campaign in the background.
 * Fetches campaign details from the DB, allowing resume logic.
 */
export async function runCampaign(campaignId: string) {
  try {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign || campaign.status === "CANCELLED") {
      return;
    }

    if (campaign.status !== "SENDING") {
      // For instance, if it's PAUSED, don't start
      return;
    }

    const html = await render(
      React.createElement(DynamicLayoutEmail, {
        previewText: campaign.subject,
        dynamicHtml: campaign.content,
        contactPhone: campaign.contactPhone || "+34 662 02 41 36",
      })
    );

    // Get all recipients to process
    const recipientsRaw = Array.isArray(campaign.recipients) 
      ? (campaign.recipients as string[]) 
      : [];

    if (recipientsRaw.length === 0) return;

    // Determine safe rate limit delay
    const sendingRate = campaign.sendingRate || 50;
    const safeRate = Math.min(Math.max(sendingRate, 1), 50);
    const delayMs = Math.floor(60000 / safeRate);

    // Filter recipients that haven't been sent yet
    const existingLogs = await prisma.notificationLog.findMany({
      where: { campaignId, type: "EMAIL" },
      select: { recipient: true, status: true },
    });
    
    // We only skip those that are explicitly SENT or FAILED.
    // If they failed due to RateLimit, we MIGHT want to retry them in the future,
    // but for now, any logged attempt is skipped to avoid double-sending to someone who just failed.
    const processedEmails = new Set(existingLogs.map(l => l.recipient));
    const pendingRecipients = recipientsRaw.filter(r => !processedEmails.has(r));

    let localSentCount = existingLogs.filter(l => l.status === "SENT").length;
    let localFailedCount = existingLogs.filter(l => l.status === "FAILED").length;
    let iteration = 0;

    for (const email of pendingRecipients) {
      // 1. Check if paused or cancelled by the user mid-campaign
      if (iteration % 5 === 0) {
        const currentCamp = await prisma.emailCampaign.findUnique({
          where: { id: campaignId },
          select: { status: true }
        });
        
        if (currentCamp?.status === "PAUSED" || currentCamp?.status === "CANCELLED") {
          console.log(`[CAMPAIGN_RUNNER] Campaign ${campaignId} was ${currentCamp.status}. Stopping.`);
          return; // Exit cleanly without marking completed
        }
      }

      // 2. Wait for allowed hour schedule
      while (!isWithinAllowedHours(campaign.sendFromHour, campaign.sendToHour)) {
        await new Promise(res => setTimeout(res, 60000)); // sleep 1 minute
      }

      // 3. Send email
      const { prisma: dynamicPrisma } = await import("@/lib/prisma"); // Just to ensure fresh context in long runners
      
      const ok = await sendEmail({
        to: email,
        subject: campaign.subject,
        html,
        eventType: "CAMPAIGN",
        campaignId,
      });

      // Update counters locally
      if (ok) {
        localSentCount++;
      } else {
        localFailedCount++;
      }
      
      // Update DB periodically (every 10 emails) to allow UI to show rough DB values
      if (iteration % 10 === 0) {
         await dynamicPrisma.emailCampaign.update({
           where: { id: campaignId },
           data: { sentCount: localSentCount, failedCount: localFailedCount }
         });
      }

      iteration++;

      // 4. Check for Rate Limit failures specifically in the last log
      // This is a naive but effective check: if we just failed, check the log reason
      if (!ok) {
        const lastLog = await dynamicPrisma.notificationLog.findFirst({
          where: { campaignId, recipient: email },
          orderBy: { sentAt: 'desc' }
        });

        if (lastLog?.errorReason && lastLog.errorReason.includes("Ratelimit")) {
          console.warn(`[CAMPAIGN_RUNNER] Hostinger Ratelimit hit for campaign ${campaignId}. Backing off for 60 seconds...`);
          await new Promise(res => setTimeout(res, 60000));
        }
      }

      // 5. Standard Delay for rate
      await new Promise(res => setTimeout(res, delayMs));
    }

    // Final Update
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        status: "COMPLETED",
        sentCount: localSentCount,
        failedCount: localFailedCount,
        completedAt: new Date(),
      },
    });
    
    console.log(`[CAMPAIGN_RUNNER] Campaign ${campaignId} completed.`);
  } catch (error) {
    console.error(`[CAMPAIGN_RUNNER] Critical error in campaign ${campaignId}:`, error);
  }
}
