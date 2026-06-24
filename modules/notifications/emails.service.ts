export const emailsService = {
  async sendBookingConfirmation(email: string, publicCode: string, customerName: string) {
    // Implementación real con Resend o SendGrid vendrá después.
    // Por ahora, simulamos el envío en los logs.
    console.log(`[EMAILS_MOCK] Simulando envío de confirmación a: ${email}`);
    console.log(`[EMAILS_MOCK] Hola ${customerName}, tu reserva con código ${publicCode} ha sido recibida y confirmada.`);
    
    // Retornamos true para indicar éxito en el mock
    return true;
  },

  async sendAdminNotification(publicCode: string) {
    console.log(`[EMAILS_MOCK] Alerta a ADMIN: Nueva reserva confirmada con código ${publicCode}.`);
    return true;
  }
};
