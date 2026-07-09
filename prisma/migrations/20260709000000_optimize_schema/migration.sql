-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "originLat" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "originLng" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "destinationLat" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "destinationLng" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "returnDate" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN "returnTime" TEXT;
ALTER TABLE "Booking" ADD COLUMN "returnFlightNumber" TEXT;
ALTER TABLE "Booking" ADD COLUMN "pickupSign" TEXT;
ALTER TABLE "Booking" ADD COLUMN "babySeats" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Booking" ADD COLUMN "wheelchair" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Booking_createdAt_bookingStatus_idx" ON "Booking"("createdAt", "bookingStatus");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
