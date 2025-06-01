/*
  Warnings:

  - You are about to drop the `Alarm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Alarm" DROP CONSTRAINT "Alarm_sanderId_fkey";

-- DropTable
DROP TABLE "Alarm";

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "aria" "Aria" NOT NULL,
    "link" INTEGER NOT NULL,
    "sanderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sanderId_fkey" FOREIGN KEY ("sanderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
