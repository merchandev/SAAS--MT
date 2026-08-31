import { authService } from "./auth.service";

/**
 * P2.5 Tenant Service
 * Utility to retrieve the active companyId for the current session.
 */
export async function getTenantId(): Promise<string> {
  const session = await authService.getSession();
  return session?.companyId || 'legacy-metransfers';
}
