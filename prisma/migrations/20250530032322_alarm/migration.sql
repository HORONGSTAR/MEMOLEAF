/*
  Warnings:

  - You are about to drop the column `authorId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the column `linkId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the column `readerId` on the `Alarm` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `link` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientId` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sanderId` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Aria" ADD VALUE 'favorite';

-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_readerId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memoId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- AlterTable
ALTER TABLE "Alarm" DROP COLUMN "authorId",
DROP COLUMN "linkId",
DROP COLUMN "readerId",
ADD COLUMN     "link" INTEGER NOT NULL,
ADD COLUMN     "recipientId" INTEGER NOT NULL,
ADD COLUMN     "sanderId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_memoId_key" ON "Favorite"("userId", "memoId");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_sanderId_fkey" FOREIGN KEY ("sanderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarm" ADD CONSTRAINT "Alarm_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
