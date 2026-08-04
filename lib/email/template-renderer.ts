import { MarketingContact, Customer } from "@prisma/client";

export function renderTemplate(
  html: string,
  subject: string,
  contact: MarketingContact & { customer?: Customer | null }
): { html: string; subject: string } {
  let renderedHtml = html;
  let renderedSubject = subject;

  const variables: Record<string, string> = {
    "{{firstName}}": contact.firstName || contact.customer?.fullName?.split(" ")[0] || "there",
    "{{lastName}}": contact.lastName || contact.customer?.fullName?.split(" ").slice(1).join(" ") || "",
    "{{email}}": contact.email,
    "{{phone}}": contact.phone || contact.customer?.phone || "",
    "{{country}}": contact.country || contact.customer?.country || "",
  };

  for (const [key, value] of Object.entries(variables)) {
    // Replace all occurrences in HTML and Subject
    const regex = new RegExp(key, "gi");
    renderedHtml = renderedHtml.replace(regex, value);
    renderedSubject = renderedSubject.replace(regex, value);
  }

  // Inject Unsubscribe Link Placeholder if not present
  if (!renderedHtml.includes("{{unsubscribeUrl}}")) {
    renderedHtml += `<br><br><p style="font-size: 11px; color: #666; text-align: center;">To stop receiving these emails, <a href="{{unsubscribeUrl}}">click here to unsubscribe</a>.</p>`;
  }

  return { html: renderedHtml, subject: renderedSubject };
}
