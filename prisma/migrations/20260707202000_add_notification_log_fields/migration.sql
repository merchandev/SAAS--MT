-- Migration: add_notification_log_fields
-- Adds eventType, subject fields and indexes to NotificationLog
-- Apply on VPS with: docker exec -i <postgres_container> psql -U metransfers -d metransfers_saas < /path/to/migration

ALTER TABLE "NotificationLog" 
  ADD COLUMN IF NOT EXISTS "eventType" TEXT,
  ADD COLUMN IF NOT EXISTS "subject"   TEXT;

CREATE INDEX IF NOT EXISTS "NotificationLog_sentAt_idx"    ON "NotificationLog" ("sentAt");
CREATE INDEX IF NOT EXISTS "NotificationLog_status_idx"    ON "NotificationLog" ("status");
CREATE INDEX IF NOT EXISTS "NotificationLog_eventType_idx" ON "NotificationLog" ("eventType");
CREATE INDEX IF NOT EXISTS "NotificationLog_bookingId_idx" ON "NotificationLog" ("bookingId");
