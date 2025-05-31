/*
  Warnings:

  - You are about to drop the column `emoji` on the `Favorite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "emoji";

-- DropEnum
DROP TYPE "Emoji";
