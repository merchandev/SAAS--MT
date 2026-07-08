/**
 * emails.service.ts
 * Servicio central de notificaciones por email.
 * Usa Nodemailer + SMTP de Hostinger (lib/mailer.ts).
 */

import { render } from "@react-email/render";
import React from "react";
import { sendEmail } from "@/lib/mailer";
import { createReceiptAccessToken } from "@/modules/bookings/receipt-access";

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
      const { BookingPendingEmail } = await import(
        "@/components/emails/BookingPendingEmail"
      );

      const html = await render(
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

      const clientOk = await sendEmail({
        to: email,
        subject: `Reserva recibida — Pendiente de confirmación #${publicCode}`,
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
      const { BookingConfirmedEmail } = await import(
        "@/components/emails/BookingConfirmedEmail"
      );

      let receiptUrl: string | undefined;
      if (booking?.id) {
        const token = await createReceiptAccessToken({ id: booking.id, publicCode });
        receiptUrl = `${APP_URL}/booking/${publicCode}/receipt?token=${token}`;
      }

      const html = await render(
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

      return sendEmail({
        to: email,
        subject: `✅ Reserva Confirmada #${publicCode} — Transfers in Barcelona`,
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
      const { BookingCancelledEmail } = await import(
        "@/components/emails/BookingCancelledEmail"
      );

      const html = await render(
        React.createElement(BookingCancelledEmail, {
          customerName,
          publicCode,
          serviceDate: formatDate(booking.serviceDate),
          serviceTime: booking.serviceTime,
          cancellationReason,
        })
      );

      return sendEmail({
        to: email,
        subject: `Reserva Cancelada #${publicCode}`,
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
      const { BookingRefundedEmail } = await import(
        "@/components/emails/BookingRefundedEmail"
      );

      const html = await render(
        React.createElement(BookingRefundedEmail, {
          customerName,
          publicCode,
          totalPrice: formatPrice(booking.finalPrice),
        })
      );

      return sendEmail({
        to: email,
        subject: `Reembolso procesado para reserva #${publicCode}`,
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
      const { TripStartedEmail } = await import(
        "@/components/emails/TripStartedEmail"
      );

      const html = await render(
        React.createElement(TripStartedEmail, {
          customerName,
          publicCode,
          driverName: driver?.name || "Tu conductor",
          driverPhone: driver?.phone || undefined,
          originAddress: booking.originAddress,
          serviceTime: booking.serviceTime,
        })
      );

      return sendEmail({
        to: email,
        subject: `🚗 Tu traslado ha comenzado — #${publicCode}`,
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
      const { TripCompletedEmail } = await import(
        "@/components/emails/TripCompletedEmail"
      );

      const html = await render(
        React.createElement(TripCompletedEmail, {
          customerName,
          publicCode,
          originAddress: booking.originAddress,
          destinationAddress: booking.destinationAddress,
          serviceDate: formatDate(booking.serviceDate),
        })
      );

      const ok = await sendEmail({
        to: email,
        subject: `✅ Viaje completado — Gracias, ${customerName}`,
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
      const { ReviewRequestedEmail } = await import(
        "@/components/emails/ReviewRequestedEmail"
      );

      const reviewUrl = await buildReviewUrl(booking.id, publicCode);

      const html = await render(
        React.createElement(ReviewRequestedEmail, {
          customerName,
          publicCode,
          reviewUrl,
          serviceDate: formatDate(booking.serviceDate),
        })
      );

      return sendEmail({
        to: email,
        subject: `⭐ ¿Cómo fue tu traslado? Valóralo en 30 segundos`,
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
      const { AdminNewBookingEmail } = await import(
        "@/components/emails/AdminNewBookingEmail"
      );

      const adminUrl = `${APP_URL}/admin/bookings/${booking.id}`;

      const html = await render(
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

      return sendEmail({
        to: ADMIN_EMAIL,
        subject: `🔔 Nueva reserva #${publicCode} — ${customerName} (${formatDate(booking.serviceDate)})`,
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
   * Cuenta creada (mantener compatibilidad con código existente)
   */
  async sendAccountCreatedEmail(
    email: string,
    fullName: string,
    temporaryPassword: string
  ): Promise<boolean> {
    try {
      const { AccountCreatedEmail } = await import(
        "@/components/emails/AccountCreatedEmail"
      );

      const html = await render(
        React.createElement(AccountCreatedEmail, {
          customerName: fullName,
          email,
          temporaryPassword,
          loginUrl: `${APP_URL}/login`,
        })
      );

      return sendEmail({
        to: email,
        subject: `Bienvenido/a a Transfers in Barcelona — Tu cuenta ha sido creada`,
        html,
      });
    } catch (err) {
      console.error("[EMAIL_ERROR] sendAccountCreatedEmail:", err);
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
