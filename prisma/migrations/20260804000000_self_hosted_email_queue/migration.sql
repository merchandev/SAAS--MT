-- CreateEnum
CREATE TYPE "EmailMessageKind" AS ENUM ('TRANSACTIONAL', 'MARKETING');

-- CreateEnum
CREATE TYPE "OutboundEmailStatus" AS ENUM ('QUEUED', 'PROCESSING', 'ACCEPTED', 'DEFERRED', 'DELIVERED', 'BOUNCED', 'SUPPRESSED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignRecipientStatus" AS ENUM ('QUEUED', 'PROCESSING', 'ACCEPTED', 'DEFERRED', 'DELIVERED', 'BOUNCED', 'SUPPRESSED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('CREATED', 'QUEUED', 'PROCESSING', 'ACCEPTED', 'DEFERRED', 'DELIVERED', 'BOUNCED', 'SUPPRESSED', 'FAILED', 'CANCELLED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "EmailSuppressionReason" AS ENUM ('UNSUBSCRIBED', 'HARD_BOUNCE', 'SPAM_COMPLAINT', 'MANUAL_BLOCK', 'INVALID_ADDRESS');

-- CreateEnum
CREATE TYPE "EmailSuppressionScope" AS ENUM ('MARKETING', 'ALL');

-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "bouncedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deferredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deliveredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fromAddress" TEXT,
ADD COLUMN     "fromName" TEXT,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "replyTo" TEXT,
ADD COLUMN     "suppressedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
ADD COLUMN     "totalCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "recipients" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CampaignRecipient" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "status" "CampaignRecipientStatus" NOT NULL DEFAULT 'QUEUED',
    "unsubscribeToken" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "acceptedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "suppressedAt" TIMESTAMP(3),
    "lastSmtpCode" INTEGER,
    "lastEnhancedCode" TEXT,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundEmail" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "kind" "EmailMessageKind" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" "OutboundEmailStatus" NOT NULL DEFAULT 'QUEUED',
    "toEmail" TEXT NOT NULL,
    "normalizedToEmail" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "replyTo" TEXT,
    "envelopeFrom" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "html" TEXT,
    "text" TEXT,
    "headers" JSONB,
    "payload" JSONB,
    "eventType" TEXT,
    "bookingId" TEXT,
    "campaignId" TEXT,
    "campaignRecipientId" TEXT,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "lockedUntil" TIMESTAMP(3),
    "lockedBy" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 6,
    "messageId" TEXT,
    "postfixQueueId" TEXT,
    "smtpResponse" TEXT,
    "lastSmtpCode" INTEGER,
    "lastEnhancedCode" TEXT,
    "lastError" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "deferredAt" TIMESTAMP(3),
    "bouncedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailEvent" (
    "id" TEXT NOT NULL,
    "outboundEmailId" TEXT NOT NULL,
    "type" "EmailEventType" NOT NULL,
    "smtpCode" INTEGER,
    "enhancedCode" TEXT,
    "action" TEXT,
    "diagnostic" TEXT,
    "remoteMta" TEXT,
    "raw" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSuppression" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "reason" "EmailSuppressionReason" NOT NULL,
    "scope" "EmailSuppressionScope" NOT NULL DEFAULT 'MARKETING',
    "source" TEXT,
    "campaignId" TEXT,
    "outboundEmailId" TEXT,
    "notes" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSuppression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailDomainState" (
    "key" TEXT NOT NULL,
    "pausedUntil" TIMESTAMP(3),
    "lastSubmittedAt" TIMESTAMP(3),
    "consecutiveDeferrals" INTEGER NOT NULL DEFAULT 0,
    "lastEnhancedCode" TEXT,
    "lastDiagnostic" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDomainState_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "EmailWorkerHeartbeat" (
    "workerId" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "pid" INTEGER NOT NULL,
    "version" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "lastError" TEXT,
    "processedCount" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailWorkerHeartbeat_pkey" PRIMARY KEY ("workerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRecipient_unsubscribeToken_key" ON "CampaignRecipient"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "CampaignRecipient_campaignId_status_idx" ON "CampaignRecipient"("campaignId", "status");

-- CreateIndex
CREATE INDEX "CampaignRecipient_normalizedEmail_idx" ON "CampaignRecipient"("normalizedEmail");

-- CreateIndex
CREATE INDEX "CampaignRecipient_status_updatedAt_idx" ON "CampaignRecipient"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignRecipient_campaignId_normalizedEmail_key" ON "CampaignRecipient"("campaignId", "normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmail_idempotencyKey_key" ON "OutboundEmail"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmail_campaignRecipientId_key" ON "OutboundEmail"("campaignRecipientId");

-- CreateIndex
CREATE INDEX "OutboundEmail_status_availableAt_priority_idx" ON "OutboundEmail"("status", "availableAt", "priority");

-- CreateIndex
CREATE INDEX "OutboundEmail_lockedUntil_idx" ON "OutboundEmail"("lockedUntil");

-- CreateIndex
CREATE INDEX "OutboundEmail_campaignId_status_idx" ON "OutboundEmail"("campaignId", "status");

-- CreateIndex
CREATE INDEX "OutboundEmail_normalizedToEmail_idx" ON "OutboundEmail"("normalizedToEmail");

-- CreateIndex
CREATE INDEX "OutboundEmail_postfixQueueId_idx" ON "OutboundEmail"("postfixQueueId");

-- CreateIndex
CREATE INDEX "OutboundEmail_acceptedAt_idx" ON "OutboundEmail"("acceptedAt");

-- CreateIndex
CREATE INDEX "EmailEvent_outboundEmailId_occurredAt_idx" ON "EmailEvent"("outboundEmailId", "occurredAt");

-- CreateIndex
CREATE INDEX "EmailEvent_type_occurredAt_idx" ON "EmailEvent"("type", "occurredAt");

-- CreateIndex
CREATE INDEX "EmailSuppression_reason_idx" ON "EmailSuppression"("reason");

-- CreateIndex
CREATE INDEX "EmailSuppression_expiresAt_idx" ON "EmailSuppression"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSuppression_normalizedEmail_scope_key" ON "EmailSuppression"("normalizedEmail", "scope");

-- CreateIndex
CREATE INDEX "EmailCampaign_status_scheduledAt_idx" ON "EmailCampaign"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "EmailCampaign_deletedAt_idx" ON "EmailCampaign"("deletedAt");

-- CreateIndex
CREATE INDEX "EmailCampaign_createdAt_idx" ON "EmailCampaign"("createdAt");

-- AddForeignKey
ALTER TABLE "CampaignRecipient" ADD CONSTRAINT "CampaignRecipient_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundEmail" ADD CONSTRAINT "OutboundEmail_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundEmail" ADD CONSTRAINT "OutboundEmail_campaignRecipientId_fkey" FOREIGN KEY ("campaignRecipientId") REFERENCES "CampaignRecipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailEvent" ADD CONSTRAINT "EmailEvent_outboundEmailId_fkey" FOREIGN KEY ("outboundEmailId") REFERENCES "OutboundEmail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

