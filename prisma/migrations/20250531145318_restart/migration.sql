/*
  Warnings:

  - You are about to drop the column `note` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pinnedId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pinnedId_fkey";

-- DropIndex
DROP INDEX "User_pinnedId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "note",
DROP COLUMN "pinnedId";
