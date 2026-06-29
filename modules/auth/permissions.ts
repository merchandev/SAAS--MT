import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { authService, type SessionPayload } from "./auth.service";

export type AuthorizedSession = SessionPayload & { role: Role };

export type ApiAuthResult =
  | { ok: true; session: AuthorizedSession }
  | { ok: false; status: 401 | 403; error: "Unauthorized" | "Forbidden" };

function isAllowedRole(session: SessionPayload, allowedRoles: Role[]): session is AuthorizedSession {
  return allowedRoles.includes(session.role as Role);
}

export async function requireRolePage(allowedRoles: Role[]): Promise<AuthorizedSession> {
  const session = await authService.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (!isAllowedRole(session, allowedRoles)) {
    throw new Error("No autorizado");
  }

  return {
    ...session,
    role: session.role as Role,
  };
}

export async function requireRoleAction(allowedRoles: Role[]): Promise<AuthorizedSession> {
  const session = await authService.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!isAllowedRole(session, allowedRoles)) {
    throw new Error("Forbidden");
  }

  return {
    ...session,
    role: session.role as Role,
  };
}

export async function requireRoleApi(allowedRoles: Role[]): Promise<ApiAuthResult> {
  const session = await authService.getSession();

  if (!session) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  if (!isAllowedRole(session, allowedRoles)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return {
    ok: true,
    session: {
      ...session,
      role: session.role as Role,
    },
  };
}

export const requireRole = requireRolePage;
