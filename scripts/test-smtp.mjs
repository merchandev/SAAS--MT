/**
 * test-smtp.mjs
 * Prueba la conexión SMTP de Hostinger y envía un email de prueba.
 * Ejecutar con: node scripts/test-smtp.mjs
 */

import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const {
  SMTP_HOST = "smtp.hostinger.com",
  SMTP_PORT = "465",
  SMTP_USER,
  SMTP_PASS,
  ADMIN_NOTIFICATION_EMAIL,
} = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  console.error("❌ SMTP_USER y SMTP_PASS no están configurados en .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: false },
});

console.log("🔌 Verificando conexión SMTP...");

try {
  await transporter.verify();
  console.log("✅ Conexión SMTP verificada correctamente.");

  const info = await transporter.sendMail({
    from: `"Transfers in Barcelona TEST" <${SMTP_USER}>`,
    to: ADMIN_NOTIFICATION_EMAIL || SMTP_USER,
    subject: "✅ SMTP Test — Sistema de Notificaciones Activo",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <h2 style="color:#D4AF37">✅ Conexión SMTP exitosa</h2>
        <p>El sistema de notificaciones por email de <strong>Transfers in Barcelona</strong> está correctamente configurado.</p>
        <hr style="border-color:#eee"/>
        <p><strong>Servidor:</strong> ${SMTP_HOST}:${SMTP_PORT}</p>
        <p><strong>Usuario:</strong> ${SMTP_USER}</p>
        <p><strong>Fecha del test:</strong> ${new Date().toLocaleString("es-ES")}</p>
      </div>
    `,
  });

  console.log(`✅ Email de prueba enviado. ID: ${info.messageId}`);
  console.log(`📬 Enviado a: ${ADMIN_NOTIFICATION_EMAIL || SMTP_USER}`);
} catch (err) {
  console.error("❌ Error de conexión SMTP:", err.message);
  process.exit(1);
}
