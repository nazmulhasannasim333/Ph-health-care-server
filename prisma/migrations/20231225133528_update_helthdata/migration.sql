/*
  Warnings:

  - You are about to drop the column `PregnancyStatus` on the `patientHelthDatas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patientHelthDatas" DROP COLUMN "PregnancyStatus",
ADD COLUMN     "pregnancyStatus" BOOLEAN DEFAULT false;
