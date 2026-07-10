import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import { sendEmail } from "@/lib/mailer";
import { DynamicLayoutEmail } from "@/components/emails/DynamicLayoutEmail";
import { render } from "@react-email/render";
import * as React from "react";

export async function POST(req: Request) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const data = await req.json();
    
    // Create Campaign in DB
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: data.name,
        subject: data.subject,
        content: data.body,
        recipients: data.recipients,
        contactPhone: data.contactPhone || "+34 662 02 41 36",
        sendingRate: data.sendingRate || 50,
        sendFromHour: data.sendFromHour || null,
        sendToHour: data.sendToHour || null,
        status: "SENDING",
        startedAt: new Date(),
      },
    });

    // Fire and forget processing
    processCampaign(
      campaign.id, 
      data.subject, 
      data.body, 
      data.recipients, 
      campaign.contactPhone || "+34 662 02 41 36",
      campaign.sendingRate,
      campaign.sendFromHour,
      campaign.sendToHour
    ).catch(console.error);

    return NextResponse.json({ success: true, id: campaign.id });
  } catch (error: any) {
    console.error("[CAMPAIGN_API_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al iniciar campaña" }, { status: 500 });
  }
}

// Verifica si la hora actual está dentro de las franjas permitidas
function isWithinAllowedHours(sendFromHour: string | null, sendToHour: string | null): boolean {
  if (!sendFromHour || !sendToHour) return true;
  
  const now = new Date();
  // Usamos hora local del servidor (España preferiblemente)
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
    // Cruza la medianoche (ej: 22:00 a 06:00)
    return currentTotal >= fromTotal || currentTotal <= toTotal;
  }
}

async function processCampaign(
  campaignId: string, 
  subject: string, 
  body: string, 
  recipients: string[], 
  contactPhone: string,
  sendingRate: number = 50,
  sendFromHour: string | null = null,
  sendToHour: string | null = null
) {
  const html = await render(
    React.createElement(DynamicLayoutEmail, {
      previewText: subject,
      dynamicHtml: body,
      contactPhone,
    })
  );

  let sentCount = 0;
  let failedCount = 0;
  
  // Limitar tasa a 50 máximo por seguridad
  const safeRate = Math.min(Math.max(sendingRate, 1), 50);
  const delayMs = Math.floor(60000 / safeRate);

  for (const email of recipients) {
    // Si estamos fuera del horario permitido, dormir 1 minuto y volver a chequear
    while (!isWithinAllowedHours(sendFromHour, sendToHour)) {
      await new Promise(res => setTimeout(res, 60000));
    }

    const ok = await sendEmail({
      to: email,
      subject,
      html,
      eventType: "CAMPAIGN",
      campaignId,
    });

    if (ok) {
      sentCount++;
    } else {
      failedCount++;
    }

    // Delay calculado para respetar la tasa de envío
    await new Promise(res => setTimeout(res, delayMs));
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
