/*
  Warnings:

  - Added the required column `updatedAt` to the `prescriptions` table without a default value. This is not possible if the table is not empty.
  - Made the column `instructions` on table `prescriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "instructions" SET NOT NULL;
