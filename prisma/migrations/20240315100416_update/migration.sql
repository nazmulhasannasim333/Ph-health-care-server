/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `pushNotificationToken` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "bloodGroup",
DROP COLUMN "contactNumber",
DROP COLUMN "dateOfBirth",
DROP COLUMN "designation",
DROP COLUMN "gender",
DROP COLUMN "maritalStatus",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "pushNotificationToken";
