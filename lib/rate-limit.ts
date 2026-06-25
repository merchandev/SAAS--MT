export class RateLimiter {
  private limits = new Map<string, { count: number; resetAt: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const record = this.limits.get(key);

    if (!record || now > record.resetAt) {
      this.limits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }
}

// Singleton instances for different purposes
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 per 15 min
export const publicBookingRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 per 15 min
export const mapsRateLimiter = new RateLimiter(30, 15 * 60 * 1000); // 30 per 15 min
export const paymentRateLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 per 15 min
