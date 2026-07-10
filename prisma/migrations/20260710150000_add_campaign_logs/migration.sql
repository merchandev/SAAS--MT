-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN IF NOT EXISTS "sendingRate" INTEGER NOT NULL DEFAULT 50;
ALTER TABLE "EmailCampaign" ADD COLUMN IF NOT EXISTS "sendFromHour" TEXT;
ALTER TABLE "EmailCampaign" ADD COLUMN IF NOT EXISTS "sendToHour" TEXT;

-- AlterTable
ALTER TABLE "NotificationLog" ADD COLUMN IF NOT EXISTS "campaignId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NotificationLog_campaignId_idx" ON "NotificationLog"("campaignId");
