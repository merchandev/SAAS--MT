"use server";

import { loginSchema, LoginInput } from "./auth.schemas";
import { authService } from "./auth.service";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function loginAction(data: LoginInput) {
  // 1. Validar input
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos de acceso inválidos." };
  }

  const { email, password } = parsed.data;

  // 2. Buscar usuario en base de datos
  const user = await prisma.user.findUnique({
    where: { email }
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

export async function logoutAction() {
  await authService.deleteSessionCookie();
  redirect("/admin/login");
}
