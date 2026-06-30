"use server";

import bcrypt from "bcryptjs";
import type { Prisma, Role, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  passwordResetSchema,
  type AdminUserCreateInput,
  type AdminUserUpdateInput,
  type PasswordResetInput,
} from "./users.schemas";

type UserManagerSession = Awaited<ReturnType<typeof requireRole>>;

type ExistingUserForGuard = User & {
  driverProfile: ({ _count: { bookings: number } } & { id: string }) | null;
  customerProfile:
    | ({
        _count: {
          bookings: number;
          invoices: number;
          reviews: number;
          suggestions: number;
        };
      } & { id: string })
    | null;
};

function normalizeText(value?: string) {
  return value?.trim() || undefined;
}

function revalidateUserAdminPaths() {
  revalidatePath("/admin/users");
  revalidatePath("/admin/customers");
  revalidatePath("/admin/drivers");
  revalidatePath("/admin/hotels");
  revalidatePath("/admin/agencies");
}

async function requireUserManager() {
  return await requireRole(["SUPER_ADMIN", "ADMIN"]);
}

function canManageRole(session: UserManagerSession, currentRole?: Role, nextRole?: Role) {
  if (session.role === "SUPER_ADMIN") return true;
  return currentRole !== "SUPER_ADMIN" && nextRole !== "SUPER_ADMIN";
}

async function wouldRemoveLastActiveSuperAdmin(existing: User, nextRole: Role, nextIsActive: boolean) {
  if (existing.role !== "SUPER_ADMIN" || !existing.isActive) return false;
  if (nextRole === "SUPER_ADMIN" && nextIsActive) return false;

  const otherActiveSuperAdmins = await prisma.user.count({
    where: {
      role: "SUPER_ADMIN",
      isActive: true,
      NOT: { id: existing.id },
    },
  });

  return otherActiveSuperAdmins === 0;
}

function hasCustomerDependencies(customer: ExistingUserForGuard["customerProfile"]) {
  if (!customer) return false;
  return (
    customer._count.bookings > 0 ||
    customer._count.invoices > 0 ||
    customer._count.reviews > 0 ||
    customer._count.suggestions > 0
  );
}

async function getExistingUserForGuard(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      driverProfile: {
        include: {
          _count: { select: { bookings: true } },
        },
      },
      customerProfile: {
        include: {
          _count: { select: { bookings: true, invoices: true, reviews: true, suggestions: true } },
        },
      },
    },
  });
}

async function attachOrCreateCustomerProfile(
  tx: Prisma.TransactionClient,
  userId: string,
  data: AdminUserCreateInput | AdminUserUpdateInput
) {
  const existingByUser = await tx.customer.findUnique({ where: { userId } });
  const profileData = {
    userId,
    email: data.email,
    fullName: data.fullName,
    phone: normalizeText(data.phone),
    country: normalizeText(data.country),
    preferredLanguage: data.preferredLanguage,
  };

  if (existingByUser) {
    await tx.customer.update({
      where: { id: existingByUser.id },
      data: profileData,
    });
    return;
  }

  const existingByEmail = await tx.customer.findUnique({ where: { email: data.email } });
  if (existingByEmail?.userId && existingByEmail.userId !== userId) {
    throw new Error("CUSTOMER_EMAIL_IN_USE");
  }

  if (existingByEmail) {
    await tx.customer.update({
      where: { id: existingByEmail.id },
      data: profileData,
    });
    return;
  }

  await tx.customer.create({ data: profileData });
}

async function syncRoleProfile(
  tx: Prisma.TransactionClient,
  userId: string,
  existing: ExistingUserForGuard | null,
  data: AdminUserCreateInput | AdminUserUpdateInput
) {
  if (data.role !== "DRIVER" && existing?.driverProfile) {
    await tx.driver.delete({ where: { userId } });
  }

  if (data.role === "DRIVER") {
    await tx.driver.upsert({
      where: { userId },
      update: {
        licenseNumber: data.licenseNumber,
        status: normalizeText(data.driverStatus) || "ACTIVE",
      },
      create: {
        userId,
        licenseNumber: data.licenseNumber,
        status: normalizeText(data.driverStatus) || "ACTIVE",
      },
    });
  }

  if (data.role !== "CUSTOMER" && existing?.customerProfile) {
    await tx.customer.delete({ where: { userId } });
  }

  if (data.role === "CUSTOMER") {
    await attachOrCreateCustomerProfile(tx, userId, data);
  }
}

async function createAudit(
  tx: Prisma.TransactionClient,
  session: UserManagerSession,
  entityId: string,
  action: string,
  value?: unknown
) {
  await tx.auditLog.create({
    data: {
      userId: session.userId,
      entityType: "User",
      entityId,
      action,
      newValue: value ? JSON.stringify(value) : undefined,
    },
  });
}

export async function createUserAction(input: AdminUserCreateInput) {
  const session = await requireUserManager();
  const parsed = adminUserCreateSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Datos de usuario inválidos", details: parsed.error.flatten() };
  }

  const data = parsed.data;
  const nextRole = data.role as Role;

  if (!canManageRole(session, undefined, nextRole)) {
    return { error: "Solo un super administrador puede crear otro super administrador." };
  }

  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          fullName: data.fullName,
          phone: normalizeText(data.phone),
          role: nextRole,
          isActive: data.isActive,
          hotelId: nextRole === "HOTEL" ? data.hotelId : null,
          agencyId: nextRole === "AGENCY" ? data.agencyId : null,
        },
      });

      await syncRoleProfile(tx, created.id, null, data);
      await createAudit(tx, session, created.id, "CREATE", {
        email: created.email,
        role: created.role,
        isActive: created.isActive,
      });

      return created;
    });

    revalidateUserAdminPaths();
    return { success: true, data: { id: user.id } };
  } catch (error: any) {
    if (error.message === "CUSTOMER_EMAIL_IN_USE") {
      return { error: "Ya existe un perfil de cliente asociado a ese correo." };
    }
    if (error.code === "P2002") {
      return { error: "Ya existe un usuario o perfil con ese correo." };
    }
    console.error("Error creating user:", error);
    return { error: "Error al crear el usuario." };
  }
}

export async function updateUserAction(userId: string, input: AdminUserUpdateInput) {
  const session = await requireUserManager();
  const parsed = adminUserUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Datos de usuario inválidos", details: parsed.error.flatten() };
  }

  const existing = await getExistingUserForGuard(userId);
  if (!existing) return { error: "Usuario no encontrado." };

  const data = parsed.data;
  const nextRole = data.role as Role;

  if (!canManageRole(session, existing.role, nextRole)) {
    return { error: "Solo un super administrador puede modificar super administradores." };
  }

  if (session.userId === userId && (nextRole !== existing.role || !data.isActive)) {
    return { error: "No puedes cambiar tu propio rol ni suspender tu propia cuenta." };
  }

  if (await wouldRemoveLastActiveSuperAdmin(existing, nextRole, data.isActive)) {
    return { error: "Debe quedar al menos un super administrador activo." };
  }

  if (existing.driverProfile && nextRole !== "DRIVER" && existing.driverProfile._count.bookings > 0) {
    return { error: "Este conductor tiene reservas asociadas. Suspendelo en lugar de cambiar su rol." };
  }

  if (existing.customerProfile && nextRole !== "CUSTOMER" && hasCustomerDependencies(existing.customerProfile)) {
    return { error: "Este cliente tiene historial asociado. Suspendelo en lugar de cambiar su rol." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          email: data.email,
          fullName: data.fullName,
          phone: normalizeText(data.phone),
          role: nextRole,
          isActive: data.isActive,
          hotelId: nextRole === "HOTEL" ? data.hotelId : null,
          agencyId: nextRole === "AGENCY" ? data.agencyId : null,
        },
      });

      await syncRoleProfile(tx, userId, existing, data);
      await createAudit(tx, session, userId, "UPDATE", {
        email: data.email,
        role: nextRole,
        isActive: data.isActive,
      });
    });

    revalidateUserAdminPaths();
    revalidatePath(`/admin/users/${userId}/edit`);
    return { success: true };
  } catch (error: any) {
    if (error.message === "CUSTOMER_EMAIL_IN_USE") {
      return { error: "Ya existe un perfil de cliente asociado a ese correo." };
    }
    if (error.code === "P2002") {
      return { error: "Ya existe un usuario o perfil con ese correo." };
    }
    console.error("Error updating user:", error);
    return { error: "Error al actualizar el usuario." };
  }
}

export async function toggleUserStatusAction(userId: string) {
  const session = await requireUserManager();
  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (!existing) return { error: "Usuario no encontrado." };
  if (!canManageRole(session, existing.role, existing.role)) {
    return { error: "Solo un super administrador puede suspender super administradores." };
  }
  if (session.userId === userId) {
    return { error: "No puedes suspender tu propia cuenta." };
  }
  if (await wouldRemoveLastActiveSuperAdmin(existing, existing.role, !existing.isActive)) {
    return { error: "Debe quedar al menos un super administrador activo." };
  }

  await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: { isActive: !existing.isActive },
    });
    await createAudit(tx, session, userId, "TOGGLE_STATUS", { isActive: updated.isActive });
  });

  revalidateUserAdminPaths();
  return { success: true };
}

export async function resetUserPasswordAction(userId: string, input: PasswordResetInput) {
  const session = await requireUserManager();
  const parsed = passwordResetSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Contraseña inválida", details: parsed.error.flatten() };
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return { error: "Usuario no encontrado." };
  if (!canManageRole(session, existing.role, existing.role)) {
    return { error: "Solo un super administrador puede reiniciar super administradores." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    await createAudit(tx, session, userId, "RESET_PASSWORD");
  });

  revalidatePath(`/admin/users/${userId}/edit`);
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const session = await requireUserManager();
  const existing = await getExistingUserForGuard(userId);

  if (!existing) return { error: "Usuario no encontrado." };
  if (session.userId === userId) {
    return { error: "No puedes borrar tu propia cuenta." };
  }
  if (!canManageRole(session, existing.role, existing.role)) {
    return { error: "Solo un super administrador puede borrar super administradores." };
  }
  if (await wouldRemoveLastActiveSuperAdmin(existing, "ADMIN", false)) {
    return { error: "Debe quedar al menos un super administrador activo." };
  }
  if (existing.driverProfile && existing.driverProfile._count.bookings > 0) {
    return { error: "No se puede borrar un conductor con reservas. Suspendelo en su lugar." };
  }
  if (hasCustomerDependencies(existing.customerProfile)) {
    return { error: "No se puede borrar un cliente con historial. Suspendelo en su lugar." };
  }

  await prisma.$transaction(async (tx) => {
    if (existing.driverProfile) {
      await tx.driver.delete({ where: { userId } });
    }

    if (existing.customerProfile) {
      await tx.customer.delete({ where: { userId } });
    }

    await tx.user.delete({ where: { id: userId } });
    await createAudit(tx, session, userId, "DELETE", {
      email: existing.email,
      role: existing.role,
    });
  });

  revalidateUserAdminPaths();
  return { success: true };
}

export async function forceLogoutUserAction(userId: string) {
  const session = await requireUserManager();
  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (!existing) return { error: "Usuario no encontrado." };
  
  if (!canManageRole(session, existing.role, existing.role)) {
    return { error: "Solo un super administrador puede cerrar la sesión de super administradores." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { sessionVersion: { increment: 1 } },
    });
    await createAudit(tx, session, userId, "FORCE_LOGOUT");
  });

  revalidateUserAdminPaths();
  return { success: true };
}
