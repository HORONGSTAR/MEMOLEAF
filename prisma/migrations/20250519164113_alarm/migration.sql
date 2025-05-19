/*
  Warnings:

  - You are about to drop the column `myId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Alarm` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readerId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_userId_fkey";

-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "myId",
DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "readerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
