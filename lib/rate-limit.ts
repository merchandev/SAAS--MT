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

export class ExponentialRateLimiter {
  private memoryLimits = new Map<string, { count: number; resetAt: number }>();

  constructor(private backoffStagesMs: number[]) {}

  private getBackoffForCount(count: number): number {
    if (count <= 0) return 0;
    const index = Math.min(count - 1, this.backoffStagesMs.length - 1);
    return this.backoffStagesMs[index];
  }

  async check(key: string): Promise<{ allowed: boolean; resetAtMs: number }> {
    const now = Date.now();

    if (process.env.RATE_LIMIT_BACKEND === "memory" || process.env.NODE_ENV === "test") {
      const record = this.memoryLimits.get(key);
      if (record && record.resetAt > now) {
        return { allowed: false, resetAtMs: record.resetAt };
      }
      return { allowed: true, resetAtMs: 0 };
    }

    try {
      const bucket = await prisma.rateLimitBucket.findUnique({ where: { key }, select: { resetAt: true } });
      if (bucket && bucket.resetAt.getTime() > now) {
        return { allowed: false, resetAtMs: bucket.resetAt.getTime() };
      }
      return { allowed: true, resetAtMs: 0 };
    } catch (error) {
      console.error("[RateLimit] Falling back to in-memory limiter:", error);
      const record = this.memoryLimits.get(key);
      if (record && record.resetAt > now) {
        return { allowed: false, resetAtMs: record.resetAt };
      }
      return { allowed: true, resetAtMs: 0 };
    }
  }

  async consume(key: string): Promise<void> {
    const now = Date.now();

    if (process.env.RATE_LIMIT_BACKEND === "memory" || process.env.NODE_ENV === "test") {
      const record = this.memoryLimits.get(key) || { count: 0, resetAt: 0 };
      // If it's been more than 2x the longest timeout since the last lockout, reset count
      const longestTimeout = this.backoffStagesMs[this.backoffStagesMs.length - 1];
      if (record.resetAt > 0 && now > record.resetAt + longestTimeout * 2) {
        record.count = 0;
      }
      record.count++;
      record.resetAt = now + this.getBackoffForCount(record.count);
      this.memoryLimits.set(key, record);
      return;
    }

    try {
      const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });
      
      let count = (bucket?.count || 0);
      const longestTimeout = this.backoffStagesMs[this.backoffStagesMs.length - 1];
      
      if (bucket && bucket.resetAt.getTime() > 0 && now > bucket.resetAt.getTime() + longestTimeout * 2) {
        count = 0;
      }

      count++;
      const backoffMs = this.getBackoffForCount(count);
      const resetAt = new Date(now + backoffMs);

      await prisma.rateLimitBucket.upsert({
        where: { key },
        update: { count, resetAt },
        create: { key, count, resetAt }
      });
    } catch (error) {
      console.error("[RateLimit] Failed to consume:", error);
    }
  }

  async clear(key: string): Promise<void> {
    if (process.env.RATE_LIMIT_BACKEND === "memory" || process.env.NODE_ENV === "test") {
      this.memoryLimits.delete(key);
      return;
    }
    try {
      await prisma.rateLimitBucket.delete({ where: { key } });
    } catch (e) {
      // Ignore if not exists
    }
  }
}

// Singleton instances for different purposes
export const loginRateLimiter = new ExponentialRateLimiter([
  30 * 1000,        // 30s
  60 * 1000,        // 1m
  5 * 60 * 1000,    // 5m
  15 * 60 * 1000,   // 15m
]);
export const publicBookingRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 per 15 min
export const mapsRateLimiter = new RateLimiter(30, 15 * 60 * 1000); // 30 per 15 min
export const paymentRateLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 per 15 min
export const aiImageRateLimiter = new RateLimiter(10, 60 * 60 * 1000); // 10 per hour
export const contactRateLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 per 15 min
