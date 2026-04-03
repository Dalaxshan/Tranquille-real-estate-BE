/*
  Warnings:

  - The primary key for the `Property` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `propertyId` on the `Agent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `propertyId` on the `Blueprint` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `propertyId` on the `PropertyStatistics` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `propertyId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Agent" DROP CONSTRAINT "Agent_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Blueprint" DROP CONSTRAINT "Blueprint_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyStatistics" DROP CONSTRAINT "PropertyStatistics_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_propertyId_fkey";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "propertyId",
ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Blueprint" DROP COLUMN "propertyId",
ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Property" DROP CONSTRAINT "Property_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PropertyStatistics" DROP COLUMN "propertyId",
ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "propertyId",
ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_propertyId_key" ON "Agent"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint_propertyId_key" ON "Blueprint"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyStatistics_propertyId_key" ON "PropertyStatistics"("propertyId");

-- AddForeignKey
ALTER TABLE "Blueprint" ADD CONSTRAINT "Blueprint_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyStatistics" ADD CONSTRAINT "PropertyStatistics_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
