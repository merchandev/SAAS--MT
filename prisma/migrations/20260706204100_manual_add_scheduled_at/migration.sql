-- Migration: add_scheduled_publishing
-- Run this SQL against your database when the connection is available

ALTER TABLE "RoutePage" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3);
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "RoutePage_scheduledAt_idx" ON "RoutePage"("scheduledAt");
CREATE INDEX IF NOT EXISTS "RoutePage_isActive_idx" ON "RoutePage"("isActive");
CREATE INDEX IF NOT EXISTS "Post_scheduledAt_idx" ON "Post"("scheduledAt");
CREATE INDEX IF NOT EXISTS "Post_isActive_idx" ON "Post"("isActive");
