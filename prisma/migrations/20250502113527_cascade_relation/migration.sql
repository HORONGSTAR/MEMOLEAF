/*
  Warnings:

  - You are about to drop the `style` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `style` DROP FOREIGN KEY `Style_memoId_fkey`;

-- AlterTable
ALTER TABLE `memo` ADD COLUMN `style` ENUM('collapse') NULL;

-- DropTable
DROP TABLE `style`;
