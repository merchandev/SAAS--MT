import { prisma } from "@/lib/prisma";
import { emailConfig } from "./config";
import { OutboundEmail } from "@prisma/client";
import { DateTime } from "luxon";

export async function claimEmails(batchSize: number = emailConfig.worker.batchSize): Promise<OutboundEmail[]> {
  const workerId = emailConfig.worker.id;
  const lockSeconds = emailConfig.worker.lockSeconds;

  // Actualizamos el heartbeat del worker
  await prisma.$executeRaw`
    INSERT INTO "EmailWorkerHeartbeat" ("workerId", "hostname", "pid", "lastSeenAt", "updatedAt")
    VALUES (${workerId}, ${process.env.HOSTNAME || 'localhost'}, ${process.pid}, NOW(), NOW())
    ON CONFLICT ("workerId") DO UPDATE SET "lastSeenAt" = NOW(), "updatedAt" = NOW()
  `;

  // Consulta cruda con SKIP LOCKED para concurrencia segura
  const claimed: OutboundEmail[] = await prisma.$queryRaw`
    UPDATE "OutboundEmail"
    SET
      "status" = 'PROCESSING',
      "lockedAt" = NOW(),
      "lockedUntil" = NOW() + (${lockSeconds} || ' seconds')::interval,
      "lockedBy" = ${workerId},
      "attempts" = "attempts" + 1,
      "updatedAt" = NOW()
    WHERE "id" IN (
      SELECT oe."id" FROM "OutboundEmail" oe
      LEFT JOIN "EmailCampaign" c ON c."id" = oe."campaignId"
      WHERE
        oe."status" IN ('QUEUED', 'DEFERRED')
        AND oe."availableAt" <= NOW()
        AND (oe."lockedUntil" IS NULL OR oe."lockedUntil" < NOW())
        AND oe."attempts" < oe."maxAttempts"
        AND (c."id" IS NULL OR c."status" NOT IN ('PAUSED', 'CANCELLED', 'FAILED'))
      ORDER BY oe."priority" ASC, oe."availableAt" ASC
      FOR UPDATE OF oe SKIP LOCKED
      LIMIT ${batchSize}
    )
    RETURNING *;
  `;

  return claimed;
}

export async function releaseEmail(id: string, status: "DEFERRED" | "FAILED" | "ACCEPTED" | "DELIVERED", error?: string, enhancedCode?: string, retryInSeconds?: number) {
  const data: any = {
    status,
    lockedUntil: null,
    lockedBy: null,
    lastError: error,
    lastEnhancedCode: enhancedCode,
  };

  if (retryInSeconds && status === "DEFERRED") {
    data.availableAt = DateTime.now().plus({ seconds: retryInSeconds }).toJSDate();
  }

  if (status === "ACCEPTED") data.acceptedAt = new Date();
  if (status === "DELIVERED") data.deliveredAt = new Date();
  if (status === "FAILED") data.failedAt = new Date();

  await prisma.outboundEmail.update({
    where: { id },
    data,
  });
}
