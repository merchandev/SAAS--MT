export function normalizeEmail(email: string): string {
  const lower = email.trim().toLowerCase();
  // Basic normalization for common providers (e.g. gmail dot trick or plus addressing)
  // For safety in this system we only lowercase and trim to preserve exact delivery paths
  // unless we specifically want to collapse gmail aliases to prevent spam, but for now:
  return lower;
}

export function isValidEmail(email: string): boolean {
  // Simple regex for format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateAndNormalizeEmail(email: string): { normalized: string; valid: boolean } {
  const valid = isValidEmail(email);
  return {
    normalized: normalizeEmail(email),
    valid
  };
}
