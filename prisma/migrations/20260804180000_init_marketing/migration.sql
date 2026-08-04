CREATE TABLE "MarketingContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "normalizedEmail" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "language" TEXT DEFAULT 'en',
    "customerId" TEXT,
    "hasConsent" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" TIMESTAMP(3),
    "consentSource" TEXT,
    "customFields" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingContact_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MarketingList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingList_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MarketingContactList" (
    "contactId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingContactList_pkey" PRIMARY KEY ("contactId","listId")
);
CREATE TABLE "MarketingTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingTag_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MarketingContactTag" (
    "contactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingContactTag_pkey" PRIMARY KEY ("contactId","tagId")
);
CREATE TABLE "MarketingSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingSegment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "designJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CampaignMetricDaily" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "bouncedCount" INTEGER NOT NULL DEFAULT 0,
    "deferredCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "unsubCount" INTEGER NOT NULL DEFAULT 0,
    "complaintCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMetricDaily_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "CampaignMetricHourly" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "bouncedCount" INTEGER NOT NULL DEFAULT 0,
    "deferredCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "unsubCount" INTEGER NOT NULL DEFAULT 0,
    "complaintCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMetricHourly_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "DomainProviderMetric" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "bouncedCount" INTEGER NOT NULL DEFAULT 0,
    "deferredCount" INTEGER NOT NULL DEFAULT 0,
    "openedCount" INTEGER NOT NULL DEFAULT 0,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainProviderMetric_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AudienceMetricDaily" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "activeContacts" INTEGER NOT NULL DEFAULT 0,
    "newSubscribers" INTEGER NOT NULL DEFAULT 0,
    "unsubscribes" INTEGER NOT NULL DEFAULT 0,
    "hardBounces" INTEGER NOT NULL DEFAULT 0,
    "complaints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudienceMetricDaily_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "LinkMetric" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickedCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueClicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkMetric_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "DeliverabilityAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "campaignId" TEXT,
    "provider" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliverabilityAlert_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MtaNode" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "ipAddress" TEXT,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MtaNode_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "MtaProviderState" (
    "id" TEXT NOT NULL,
    "mtaNodeId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "rateLimitPerMinute" INTEGER NOT NULL DEFAULT 0,
    "concurrency" INTEGER NOT NULL DEFAULT 0,
    "pausedUntil" TIMESTAMP(3),
    "consecutiveDeferrals" INTEGER NOT NULL DEFAULT 0,
    "lastEnhancedCode" TEXT,
    "lastDiagnostic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MtaProviderState_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MarketingContact_email_key" ON "MarketingContact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingContact_normalizedEmail_key" ON "MarketingContact"("normalizedEmail");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingContact_customerId_key" ON "MarketingContact"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingList_name_key" ON "MarketingList"("name");

-- CreateIndex
CREATE INDEX "MarketingContactList_listId_idx" ON "MarketingContactList"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingTag_name_key" ON "MarketingTag"("name");

-- CreateIndex
CREATE INDEX "MarketingContactTag_tagId_idx" ON "MarketingContactTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingSegment_name_key" ON "MarketingSegment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE INDEX "CampaignMetricDaily_campaignId_idx" ON "CampaignMetricDaily"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignMetricDaily_date_idx" ON "CampaignMetricDaily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMetricDaily_campaignId_date_key" ON "CampaignMetricDaily"("campaignId", "date");

-- CreateIndex
CREATE INDEX "CampaignMetricHourly_campaignId_idx" ON "CampaignMetricHourly"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignMetricHourly_hour_idx" ON "CampaignMetricHourly"("hour");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMetricHourly_campaignId_hour_key" ON "CampaignMetricHourly"("campaignId", "hour");

-- CreateIndex
CREATE INDEX "DomainProviderMetric_campaignId_idx" ON "DomainProviderMetric"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainProviderMetric_campaignId_provider_key" ON "DomainProviderMetric"("campaignId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "AudienceMetricDaily_date_key" ON "AudienceMetricDaily"("date");

-- CreateIndex
CREATE INDEX "LinkMetric_campaignId_idx" ON "LinkMetric"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkMetric_campaignId_url_key" ON "LinkMetric"("campaignId", "url");

-- CreateIndex
CREATE INDEX "DeliverabilityAlert_isResolved_idx" ON "DeliverabilityAlert"("isResolved");

-- CreateIndex
CREATE INDEX "DeliverabilityAlert_createdAt_idx" ON "DeliverabilityAlert"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MtaNode_hostname_key" ON "MtaNode"("hostname");

-- CreateIndex
CREATE UNIQUE INDEX "MtaProviderState_mtaNodeId_provider_key" ON "MtaProviderState"("mtaNodeId", "provider");

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey

-- AddForeignKey
ALTER TABLE "MarketingContact" ADD CONSTRAINT "MarketingContact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingContactList" ADD CONSTRAINT "MarketingContactList_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "MarketingContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingContactList" ADD CONSTRAINT "MarketingContactList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "MarketingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingContactTag" ADD CONSTRAINT "MarketingContactTag_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "MarketingContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingContactTag" ADD CONSTRAINT "MarketingContactTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "MarketingTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;


