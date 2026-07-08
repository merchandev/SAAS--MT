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
    rejectUnauthorized: false, // Necesario en algunos hosts compartidos
  },
});

const FROM_ADDRESS = `${process.env.SMTP_FROM_NAME || "Transfers in Barcelona"} <${process.env.SMTP_USER || "info@transfersinbarcelona.com"}>`;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Envía un email via SMTP Hostinger.
 * Devuelve true si se envió con éxito, false en caso de error.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions): Promise<boolean> {
  // En build time (Next.js static generation) no intentamos enviar emails
  if (process.env.NEXT_PUBLIC_IS_BUILDING === "true") {
    console.log(`[MAILER_BUILD_SKIP] Skipping email to: ${to}`);
    return true;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[MAILER_MOCK] SMTP no configurado. Email simulado para: ${to} | Asunto: ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_ADDRESS,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER,
    });
    console.log(`[MAILER_OK] Email enviado a ${to} | ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[MAILER_ERROR] Fallo al enviar email a ${to}:`, error);
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
