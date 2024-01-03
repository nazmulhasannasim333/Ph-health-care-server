/*
  Warnings:

  - Made the column `contactNumber` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `admins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "maritalStatus" DROP NOT NULL;
