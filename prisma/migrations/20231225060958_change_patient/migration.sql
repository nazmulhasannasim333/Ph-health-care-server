/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `medicalReports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicalReports_patientId_key" ON "medicalReports"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_id_key" ON "patients"("id");
