/*
  Warnings:

  - You are about to drop the column `targetId` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `myId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "targetId",
ADD COLUMN     "myId" INTEGER NOT NULL;
