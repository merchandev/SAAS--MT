import type { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { authService, type SessionPayload } from "./auth.service";

export async function requireRole(allowedRoles: Role[]): Promise<SessionPayload & { role: Role }> {
  const session = await authService.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (!allowedRoles.includes(session.role as Role)) {
    throw new Error("No autorizado");
  }

  return {
    ...session,
    role: session.role as Role,
  };
}
