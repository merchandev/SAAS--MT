CREATE TABLE IF NOT EXISTS "EmailWorkerHeartbeat" (
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
