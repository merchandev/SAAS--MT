"use server";

import { prisma } from "@/lib/prisma";
import { requireRoleAction as requireRole } from "@/modules/auth/permissions";
import { sendEmail } from "@/lib/mailer";
import { getDynamicEmailHtml } from "@/lib/email-templating";
import { revalidatePath } from "next/cache";

export async function saveTemplateAction(data: {
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
}) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    await prisma.notificationTemplate.upsert({
      where: { name: data.name },
      update: {
        subject: data.subject,
        body: data.body,
        isActive: data.isActive,
      },
      create: {
        name: data.name,
        subject: data.subject,
        body: data.body,
        type: "EMAIL",
        isActive: data.isActive,
      },
    });

    revalidatePath("/admin/emails/templates");
    revalidatePath(`/admin/emails/templates/${data.name}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("[SAVE_TEMPLATE_ERROR]", error);
    return { error: error.message || "Error al guardar la plantilla" };
  }
}

export async function testTemplateAction(data: {
  name: string;
  subject: string;
  body: string;
}) {
  try {
    await requireRole(["SUPER_ADMIN", "ADMIN"]);

    // Use dummy data for testing
    const dummyVariables = {
      customerName: "Juan PÃ©rez (Test)",
      publicCode: "MT-TEST-1234",
      serviceDate: "SÃ¡bado, 15 de julio de 2026",
      serviceTime: "14:30",
      originAddress: "Aeropuerto BCN",
      destinationAddress: "Hotel W Barcelona",
      passengers: 2,
      totalPrice: "â‚¬45.00",
      receiptUrl: "https://transfersinbarcelona.com",
    };

    // Override the DB fetch by passing it directly to our templating logic?
    // Wait, getDynamicEmailHtml relies on the DB. 
    // We should build a standalone compilation for previewing.
    
    let compiledBody = data.body;
    let compiledSubject = data.subject;

    for (const [key, value] of Object.entries(dummyVariables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      const stringValue = value !== undefined && value !== null ? String(value) : "";
      compiledBody = compiledBody.replace(regex, stringValue);
      compiledSubject = compiledSubject.replace(regex, stringValue);
    }

    const { DynamicLayoutEmail } = await import("@/components/emails/DynamicLayoutEmail");
    const { render } = await import("@react-email/render");
    const React = await import("react");

    const html = await render(
      React.createElement(DynamicLayoutEmail, {
        previewText: compiledSubject,
        dynamicHtml: compiledBody,
      })
    );

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "info@transfersinbarcelona.com";

    const sent = await sendEmail({
      to: adminEmail,
      subject: `[PRUEBA] ${compiledSubject}`,
      html,
      eventType: "TEST_EMAIL",
    });

    if (!sent) {
      return { error: "Fallo al enviar el correo SMTP" };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[TEST_TEMPLATE_ERROR]", error);
    return { error: error.message || "Error al probar la plantilla" };
  }
}
