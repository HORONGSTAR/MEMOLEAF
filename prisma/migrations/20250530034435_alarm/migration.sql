/*
  Warnings:

  - A unique constraint covering the columns `[pinnedId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pinnedId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_pinnedId_key" ON "User"("pinnedId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pinnedId_fkey" FOREIGN KEY ("pinnedId") REFERENCES "Memo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
