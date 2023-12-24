/*
  Warnings:

  - You are about to drop the `doctor_specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialtiesId_fkey";

-- DropTable
DROP TABLE "doctor_specialties";

-- CreateTable
CREATE TABLE "_DoctorToSpecialties" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorToSpecialties_AB_unique" ON "_DoctorToSpecialties"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorToSpecialties_B_index" ON "_DoctorToSpecialties"("B");

-- AddForeignKey
ALTER TABLE "_DoctorToSpecialties" ADD CONSTRAINT "_DoctorToSpecialties_A_fkey" FOREIGN KEY ("A") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToSpecialties" ADD CONSTRAINT "_DoctorToSpecialties_B_fkey" FOREIGN KEY ("B") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
