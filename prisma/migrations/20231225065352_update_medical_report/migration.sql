/*
  Warnings:

  - You are about to drop the column `ReportLink` on the `medicalReports` table. All the data in the column will be lost.
  - You are about to drop the column `ReportName` on the `medicalReports` table. All the data in the column will be lost.
  - Added the required column `reportLink` to the `medicalReports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportName` to the `medicalReports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicalReports" DROP COLUMN "ReportLink",
DROP COLUMN "ReportName",
ADD COLUMN     "reportLink" TEXT NOT NULL,
ADD COLUMN     "reportName" TEXT NOT NULL;
