import nodemailer from "nodemailer";
import { emailConfig } from "./config";
import { OutboundEmail } from "@prisma/client";

// Mantenemos una única instancia del transporter para reusar conexiones SMTP
let transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (!transporter) {
    const opts: any = {
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      connectionTimeout: emailConfig.smtp.connectionTimeoutMs,
      socketTimeout: emailConfig.smtp.socketTimeoutMs,
      ignoreTLS: !emailConfig.smtp.requireTls,
      requireTLS: emailConfig.smtp.requireTls,
    };

    if (emailConfig.smtp.authRequired && emailConfig.smtp.user) {
      opts.auth = {
        user: emailConfig.smtp.user,
        pass: emailConfig.smtp.pass,
      };
    }

    // Configuración para certificados internos si fuera necesario
    if (emailConfig.smtp.requireTls && emailConfig.smtp.caFile) {
      opts.tls = {
        ca: require("fs").readFileSync(emailConfig.smtp.caFile),
      };
    } else if (emailConfig.smtp.host === 'postfix' || emailConfig.smtp.host === 'localhost') {
        // En local development a veces falla TLS por certificados auto-firmados
        opts.tls = { rejectUnauthorized: false };
    }

    transporter = nodemailer.createTransport(opts);
  }
  return transporter;
}

export async function submitToMta(email: OutboundEmail): Promise<{ accepted: boolean; messageId?: string; response?: string; error?: any }> {
  if (!emailConfig.sendEnabled) {
    // Si no está habilitado, simulamos éxito
    return {
      accepted: true,
      messageId: `simulated-${Date.now()}-${email.id}@${emailConfig.hostname}`,
      response: "250 2.0.0 Simulated OK",
    };
  }

  const t = getTransporter();
  
  try {
    const info = await t.sendMail({
      from: {
        name: email.fromName || "",
        address: email.fromEmail,
      },
      to: email.toEmail,
      replyTo: email.replyTo || undefined,
      subject: email.subject,
      html: email.html || undefined,
      text: email.text || undefined,
      envelope: {
        from: email.envelopeFrom,
        to: email.toEmail,
      },
      headers: {
        "X-Email-ID": email.id,
        "X-Campaign-ID": email.campaignId || "",
        "X-Idempotency-Key": email.idempotencyKey,
        ...(typeof email.headers === 'object' && email.headers !== null ? (email.headers as Record<string, string>) : {})
      } as any
    });

    return {
      accepted: !!(info as any).messageId,
      messageId: (info as any).messageId,
      response: (info as any).response,
    };
  } catch (error: any) {
    return {
      accepted: false,
      error,
    };
  }
}
