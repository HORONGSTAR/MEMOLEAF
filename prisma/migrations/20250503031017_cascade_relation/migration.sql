/*
  Warnings:

  - You are about to drop the column `folded` on the `memo` table. All the data in the column will be lost.
  - Added the required column `markdown` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` ADD COLUMN `alt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `memo` DROP COLUMN `folded`,
    ADD COLUMN `markdown` BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE `Style` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `option` ENUM('folder', 'secret', 'font', 'color') NOT NULL,
    `extra` VARCHAR(20) NOT NULL,
    `memoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Style` ADD CONSTRAINT `Style_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
