import { queueEmail } from "./email/queue";
import { getTransporter } from "./email/transport";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Usado para registrar el tipo de evento en NotificationLog (Opcional, en el nuevo sistema usamos OutboundEmail) */
  eventType?: string;
  /** ID de reserva para trazabilidad */
  bookingId?: string;
  /** ID de campaña para correos masivos */
  campaignId?: string;
}

/**
 * Encola un email para ser enviado por el worker.
 * Mantiene la misma firma original para no romper el código existente, pero internamente
 * ahora encola en OutboundEmail.
 * Devuelve true si se encoló con éxito, false en caso de error.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  if (process.env.IS_BUILDING === "true") {
    console.log(`[MAILER_BUILD_SKIP] Skipping email to: ${opts.to}`);
    return true;
  }

  const recipients = Array.isArray(opts.to) ? opts.to : [opts.to];
  let success = true;

  for (const recipient of recipients) {
    try {
      await queueEmail({
        to: recipient,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
        kind: opts.campaignId ? "MARKETING" : "TRANSACTIONAL",
        bookingId: opts.bookingId,
        campaignId: opts.campaignId,
      });
      console.log(`[MAILER_QUEUED] Email encolado para ${recipient}`);
    } catch (error: any) {
      console.error(`[MAILER_ERROR] Fallo al encolar email para ${recipient}:`, error);
      success = false;
    }
  }

  return success;
}

/**
 * Verifica la conexión SMTP (útil para diagnósticos desde el panel admin)
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}
