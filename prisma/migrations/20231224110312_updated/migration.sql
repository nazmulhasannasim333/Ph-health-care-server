/*
  Warnings:

  - You are about to drop the `_DoctorToSpecialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DoctorToSpecialties" DROP CONSTRAINT "_DoctorToSpecialties_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToSpecialties" DROP CONSTRAINT "_DoctorToSpecialties_B_fkey";

-- DropTable
DROP TABLE "_DoctorToSpecialties";
