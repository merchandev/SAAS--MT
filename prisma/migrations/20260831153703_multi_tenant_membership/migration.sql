-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logo" TEXT,
    "favicon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- Backfill Legacy Company
INSERT INTO "Company" ("id", "name", "slug", "active", "createdAt", "updatedAt") VALUES ('legacy-metransfers', 'MeTransfers', 'metransfers', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateTable
CREATE TABLE "CompanyMembership" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyMembership_pkey" PRIMARY KEY ("id")
);

-- Backfill Memberships for existing users
INSERT INTO "CompanyMembership" ("id", "companyId", "userId", "role", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, 'legacy-metransfers', "id", "role", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "User";

-- DropIndex
DROP INDEX "SystemSetting_key_key";

-- DropIndex
DROP INDEX "RoutePage_slug_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "companyId" TEXT;
UPDATE "Customer" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Customer" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "VehicleCategory" ADD COLUMN     "companyId" TEXT;
UPDATE "VehicleCategory" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "VehicleCategory" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "companyId" TEXT;
UPDATE "Vehicle" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Vehicle" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "companyId" TEXT;
UPDATE "Hotel" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Hotel" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "companyId" TEXT;
UPDATE "Agency" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Agency" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "companyId" TEXT;
UPDATE "Driver" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Driver" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "companyId" TEXT;
UPDATE "Booking" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Booking" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "companyId" TEXT;
UPDATE "EmailCampaign" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "EmailCampaign" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "SystemSetting" ADD COLUMN     "companyId" TEXT;
UPDATE "SystemSetting" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "SystemSetting" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "companyId" TEXT;
UPDATE "Invoice" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Invoice" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "companyId" TEXT;
UPDATE "Review" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "Review" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RoutePage" ADD COLUMN     "companyId" TEXT;
UPDATE "RoutePage" SET "companyId" = 'legacy-metransfers';
ALTER TABLE "RoutePage" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "companyId" TEXT;



-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_domain_key" ON "Company"("domain");

-- CreateIndex
CREATE INDEX "CompanyMembership_companyId_idx" ON "CompanyMembership"("companyId");

-- CreateIndex
CREATE INDEX "CompanyMembership_userId_idx" ON "CompanyMembership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyMembership_companyId_userId_key" ON "CompanyMembership"("companyId", "userId");

-- CreateIndex
CREATE INDEX "Customer_companyId_idx" ON "Customer"("companyId");

-- CreateIndex
CREATE INDEX "VehicleCategory_companyId_idx" ON "VehicleCategory"("companyId");

-- CreateIndex
CREATE INDEX "Vehicle_companyId_idx" ON "Vehicle"("companyId");

-- CreateIndex
CREATE INDEX "Hotel_companyId_idx" ON "Hotel"("companyId");

-- CreateIndex
CREATE INDEX "Agency_companyId_idx" ON "Agency"("companyId");

-- CreateIndex
CREATE INDEX "Driver_companyId_idx" ON "Driver"("companyId");

-- CreateIndex
CREATE INDEX "Booking_companyId_idx" ON "Booking"("companyId");

-- CreateIndex
CREATE INDEX "EmailCampaign_companyId_idx" ON "EmailCampaign"("companyId");

-- CreateIndex
CREATE INDEX "SystemSetting_companyId_idx" ON "SystemSetting"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_companyId_key_key" ON "SystemSetting"("companyId", "key");

-- CreateIndex
CREATE INDEX "Invoice_companyId_idx" ON "Invoice"("companyId");

-- CreateIndex
CREATE INDEX "Review_companyId_idx" ON "Review"("companyId");

-- CreateIndex
CREATE INDEX "RoutePage_companyId_idx" ON "RoutePage"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "RoutePage_companyId_slug_key" ON "RoutePage"("companyId", "slug");

-- CreateIndex
CREATE INDEX "ContactMessage_companyId_idx" ON "ContactMessage"("companyId");

-- AddForeignKey
ALTER TABLE "CompanyMembership" ADD CONSTRAINT "CompanyMembership_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyMembership" ADD CONSTRAINT "CompanyMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCategory" ADD CONSTRAINT "VehicleCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemSetting" ADD CONSTRAINT "SystemSetting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutePage" ADD CONSTRAINT "RoutePage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

