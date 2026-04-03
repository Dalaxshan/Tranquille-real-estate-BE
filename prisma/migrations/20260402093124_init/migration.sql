/*
  Warnings:

  - You are about to drop the column `lat` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `priceValue` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Property` table. All the data in the column will be lost.
  - Added the required column `pricePerch` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `price` on the `Property` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "priceValue",
DROP COLUMN "type",
ADD COLUMN     "pricePerch" DOUBLE PRECISION NOT NULL,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
