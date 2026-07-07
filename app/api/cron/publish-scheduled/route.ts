import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/publish-scheduled
 *
 * Publishes all Posts and RoutePages whose scheduledAt date has passed.
 * Call this endpoint from your cron service (e.g., Vercel Cron, uptime robot, etc.)
 * every 5-15 minutes.
 *
 * Secure it with a CRON_SECRET env variable:
 *   Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  // Simple bearer token auth
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();

  // Publish scheduled posts
  const publishedPosts = await prisma.post.updateMany({
    where: {
      isActive: false,
      scheduledAt: { lte: now, not: null },
    },
    data: {
      isActive: true,
      publishedAt: now,
      scheduledAt: null, // Clear after publishing
    },
  });

  // Publish scheduled route pages
  const publishedPages = await prisma.routePage.updateMany({
    where: {
      isActive: false,
      scheduledAt: { lte: now, not: null },
    },
    data: {
      isActive: true,
      scheduledAt: null, // Clear after publishing
    },
  });

  return NextResponse.json({
    success: true,
    publishedPosts: publishedPosts.count,
    publishedPages: publishedPages.count,
    checkedAt: now.toISOString(),
  });
}
