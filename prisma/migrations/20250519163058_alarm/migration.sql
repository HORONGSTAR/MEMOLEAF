/*
  Warnings:

  - Added the required column `linkId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" ADD COLUMN     "linkId" INTEGER NOT NULL;
