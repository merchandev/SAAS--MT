/**
 * emails.service.ts
 * Servicio central de notificaciones por email.
 * Usa Nodemailer + SMTP de Hostinger (lib/mailer.ts).
 */

import { render } from "@react-email/render";
import React from "react";
import { sendEmail } from "@/lib/mailer";
import { createReceiptAccessToken } from "@/modules/bookings/receipt-access";
import { getDynamicEmailHtml } from "@/lib/email-templating";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://transfersinbarcelona.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "info@transfersinbarcelona.com";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(price: number | string): string {
  return `€${Number(price).toFixed(2)}`;
}

async function buildReviewUrl(bookingId: string, publicCode: string): Promise<string> {
  const { SignJWT } = await import("jose");
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "metransfers_jwt_dev_secret"
  );
  const token = await new SignJWT({ bookingId, publicCode })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  return `${APP_URL}/valorar/${encodeURIComponent(token)}`;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const emailsService = {
  /**
   * BOOKING_PENDING_CONFIRMATION
   * Se dispara cuando el pago se completa (status PAID / PENDING_PAYMENT confirmado).
   * Destinatarios: cliente + admin.
   */
  async sendBookingPendingConfirmation(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      const { html, subject } = await getDynamicEmailHtml(
        "BOOKING_PENDING",
        {
          customerName,
          publicCode,
          originAddress: booking.originAddress,
          destinationAddress: booking.destinationAddress,
          serviceDate: formatDate(booking.serviceDate),
          serviceTime: booking.serviceTime,
          passengers: booking.passengers,
          totalPrice: formatPrice(booking.finalPrice),
        },
        async () => {
          const { BookingPendingEmail } = await import(
            "@/components/emails/BookingPendingEmail"
          );
          return render(
            React.createElement(BookingPendingEmail, {
              customerName,
              publicCode,
              originAddress: booking.originAddress,
              destinationAddress: booking.destinationAddress,
              serviceDate: formatDate(booking.serviceDate),
              serviceTime: booking.serviceTime,
              passengers: booking.passengers,
              totalPrice: formatPrice(booking.finalPrice),
            })
          );
        }
      );

      const clientOk = await sendEmail({
        to: email,
        subject: subject || `Reserva recibida — Pendiente de confirmación #${publicCode}`,
        html,
        eventType: "BOOKING_PENDING",
        bookingId: booking?.id,
      });

      // Notificación al admin
      await emailsService.sendAdminNewBookingAlert(publicCode, customerName, booking);

      return clientOk;
    } catch (err) {
      console.error("[EMAIL_ERROR] sendBookingPendingConfirmation:", err);
      return false;
    }
  },

  /**
   * BOOKING_CONFIRMED
   * Se dispara cuando el admin cambia el estado a CONFIRMADA.
   */
  async sendBookingConfirmed(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      let receiptUrl: string | undefined;
      if (booking?.id) {
        const token = await createReceiptAccessToken({ id: booking.id, publicCode });
        receiptUrl = `${APP_URL}/booking/${publicCode}/receipt?token=${token}`;
      }

      const { html, subject } = await getDynamicEmailHtml(
        "BOOKING_CONFIRMED",
        {
          customerName,
          publicCode,
          originAddress: booking.originAddress,
          destinationAddress: booking.destinationAddress,
          serviceDate: formatDate(booking.serviceDate),
          serviceTime: booking.serviceTime,
          passengers: booking.passengers,
          totalPrice: formatPrice(booking.finalPrice),
          receiptUrl,
        },
        async () => {
          const { BookingConfirmedEmail } = await import(
            "@/components/emails/BookingConfirmedEmail"
          );
          return render(
            React.createElement(BookingConfirmedEmail, {
              customerName,
              publicCode,
              originAddress: booking.originAddress,
              destinationAddress: booking.destinationAddress,
              serviceDate: formatDate(booking.serviceDate),
              serviceTime: booking.serviceTime,
              passengers: booking.passengers,
              totalPrice: formatPrice(booking.finalPrice),
              receiptUrl,
            })
          );
        }
      );

      return sendEmail({
        to: email,
        subject: subject || `✅ Reserva Confirmada #${publicCode} — Transfers in Barcelona`,
        html,
        eventType: "BOOKING_CONFIRMED",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendBookingConfirmed:", err);
      return false;
    }
  },

  /**
   * BOOKING_CANCELLED
   * Se dispara cuando el admin cambia el estado a CANCELADA.
   */
  async sendBookingCancelled(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any,
    cancellationReason?: string
  ): Promise<boolean> {
    try {
      const { html, subject } = await getDynamicEmailHtml(
        "BOOKING_CANCELLED",
        {
          customerName,
          publicCode,
          serviceDate: formatDate(booking.serviceDate),
          serviceTime: booking.serviceTime,
          cancellationReason,
        },
        async () => {
          const { BookingCancelledEmail } = await import(
            "@/components/emails/BookingCancelledEmail"
          );
          return render(
            React.createElement(BookingCancelledEmail, {
              customerName,
              publicCode,
              serviceDate: formatDate(booking.serviceDate),
              serviceTime: booking.serviceTime,
              cancellationReason,
            })
          );
        }
      );

      return sendEmail({
        to: email,
        subject: subject || `Reserva Cancelada #${publicCode}`,
        html,
        eventType: "BOOKING_CANCELLED",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendBookingCancelled:", err);
      return false;
    }
  },

  /**
   * BOOKING_REFUNDED
   * Se dispara cuando el admin cambia el estado a REEMBOLSADA.
   */
  async sendBookingRefunded(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      const { html, subject } = await getDynamicEmailHtml(
        "BOOKING_REFUNDED",
        {
          customerName,
          publicCode,
          totalPrice: formatPrice(booking.finalPrice),
        },
        async () => {
          const { BookingRefundedEmail } = await import(
            "@/components/emails/BookingRefundedEmail"
          );
          return render(
            React.createElement(BookingRefundedEmail, {
              customerName,
              publicCode,
              totalPrice: formatPrice(booking.finalPrice),
            })
          );
        }
      );

      return sendEmail({
        to: email,
        subject: subject || `Reembolso procesado para reserva #${publicCode}`,
        html,
        eventType: "BOOKING_REFUNDED",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendBookingRefunded:", err);
      return false;
    }
  },

  /**
   * TRIP_STARTED
   * Se dispara cuando el estado cambia a EN_CURSO.
   */
  async sendTripStarted(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any,
    driver?: { name: string; phone?: string | null }
  ): Promise<boolean> {
    try {
      const { html, subject } = await getDynamicEmailHtml(
        "TRIP_STARTED",
        {
          customerName,
          publicCode,
          driverName: driver?.name || "Tu conductor",
          driverPhone: driver?.phone || "",
          originAddress: booking.originAddress,
          serviceTime: booking.serviceTime,
        },
        async () => {
          const { TripStartedEmail } = await import(
            "@/components/emails/TripStartedEmail"
          );
          return render(
            React.createElement(TripStartedEmail, {
              customerName,
              publicCode,
              driverName: driver?.name || "Tu conductor",
              driverPhone: driver?.phone || undefined,
              originAddress: booking.originAddress,
              serviceTime: booking.serviceTime,
            })
          );
        }
      );

      return sendEmail({
        to: email,
        subject: subject || `🚗 Tu traslado ha comenzado — #${publicCode}`,
        html,
        eventType: "TRIP_STARTED",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendTripStarted:", err);
      return false;
    }
  },

  /**
   * TRIP_COMPLETED + REVIEW_REQUESTED
   * Se dispara cuando el estado cambia a COMPLETADA.
   * Envía primero el email de viaje completado y luego el de valoración.
   */
  async sendTripCompleted(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      const { html, subject } = await getDynamicEmailHtml(
        "TRIP_COMPLETED",
        {
          customerName,
          publicCode,
          originAddress: booking.originAddress,
          destinationAddress: booking.destinationAddress,
          serviceDate: formatDate(booking.serviceDate),
        },
        async () => {
          const { TripCompletedEmail } = await import(
            "@/components/emails/TripCompletedEmail"
          );
          return render(
            React.createElement(TripCompletedEmail, {
              customerName,
              publicCode,
              originAddress: booking.originAddress,
              destinationAddress: booking.destinationAddress,
              serviceDate: formatDate(booking.serviceDate),
            })
          );
        }
      );

      const ok = await sendEmail({
        to: email,
        subject: subject || `✅ Viaje completado — Gracias, ${customerName}`,
        html,
        eventType: "TRIP_COMPLETED",
        bookingId: booking?.id,
      });

      // Enviar solicitud de valoración con un pequeño delay (evitar spam doble)
      setTimeout(async () => {
        await emailsService.sendReviewRequested(email, publicCode, customerName, booking);
      }, 3 * 60 * 1000); // 3 minutos

      return ok;
    } catch (err) {
      console.error("[EMAIL_ERROR] sendTripCompleted:", err);
      return false;
    }
  },

  /**
   * REVIEW_REQUESTED
   * Solicita al cliente que valore el servicio.
   */
  async sendReviewRequested(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      const reviewUrl = await buildReviewUrl(booking.id, publicCode);

      const { html, subject } = await getDynamicEmailHtml(
        "REVIEW_REQUESTED",
        {
          customerName,
          publicCode,
          reviewUrl,
          serviceDate: formatDate(booking.serviceDate),
        },
        async () => {
          const { ReviewRequestedEmail } = await import(
            "@/components/emails/ReviewRequestedEmail"
          );
          return render(
            React.createElement(ReviewRequestedEmail, {
              customerName,
              publicCode,
              reviewUrl,
              serviceDate: formatDate(booking.serviceDate),
            })
          );
        }
      );

      return sendEmail({
        to: email,
        subject: subject || `⭐ ¿Cómo fue tu traslado? Valóralo en 30 segundos`,
        html,
        eventType: "REVIEW_REQUESTED",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendReviewRequested:", err);
      return false;
    }
  },

  /**
   * ADMIN — Nueva reserva
   * Notificación interna cuando entra un pago nuevo.
   */
  async sendAdminNewBookingAlert(
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    try {
      const adminUrl = `${APP_URL}/admin/bookings/${booking.id}`;

      const { html, subject } = await getDynamicEmailHtml(
        "ADMIN_NEW_BOOKING",
        {
          publicCode,
          customerName,
          customerEmail: booking.customer?.email || booking.customerEmail || "—",
          customerPhone: booking.customer?.phone || booking.customerPhone || "—",
          originAddress: booking.originAddress,
          destinationAddress: booking.destinationAddress,
          serviceDate: formatDate(booking.serviceDate),
          serviceTime: booking.serviceTime,
          passengers: booking.passengers,
          vehicleName: booking.vehicle?.name || "—",
          totalPrice: formatPrice(booking.finalPrice),
          adminUrl,
        },
        async () => {
          const { AdminNewBookingEmail } = await import(
            "@/components/emails/AdminNewBookingEmail"
          );
          return render(
            React.createElement(AdminNewBookingEmail, {
              publicCode,
              customerName,
              customerEmail: booking.customer?.email || booking.customerEmail || "—",
              customerPhone: booking.customer?.phone || booking.customerPhone || "—",
              originAddress: booking.originAddress,
              destinationAddress: booking.destinationAddress,
              serviceDate: formatDate(booking.serviceDate),
              serviceTime: booking.serviceTime,
              passengers: booking.passengers,
              vehicleName: booking.vehicle?.name || "—",
              totalPrice: formatPrice(booking.finalPrice),
              adminUrl,
            })
          );
        }
      );

      return sendEmail({
        to: ADMIN_EMAIL,
        subject: subject || `🔔 Nueva reserva #${publicCode} — ${customerName} (${formatDate(booking.serviceDate)})`,
        html,
        eventType: "ADMIN_NEW_BOOKING",
        bookingId: booking?.id,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendAdminNewBookingAlert:", err);
      return false;
    }
  },

  /**
   * Cuenta creada - Flujo de seguridad sin contraseña en claro
   */
  async sendWelcomeAndSetPasswordEmail(
    email: string,
    fullName: string,
    resetToken: string
  ): Promise<boolean> {
    try {
      const resetUrl = `${APP_URL}/es/reset-password?token=${resetToken}`;

      const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #222;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
              Me<span style="color: #D4AF37;">Transfers</span>
            </h1>
            <p style="color: #888; font-size: 12px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Barcelona</p>
          </div>
          
          <div style="background-color: #111111; padding: 30px; border-radius: 6px; border: 1px solid #1a1a1a;">
            <h2 style="color: #D4AF37; margin-top: 0; font-size: 20px;">Bienvenido/a, ${fullName}</h2>
            <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">Hemos creado tu cuenta tras tu reserva.</p>
            <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">Para acceder a tu panel de cliente y gestionar tus traslados, por favor establece tu contraseña segura haciendo clic en el botón inferior:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background-color: #D4AF37; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Crear Mi Contraseña</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
            <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0;">Este enlace de seguridad expirará automáticamente en 1 hora por motivos de protección.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #444; font-size: 12px;">&copy; ${new Date().getFullYear()} Transfers in Barcelona. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      return sendEmail({
        to: email,
        subject: \`Bienvenido/a a Transfers in Barcelona — Establece tu contraseña\`,
        html,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendWelcomeAndSetPasswordEmail:", err);
      return false;
    }
  },

  /**
   * Conductor asignado (mantener compatibilidad)
   */
  async sendDriverAssignedNotification(
    email: string,
    publicCode: string,
    customerName: string,
    driverDetails: { name: string; phone?: string | null },
    bookingDetails: any
  ): Promise<boolean> {
    try {
      const { DriverAssignedEmail } = await import(
        "@/components/emails/DriverAssignedEmail"
      );

      const html = await render(
        React.createElement(DriverAssignedEmail, {
          customerName,
          publicCode,
          driverName: driverDetails.name,
          driverPhone: driverDetails.phone || undefined,
          originAddress: bookingDetails.originAddress,
          serviceDate:
            typeof bookingDetails.serviceDate === "string"
              ? bookingDetails.serviceDate
              : bookingDetails.serviceDate.toISOString().split("T")[0],
          serviceTime: bookingDetails.serviceTime,
        })
      );

      return sendEmail({
        to: email,
        subject: `Tu conductor ha sido asignado — Reserva #${publicCode}`,
        html,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendDriverAssignedNotification:", err);
      return false;
    }
  },

  /** Stub para compatibilidad */
  async sendAdminNotification(publicCode: string): Promise<boolean> {
    console.log(`[EMAILS] Admin notification (stub) para: ${publicCode}`);
    return true;
  },

  /** Antiguo nombre — redirige al nuevo */
  async sendBookingConfirmation(
    email: string,
    publicCode: string,
    customerName: string,
    booking: any
  ): Promise<boolean> {
    return emailsService.sendBookingConfirmed(email, publicCode, customerName, booking);
  },
};
