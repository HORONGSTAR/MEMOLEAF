/*
  Warnings:

  - You are about to drop the column `noteId` on the `memo` table. All the data in the column will be lost.
  - You are about to drop the `note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `memo` DROP FOREIGN KEY `Memo_noteId_fkey`;

-- DropIndex
DROP INDEX `Memo_noteId_fkey` ON `memo`;

-- AlterTable
ALTER TABLE `memo` DROP COLUMN `noteId`;

-- DropTable
DROP TABLE `note`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detail` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `memoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
