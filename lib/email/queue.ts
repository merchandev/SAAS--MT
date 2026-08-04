import { prisma } from "@/lib/prisma";
import { emailConfig } from "./config";
import { normalizeEmail } from "./normalize";
import { randomUUID } from "crypto";

export interface QueueEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  kind?: "TRANSACTIONAL" | "MARKETING";
  priority?: number;
  payload?: any;
  bookingId?: string;
  campaignId?: string;
  campaignRecipientId?: string;
}

export async function queueEmail(options: QueueEmailOptions) {
  const { normalized, valid } = validateAndNormalizeEmail(options.to);
  if (!valid) {
    throw new Error(`Invalid email address: ${options.to}`);
  }

  const kind = options.kind || "TRANSACTIONAL";
  const priority = options.priority ?? (kind === "TRANSACTIONAL" ? 10 : 50);

  // Generamos IdempotencyKey para transaccionales si se asocian a un bookingId,
  // pero para no chocar si mandamos varios, le añadimos un random o evento.
  const idempotencyKey = randomUUID();

  return await prisma.outboundEmail.create({
    data: {
      idempotencyKey,
      kind,
      priority,
      status: "QUEUED",
      toEmail: options.to,
      normalizedToEmail: normalized,
      fromEmail: kind === "TRANSACTIONAL" ? emailConfig.fromTransactional : emailConfig.fromMarketing,
      fromName: emailConfig.fromName,
      replyTo: options.replyTo || emailConfig.replyTo,
      envelopeFrom: `bounces+${randomUUID()}@${emailConfig.bounceDomain}`,
      subject: options.subject,
      html: options.html,
      text: options.text,
      payload: options.payload || {},
      bookingId: options.bookingId,
      campaignId: options.campaignId,
      campaignRecipientId: options.campaignRecipientId,
    },
  });
}

function validateAndNormalizeEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: emailRegex.test(email),
    normalized: email.trim().toLowerCase(),
  };
}
