/*
  Warnings:

  - The values [schedule] on the enum `Alarm_aria` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `credits` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `follows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[credit]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credit` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `Follows_followedById_fkey`;

-- DropForeignKey
ALTER TABLE `follows` DROP FOREIGN KEY `Follows_followingId_fkey`;

-- DropIndex
DROP INDEX `User_credits_key` ON `user`;

-- AlterTable
ALTER TABLE `alarm` MODIFY `aria` ENUM('replies', 'follow', 'bookmark') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `credits`,
    ADD COLUMN `credit` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `follows`;

-- CreateTable
CREATE TABLE `Follow` (
    `fromUserId` INTEGER NOT NULL,
    `toUserId` INTEGER NOT NULL,

    PRIMARY KEY (`toUserId`, `fromUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_credit_key` ON `User`(`credit`);

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
