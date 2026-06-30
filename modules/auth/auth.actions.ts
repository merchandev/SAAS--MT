"use server";

import { loginSchema, LoginInput, registerSchema, RegisterInput } from "./auth.schemas";
import { authService } from "./auth.service";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

import { loginRateLimiter } from "@/lib/rate-limit";
import { buildRateLimitKey, getRequestMeta } from "@/lib/request-meta";

export async function loginAction(data: LoginInput) {
  // 1. Validar input
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de acceso inválidos." };
  }

  const { email, password } = parsed.data;
  const lowerEmail = email.toLowerCase();

  // Rate Limiter
  const requestMeta = getRequestMeta(await headers());
  const ipKey = buildRateLimitKey("login-ip", requestMeta);
  const emailKey = buildRateLimitKey("login-email", requestMeta, lowerEmail);
  
  const ipCheck = await loginRateLimiter.check(ipKey);
  const emailCheck = await loginRateLimiter.check(emailKey);
  
  if (!ipCheck.allowed || !emailCheck.allowed) {
    const maxResetAtMs = Math.max(ipCheck.resetAtMs, emailCheck.resetAtMs);
    const waitSeconds = Math.ceil((maxResetAtMs - Date.now()) / 1000);
    const waitMinutes = Math.ceil(waitSeconds / 60);
    
    if (waitSeconds < 60) {
      return { error: `Demasiados intentos. Por favor, inténtelo de nuevo en ${waitSeconds} segundos.` };
    } else {
      return { error: `Demasiados intentos. Por favor, inténtelo de nuevo en ${waitMinutes} minutos.` };
    }
  }

  // 2. Buscar usuario en base de datos
  const user = await prisma.user.findUnique({
    where: { email: lowerEmail }
  });

  if (!user || !user.isActive) {
    await loginRateLimiter.consume(ipKey);
    await loginRateLimiter.consume(emailKey);
    return { error: "Credenciales incorrectas o usuario inactivo." };
  }

  // 3. Verificar contraseña
  const isValid = await authService.verifyPassword(password, user.passwordHash);
  if (!isValid) {
    await loginRateLimiter.consume(ipKey);
    await loginRateLimiter.consume(emailKey);
    return { error: "Credenciales incorrectas." };
  }

  // Éxito: Limpiar los intentos fallidos
  await loginRateLimiter.clear(ipKey);
  await loginRateLimiter.clear(emailKey);

  // 4. Crear sesión (JWT Cookie)
  const token = await authService.createToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    sessionVersion: user.sessionVersion,
  });

  await authService.setSessionCookie(token);

  // 5. Redirigir según rol
  if (user.role === "HOTEL" || user.role === "AGENCY") {
    redirect("/hotel/dashboard");
  } else if (user.role === "CUSTOMER") {
    redirect("/customer/dashboard");
  } else {
    redirect("/admin/dashboard");
  }
}

export async function registerAction(data: RegisterInput) {
  // 1. Validar input
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de registro inválidos." };
  }

  const { email, password, fullName, phone, country, preferredLanguage } = parsed.data;
  const lowerEmail = email.toLowerCase();

  // Rate Limiter
  const requestMeta = getRequestMeta(await headers());
  const ipKey = buildRateLimitKey("register-ip", requestMeta);
  const emailKey = buildRateLimitKey("register-email", requestMeta, lowerEmail);
  
  const ipCheck = await loginRateLimiter.check(ipKey);
  const emailCheck = await loginRateLimiter.check(emailKey);
  
  if (!ipCheck.allowed || !emailCheck.allowed) {
    const maxResetAtMs = Math.max(ipCheck.resetAtMs, emailCheck.resetAtMs);
    const waitSeconds = Math.ceil((maxResetAtMs - Date.now()) / 1000);
    const waitMinutes = Math.ceil(waitSeconds / 60);
    
    if (waitSeconds < 60) {
      return { error: `Demasiados intentos. Por favor, inténtelo de nuevo en ${waitSeconds} segundos.` };
    } else {
      return { error: `Demasiados intentos. Por favor, inténtelo de nuevo en ${waitMinutes} minutos.` };
    }
  }

  // 2. Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: lowerEmail }
  });

  if (existingUser) {
    await loginRateLimiter.consume(ipKey);
    await loginRateLimiter.consume(emailKey);
    return { error: "Ya existe una cuenta con este correo electrónico." };
  }

  // 3. Hashear contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // 4. Crear usuario y customer en transacción
  try {
    const newUser = await prisma.$transaction(async (tx) => {
      // Intentar ver si el customer existe por un booking previo sin cuenta
      const existingCustomer = await tx.customer.findUnique({
        where: { email: lowerEmail }
      });

      const user = await tx.user.create({
        data: {
          email: lowerEmail,
          passwordHash,
          fullName,
          phone,
          role: "CUSTOMER",
          isActive: true,
        }
      });

      if (existingCustomer) {
        // Enlazar perfil existente
        await tx.customer.update({
          where: { id: existingCustomer.id },
          data: { userId: user.id, fullName, phone, country, preferredLanguage }
        });
      } else {
        // Crear nuevo perfil
        await tx.customer.create({
          data: {
            userId: user.id,
            email: lowerEmail,
            fullName,
            phone,
            country,
            preferredLanguage,
          }
        });
      }

      return user;
    });

    // 5. Autologuear creando cookie JWT
    const token = await authService.createToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
      sessionVersion: newUser.sessionVersion,
    });

    await authService.setSessionCookie(token);

  } catch (error) {
    console.error("Error en registro:", error);
    return { error: "Ocurrió un error inesperado durante el registro." };
  }

  // Éxito: Limpiar los intentos fallidos
  const requestMetaClear = getRequestMeta(await headers());
  const ipKeyClear = buildRateLimitKey("register-ip", requestMetaClear);
  const emailKeyClear = buildRateLimitKey("register-email", requestMetaClear, lowerEmail);
  await loginRateLimiter.clear(ipKeyClear);
  await loginRateLimiter.clear(emailKeyClear);

  // 6. Redirigir
  redirect("/customer/dashboard");
}

export async function logoutAction() {
  await authService.deleteSessionCookie();
  redirect("/admin/login");
}
