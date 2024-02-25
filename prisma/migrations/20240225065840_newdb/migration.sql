/*
  Warnings:

  - You are about to drop the column `doctorScheduleId` on the `appointments` table. All the data in the column will be lost.
  - The primary key for the `doctorSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `doctorSchedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorScheduleId_fkey";

-- DropIndex
DROP INDEX "appointments_doctorScheduleId_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "doctorScheduleId",
ADD COLUMN     "scheduleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctorSchedule" DROP CONSTRAINT "doctorSchedule_pkey",
DROP COLUMN "id",
ADD COLUMN     "appointmentId" TEXT,
ADD CONSTRAINT "doctorSchedule_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_scheduleId_key" ON "appointments"("scheduleId");

-- AddForeignKey
ALTER TABLE "doctorSchedule" ADD CONSTRAINT "doctorSchedule_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
