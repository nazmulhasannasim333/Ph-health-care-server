/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `patientHelthDatas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `patientHelthDatas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patientHelthDatas" ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patientHelthDatas_patientId_key" ON "patientHelthDatas"("patientId");

-- AddForeignKey
ALTER TABLE "patientHelthDatas" ADD CONSTRAINT "patientHelthDatas_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
