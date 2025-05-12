/*
  Warnings:

  - You are about to alter the column `kind` on the `deco` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Enum(EnumId(0))`.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_memoId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `thread` DROP FOREIGN KEY `Thread_firstId_fkey`;

-- DropForeignKey
ALTER TABLE `thread` DROP FOREIGN KEY `Thread_laterId_fkey`;

-- AlterTable
ALTER TABLE `bookmark` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `deco` MODIFY `kind` ENUM('subtext', 'folder', 'secret') NOT NULL;

-- AlterTable
ALTER TABLE `memo` ADD COLUMN `noteId` INTEGER NULL,
    ADD COLUMN `parentId` INTEGER NULL;

-- DropTable
DROP TABLE `comment`;

-- DropTable
DROP TABLE `thread`;

-- CreateTable
CREATE TABLE `Follows` (
    `followedById` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,

    PRIMARY KEY (`followingId`, `followedById`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(60) NOT NULL,
    `notice` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alarm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aria` ENUM('replies', 'follow', 'schedule') NOT NULL,
    `link` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followedById_fkey` FOREIGN KEY (`followedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `Note`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Memo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
