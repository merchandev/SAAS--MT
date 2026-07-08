"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

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

    // Generate Reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tu-dominio.com";
    const resetUrl = `${baseUrl}/es/reset-password?token=${token}`;

    // Send email
    await sendEmail({
      to: email,
      subject: "Recuperación de Contraseña - Transfers in Barcelona",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Recuperación de Contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta asociada a este correo.</p>
          <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #D4AF37; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
          </div>
          <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
          <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo con seguridad.</p>
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
