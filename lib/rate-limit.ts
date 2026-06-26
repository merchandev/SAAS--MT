import { prisma } from "@/lib/prisma";

export class RateLimiter {
  private memoryLimits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  private checkMemory(key: string): boolean {
    const now = Date.now();
    const record = this.memoryLimits.get(key);

    if (!record || now > record.resetAt) {
      this.memoryLimits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  private async checkDatabase(key: string): Promise<boolean> {
    const now = new Date();
    const resetAt = new Date(now.getTime() + this.windowMs);

    await prisma.rateLimitBucket.deleteMany({
      where: {
        key,
        resetAt: { lte: now },
      },
    });

    const incremented = await prisma.rateLimitBucket.updateMany({
      where: {
        key,
        resetAt: { gt: now },
        count: { lt: this.maxRequests },
      },
      data: {
        count: { increment: 1 },
      },
    });

    if (incremented.count > 0) {
      return true;
    }

    const existing = await prisma.rateLimitBucket.findUnique({
      where: { key },
      select: { resetAt: true },
    });

    if (existing && existing.resetAt > now) {
      return false;
    }

    try {
      await prisma.rateLimitBucket.create({
        data: {
          key,
          count: 1,
          resetAt,
        },
      });
      return true;
    } catch (error: any) {
      if (error?.code !== "P2002") {
        throw error;
      }

      const retried = await prisma.rateLimitBucket.updateMany({
        where: {
          key,
          resetAt: { gt: now },
          count: { lt: this.maxRequests },
        },
        data: {
          count: { increment: 1 },
        },
      });

      return retried.count > 0;
    }
  }

  async check(key: string): Promise<boolean> {
    if (process.env.RATE_LIMIT_BACKEND === "memory" || process.env.NODE_ENV === "test") {
      return this.checkMemory(key);
    }

    try {
      return await this.checkDatabase(key);
    } catch (error) {
      console.error("[RateLimit] Falling back to in-memory limiter:", error);
      return this.checkMemory(key);
    }
  }
}

// Singleton instances for different purposes
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 per 15 min
export const publicBookingRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 per 15 min
export const mapsRateLimiter = new RateLimiter(30, 15 * 60 * 1000); // 30 per 15 min
export const paymentRateLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 per 15 min
