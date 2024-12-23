/*
  Warnings:

  - You are about to drop the column `reatedAt` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "reatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
