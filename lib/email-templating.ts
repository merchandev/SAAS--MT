import { prisma } from "@/lib/prisma";
import { render } from "@react-email/render";
import React from "react";

export async function getDynamicEmailHtml(
  eventType: string,
  variables: Record<string, string | number | undefined>,
  fallbackHtmlPromise: () => Promise<string>
): Promise<{ html: string; subject?: string }> {
  try {
    const template = await prisma.notificationTemplate.findUnique({
      where: { name: eventType },
    });

    if (!template || !template.isActive || !template.body) {
      return { html: await fallbackHtmlPromise() };
    }

    // Replace variables
    let compiledBody = template.body;
    let compiledSubject = template.subject;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      const stringValue = value !== undefined && value !== null ? String(value) : "";
      compiledBody = compiledBody.replace(regex, stringValue);
      compiledSubject = compiledSubject.replace(regex, stringValue);
    }

    // Import DynamicLayoutEmail
    const { DynamicLayoutEmail } = await import("@/components/emails/DynamicLayoutEmail");

    const html = await render(
      React.createElement(DynamicLayoutEmail, {
        previewText: compiledSubject,
        dynamicHtml: compiledBody,
      })
    );

    return { html, subject: compiledSubject };
  } catch (err) {
    console.error("[EMAIL_TEMPLATING_ERROR] Failed to compile dynamic template:", err);
    return { html: await fallbackHtmlPromise() };
  }
}
