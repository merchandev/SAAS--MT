-- AlterTable
ALTER TABLE "Post" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "StaticPage" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "RoutePage" ADD COLUMN "translations" JSONB;
