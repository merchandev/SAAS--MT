-- Operational indexes for booking dashboards, filters, reporting, and dispatch.
CREATE INDEX "Booking_bookingStatus_idx" ON "Booking"("bookingStatus");
CREATE INDEX "Booking_serviceDate_idx" ON "Booking"("serviceDate");
CREATE INDEX "Booking_driverId_idx" ON "Booking"("driverId");
CREATE INDEX "Booking_hotelId_idx" ON "Booking"("hotelId");
CREATE INDEX "Booking_agencyId_idx" ON "Booking"("agencyId");
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
CREATE INDEX "Booking_bookingStatus_serviceDate_idx" ON "Booking"("bookingStatus", "serviceDate");
CREATE INDEX "Booking_driverId_serviceDate_idx" ON "Booking"("driverId", "serviceDate");

-- Availability blocks for future dispatch conflict checks.
CREATE TABLE "DriverAvailability" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverAvailability_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VehicleAvailability" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleAvailability_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DriverAvailability_driverId_startsAt_endsAt_idx" ON "DriverAvailability"("driverId", "startsAt", "endsAt");
CREATE INDEX "VehicleAvailability_vehicleId_startsAt_endsAt_idx" ON "VehicleAvailability"("vehicleId", "startsAt", "endsAt");

ALTER TABLE "DriverAvailability" ADD CONSTRAINT "DriverAvailability_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "VehicleAvailability" ADD CONSTRAINT "VehicleAvailability_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
