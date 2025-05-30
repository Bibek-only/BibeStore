-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "isEmailVerifyed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "profileImageUrl" DROP NOT NULL;
