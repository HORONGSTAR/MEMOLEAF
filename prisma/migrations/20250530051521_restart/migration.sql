/*
  Warnings:

  - Added the required column `emoji` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Emoji" AS ENUM ('like', 'love', 'hot', 'perfect', 'hmm');

-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "emoji" "Emoji" NOT NULL;
