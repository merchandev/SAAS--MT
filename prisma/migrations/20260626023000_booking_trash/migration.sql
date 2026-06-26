ALTER TABLE "Booking" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN "deletedBy" TEXT;
ALTER TABLE "Booking" ADD COLUMN "deletedReason" TEXT;

CREATE INDEX "Booking_deletedAt_idx" ON "Booking"("deletedAt");
