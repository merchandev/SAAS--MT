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
  const isAllowed = (await loginRateLimiter.check(ipKey)) && (await loginRateLimiter.check(emailKey));
  if (!isAllowed) {
    return { error: "Demasiados intentos. Por favor, inténtelo de nuevo en 15 minutos." };
  }

  // 2. Buscar usuario en base de datos
  const user = await prisma.user.findUnique({
    where: { email: lowerEmail }
  });

  if (!user || !user.isActive) {
    return { error: "Credenciales incorrectas o usuario inactivo." };
  }

  // 3. Verificar contraseña
  const isValid = await authService.verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { error: "Credenciales incorrectas." };
  }

  // 4. Crear sesión (JWT Cookie)
  const token = await authService.createToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  await authService.setSessionCookie(token);

  // 5. Redirigir según rol
  if (user.role === "HOTEL" || user.role === "AGENCY") {
    redirect("/hotel/dashboard");
  } else if (user.role === "CUSTOMER") {
    redirect("/booking"); // o panel de cliente
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

  const { email, password, fullName, phone } = parsed.data;
  const lowerEmail = email.toLowerCase();

  // Rate Limiter
  const requestMeta = getRequestMeta(await headers());
  const ipKey = buildRateLimitKey("register-ip", requestMeta);
  const emailKey = buildRateLimitKey("register-email", requestMeta, lowerEmail);
  const isAllowed = (await loginRateLimiter.check(ipKey)) && (await loginRateLimiter.check(emailKey));
  if (!isAllowed) {
    return { error: "Demasiados intentos. Por favor, inténtelo de nuevo más tarde." };
  }

  // 2. Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: lowerEmail }
  });

  if (existingUser) {
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
          data: { userId: user.id, fullName, phone }
        });
      } else {
        // Crear nuevo perfil
        await tx.customer.create({
          data: {
            userId: user.id,
            email: lowerEmail,
            fullName,
            phone,
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
    });

    await authService.setSessionCookie(token);

  } catch (error) {
    console.error("Error en registro:", error);
    return { error: "Ocurrió un error inesperado durante el registro." };
  }

  // 6. Redirigir
  redirect("/booking");
}

export async function logoutAction() {
  await authService.deleteSessionCookie();
  redirect("/admin/login");
}
