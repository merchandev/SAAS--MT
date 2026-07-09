"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

import { headers } from "next/headers";

export async function forgotPasswordAction(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // By security design, we pretend we sent it to prevent email enumeration
      return { success: true };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    // Detect domain dynamically to avoid localhost in production if NEXT_PUBLIC_APP_URL is baked
    const headersList = await headers();
    const host = headersList.get("host") || "transfersinbarcelona.com";
    const protocol = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/es/reset-password?token=${token}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "Recuperación de Contraseña - Transfers in Barcelona",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #222;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://transfersinbarcelona.com/images/MeTransfers-exp.png" alt="MeTransfers Barcelona" style="max-width: 180px; height: auto; margin: 0 auto; display: block;" />
          </div>
          
          <div style="background-color: #111111; padding: 30px; border-radius: 6px; border: 1px solid #1a1a1a;">
            <h2 style="color: #D4AF37; margin-top: 0; font-size: 20px;">Recuperación de Acceso</h2>
            <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta asociada a este correo electrónico.</p>
            <p style="color: #cccccc; line-height: 1.6; font-size: 15px;">Para crear una nueva contraseña de forma segura, haz clic en el botón inferior:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background-color: #D4AF37; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Restablecer Contraseña</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;" />
            <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0;">Este enlace de seguridad expirará automáticamente en 1 hora por motivos de protección.</p>
            <p style="color: #666666; font-size: 13px; line-height: 1.5; margin-top: 10px;">Si no solicitaste este cambio, puedes ignorar este correo con total seguridad.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #444; font-size: 12px;">&copy; ${new Date().getFullYear()} Transfers in Barcelona. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
      eventType: "SYSTEM",
    });

    return { success: true };
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return { error: "Ocurrió un error al procesar tu solicitud." };
  }
}

export async function resetPasswordAction(token: string, password: string) {
  try {
    if (!token) return { error: "Token inválido." };
    if (!password || password.length < 10) return { error: "La contraseña debe tener al menos 10 caracteres." };

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return { error: "El enlace de recuperación es inválido o ya fue utilizado." };
    }

    if (resetRecord.expiresAt < new Date()) {
      return { error: "El enlace de recuperación ha expirado. Solicita uno nuevo." };
    }

    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return { error: "El usuario asociado a este enlace ya no existe." };
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user and invalidate existing sessions
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        sessionVersion: { increment: 1 },
      },
    });

    // Delete token
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return { success: true };
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return { error: "Error al intentar restablecer la contraseña." };
  }
}
