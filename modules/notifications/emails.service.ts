import { Resend } from 'resend';
import { render } from '@react-email/render';
import { BookingConfirmedEmail } from '@/components/emails/BookingConfirmedEmail';
import { DriverAssignedEmail } from '@/components/emails/DriverAssignedEmail';
import { AccountCreatedEmail } from '@/components/emails/AccountCreatedEmail';
import { createReceiptAccessToken } from '@/modules/bookings/receipt-access';
import React from 'react';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER_EMAIL = 'no-reply@transfersinbarcelona.com'; // Sustituir por dominio verificado en producción

export const emailsService = {
  async sendBookingConfirmation(email: string, publicCode: string, customerName: string, bookingDetails: any) {
    if (!resend) {
      console.log(`[EMAILS_MOCK] Simulando envío de confirmación a: ${email} (código ${publicCode})`);
      return true;
    }

    try {
      let receiptUrl: string | undefined;
      if (bookingDetails?.id) {
        const receiptToken = await createReceiptAccessToken({
          id: bookingDetails.id,
          publicCode,
        });
        const url = new URL(`/booking/${publicCode}/receipt`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
        url.searchParams.set("token", receiptToken);
        receiptUrl = url.toString();
      }

      const html = await render(
        React.createElement(BookingConfirmedEmail, {
          customerName,
          publicCode,
          originAddress: bookingDetails.originAddress,
          destinationAddress: bookingDetails.destinationAddress,
          serviceDate: bookingDetails.serviceDate.toISOString().split('T')[0],
          serviceTime: bookingDetails.serviceTime,
          passengers: bookingDetails.passengers,
          receiptUrl,
        })
      );

      await resend.emails.send({
        from: `MeTransfers <${SENDER_EMAIL}>`,
        to: email,
        subject: `Confirmación de Reserva - ${publicCode}`,
        html,
      });

      console.log(`[EMAIL_SENT] Confirmación enviada a ${email}`);
      return true;
    } catch (error) {
      console.error("[EMAIL_ERROR] Error al enviar confirmación:", error);
      return false;
    }
  },

  async sendDriverAssignedNotification(email: string, publicCode: string, customerName: string, driverDetails: any, bookingDetails: any) {
    if (!resend) {
      console.log(`[EMAILS_MOCK] Simulando envío de chofer asignado a: ${email} (chofer: ${driverDetails.name})`);
      return true;
    }

    try {
      const html = await render(
        React.createElement(DriverAssignedEmail, {
          customerName,
          publicCode,
          driverName: driverDetails.name,
          driverPhone: driverDetails.phone,
          originAddress: bookingDetails.originAddress,
          serviceDate: bookingDetails.serviceDate.toISOString().split('T')[0],
          serviceTime: bookingDetails.serviceTime,
        })
      );

      await resend.emails.send({
        from: `MeTransfers <${SENDER_EMAIL}>`,
        to: email,
        subject: `Conductor Asignado - ${publicCode}`,
        html,
      });

      console.log(`[EMAIL_SENT] Notificación de chofer enviada a ${email}`);
      return true;
    } catch (error) {
      console.error("[EMAIL_ERROR] Error al enviar notificación de chofer:", error);
      return false;
    }
  },

  async sendAccountCreatedEmail(email: string, fullName: string, temporaryPassword: string) {
    if (!resend) {
      console.log(`[EMAILS_MOCK] Simulando envío de creación de cuenta a: ${email} (pass: ${temporaryPassword})`);
      return true;
    }

    try {
      const loginUrl = new URL(`/login`, process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").toString();
      
      const html = await render(
        React.createElement(AccountCreatedEmail, {
          customerName: fullName,
          email,
          temporaryPassword,
          loginUrl,
        })
      );

      await resend.emails.send({
        from: `MeTransfers <${SENDER_EMAIL}>`,
        to: email,
        subject: `Bienvenido a MeTransfers - Tu cuenta ha sido creada`,
        html,
      });

      console.log(`[EMAIL_SENT] Notificación de cuenta creada enviada a ${email}`);
      return true;
    } catch (error) {
      console.error("[EMAIL_ERROR] Error al enviar notificación de creación de cuenta:", error);
      return false;
    }
  },

  async sendAdminNotification(publicCode: string) {
    console.log(`[EMAILS_MOCK] Alerta a ADMIN: Nueva reserva confirmada con código ${publicCode}.`);
    return true;
  }
};
