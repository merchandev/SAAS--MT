CREATE TABLE "CustomerSuggestion" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSuggestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CustomerSuggestion_customerId_idx" ON "CustomerSuggestion"("customerId");
CREATE INDEX "CustomerSuggestion_status_idx" ON "CustomerSuggestion"("status");

ALTER TABLE "CustomerSuggestion" ADD CONSTRAINT "CustomerSuggestion_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
