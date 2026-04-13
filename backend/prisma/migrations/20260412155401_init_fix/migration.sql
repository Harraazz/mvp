/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[referred_id]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - Made the column `referral_code` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ORGANIZER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
ALTER COLUMN "referral_code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referred_id_key" ON "Referral"("referred_id");
