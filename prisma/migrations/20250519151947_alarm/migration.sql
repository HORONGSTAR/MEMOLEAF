/*
  Warnings:

  - You are about to drop the column `link` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "link",
ADD COLUMN     "targetId" INTEGER NOT NULL;
