import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { emailConfig } from "./config";
import { evaluateSegment } from "../marketing/segment-evaluator";
import { renderTemplate } from "./template-renderer";

export async function materializeCampaign(campaignId: string) {
  try {
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
      include: {
        campaignRecipients: true,
      }
    });

    if (!campaign || campaign.status !== "QUEUING") {
      return;
    }

    let contacts: any[] = [];
    
    // Evaluate Audience
    if (campaign.marketingSegmentId) {
      contacts = await evaluateSegment(campaign.marketingSegmentId);
    } else if (campaign.marketingListId) {
      contacts = await prisma.marketingContact.findMany({
        where: {
          lists: { some: { listId: campaign.marketingListId } }
        },
        include: { customer: true }
      });
    } else if (campaign.legacyRecipients && Array.isArray(campaign.legacyRecipients)) {
      // Fallback for legacy string arrays
      contacts = (campaign.legacyRecipients as string[]).map((email) => ({
        email,
        normalizedEmail: email.trim().toLowerCase(),
      }));
    }

    if (!contacts || contacts.length === 0) {
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "FAILED", lastError: "No recipients found for this audience." }
      });
      return;
    }

    // Deduplicate contacts to avoid CampaignRecipient_campaignId_normalizedEmail_key errors
    const uniqueContactsMap = new Map();
    for (const c of contacts) {
      const emailTrimmed = c.normalizedEmail || c.email.trim().toLowerCase();
      if (!uniqueContactsMap.has(emailTrimmed)) {
        uniqueContactsMap.set(emailTrimmed, c);
      }
    }
    contacts = Array.from(uniqueContactsMap.values());

    // Load Template if linked
    let templateHtml = campaign.content || "";
    let templateSubject = campaign.subject;
    if (campaign.emailTemplateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: campaign.emailTemplateId }
      });
      if (template) {
        templateHtml = template.html;
        templateSubject = template.subject;
      }
    }

    const batchSize = 500;
    const dailyLimit = campaign.maxDailySends || 5000;
    const sendingRate = campaign.sendingRate || 50;
    let overallIndex = 0;
    
    for (let i = 0; i < contacts.length; i += batchSize) {
      const chunk = contacts.slice(i, i + batchSize);
      
      await prisma.$transaction(async (tx) => {
        for (const contact of chunk) {
          const currentIndex = overallIndex++;
          const emailTrimmed = contact.normalizedEmail || contact.email.trim().toLowerCase();
          const token = randomBytes(32).toString('hex');
          
          // Check suppression list
          const suppression = await tx.emailSuppression.findUnique({
            where: {
              normalizedEmail_scope: {
                normalizedEmail: emailTrimmed,
                scope: "MARKETING"
              }
            }
          });

          if (suppression && (!suppression.expiresAt || suppression.expiresAt > new Date())) {
            await tx.campaignRecipient.create({
              data: {
                campaignId: campaign.id,
                email: contact.email.trim(),
                normalizedEmail: emailTrimmed,
                status: "SUPPRESSED",
                unsubscribeToken: token,
                lastError: `Suppressed: ${suppression.reason}`
              }
            });
            continue;
          }

          // Generate Unsubscribe Link
          const unsubscribeLink = `${emailConfig.appUrl}/unsubscribe/${token}`;

          // Render Template (merge tags)
          let finalHtml = templateHtml;
          let finalSubject = templateSubject;
          if (contact.id) { // Real MarketingContact
            const rendered = renderTemplate(templateHtml, templateSubject, contact);
            finalHtml = rendered.html;
            finalSubject = rendered.subject;
          }

          // Inject unsubscribe link if not done by renderer
          if (finalHtml.includes("{{unsubscribeUrl}}")) {
             finalHtml = finalHtml.replace(/{{unsubscribeUrl}}/g, unsubscribeLink);
          } else if (finalHtml.includes("{{unsubscribeLink}}")) {
             finalHtml = finalHtml.replace(/{{unsubscribeLink}}/g, unsubscribeLink);
          } else {
             finalHtml += `<br><br><p style="font-size:12px;color:#666;">Para dejar de recibir estos correos, <a href="${unsubscribeLink}">haz clic aquí para cancelar tu suscripción</a>.</p>`;
          }

          // Calculate availableAt based on daily limit and hourly rate
          const dayOffset = Math.floor(currentIndex / dailyLimit);
          const indexWithinDay = currentIndex % dailyLimit;
          const minutesDelayWithinDay = Math.floor(indexWithinDay / sendingRate) * 60;
          
          const availableAt = new Date();
          availableAt.setDate(availableAt.getDate() + dayOffset);
          availableAt.setMinutes(availableAt.getMinutes() + minutesDelayWithinDay);
          
          // Adjust for sendFromHour / sendToHour if needed (simplified, we just ensure it starts at the right time)
          if (campaign.sendFromHour) {
            const [fromH, fromM] = campaign.sendFromHour.split(':').map(Number);
            const currentH = availableAt.getHours();
            if (currentH < fromH) {
               availableAt.setHours(fromH, fromM || 0, 0, 0);
            } else if (campaign.sendToHour) {
               const [toH, toM] = campaign.sendToHour.split(':').map(Number);
               if (currentH >= toH) {
                  // Push to next day
                  availableAt.setDate(availableAt.getDate() + 1);
                  availableAt.setHours(fromH, fromM || 0, 0, 0);
               }
            }
          }

          const recipient = await tx.campaignRecipient.create({
            data: {
              campaignId: campaign.id,
              email: contact.email.trim(),
              normalizedEmail: emailTrimmed,
              status: "QUEUED",
              unsubscribeToken: token,
            }
          });

          // Queue in OutboundEmail
          await tx.outboundEmail.create({
            data: {
              idempotencyKey: `${campaign.id}-${recipient.id}`,
              kind: "MARKETING",
              priority: 50,
              status: "QUEUED",
              toEmail: contact.email.trim(),
              normalizedToEmail: emailTrimmed,
              fromEmail: emailConfig.fromMarketing,
              fromName: campaign.fromName || emailConfig.fromName,
              replyTo: campaign.replyTo || emailConfig.replyTo,
              envelopeFrom: `bounces+${randomBytes(8).toString('hex')}@${emailConfig.bounceDomain}`,
              subject: finalSubject,
              html: finalHtml,
              campaignId: campaign.id,
              campaignRecipientId: recipient.id,
              availableAt: availableAt,
            }
          });
        }
      });
    }

    // Set status to SENDING
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        status: "SENDING",
        legacyRecipients: null as any,
        totalCount: contacts.length
      }
    });

  } catch (error: any) {
    console.error("[CAMPAIGN_MATERIALIZATION_ERROR]", error);
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: { status: "FAILED", lastError: error.message }
    });
  }
}
