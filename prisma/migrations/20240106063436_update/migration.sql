-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
