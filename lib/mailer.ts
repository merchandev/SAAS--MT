import nodemailer from "nodemailer";

// Singleton transporter — se crea una sola vez y se reutiliza
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // Puerto 465 usa SSL directo
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const FROM_ADDRESS = `${process.env.SMTP_FROM_NAME || "Transfers in Barcelona"} <${process.env.SMTP_USER || "info@transfersinbarcelona.com"}>`;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Usado para registrar el tipo de evento en NotificationLog */
  eventType?: string;
  /** ID de reserva para trazabilidad */
  bookingId?: string;
}

/**
 * Registra el intento de envío en la tabla NotificationLog.
 */
async function logEmailAttempt(opts: {
  recipient: string;
  subject: string;
  eventType?: string;
  bookingId?: string;
  status: "SENT" | "FAILED";
  errorReason?: string;
}) {
  // Import dinámico para evitar problemas en tiempo de build
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.notificationLog.create({
      data: {
        recipient: opts.recipient,
        type: "EMAIL",
        eventType: opts.eventType || null,
        subject: opts.subject,
        bookingId: opts.bookingId || null,
        status: opts.status,
        errorReason: opts.errorReason || null,
      },
    });
  } catch (logErr) {
    // Nunca romper el flujo por un error de log
    console.warn("[MAILER_LOG_WARN] No se pudo registrar en NotificationLog:", logErr);
  }
}

/**
 * Envía un email via SMTP Hostinger y lo registra en NotificationLog.
 * Devuelve true si se envió con éxito, false en caso de error.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  eventType,
  bookingId,
}: SendEmailOptions): Promise<boolean> {
  // En build time no intentamos enviar emails
  if (process.env.NEXT_PUBLIC_IS_BUILDING === "true") {
    console.log(`[MAILER_BUILD_SKIP] Skipping email to: ${to}`);
    return true;
  }

  const recipient = Array.isArray(to) ? to.join(", ") : to;

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[MAILER_MOCK] SMTP no configurado. Email simulado para: ${recipient} | ${subject}`);
    await logEmailAttempt({ recipient, subject, eventType, bookingId, status: "SENT", errorReason: "MOCK_MODE" });
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_ADDRESS,
      to: recipient,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER,
    });

    console.log(`[MAILER_OK] Email enviado a ${recipient} | ID: ${info.messageId}`);
    await logEmailAttempt({ recipient, subject, eventType, bookingId, status: "SENT" });
    return true;
  } catch (error: any) {
    console.error(`[MAILER_ERROR] Fallo al enviar email a ${recipient}:`, error);
    await logEmailAttempt({
      recipient,
      subject,
      eventType,
      bookingId,
      status: "FAILED",
      errorReason: error?.message || "Unknown error",
    });
    return false;
  }
}

/**
 * Verifica la conexión SMTP (útil para diagnósticos desde el panel admin)
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
