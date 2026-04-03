/*
  Warnings:

  - The values [SoldOut] on the enum `LandType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LandType_new" AS ENUM ('Sale', 'Rent', 'Sold');
ALTER TABLE "Property" ALTER COLUMN "landType" TYPE "LandType_new" USING ("landType"::text::"LandType_new");
ALTER TYPE "LandType" RENAME TO "LandType_old";
ALTER TYPE "LandType_new" RENAME TO "LandType";
DROP TYPE "public"."LandType_old";
COMMIT;
