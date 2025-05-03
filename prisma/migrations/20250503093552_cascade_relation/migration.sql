/*
  Warnings:

  - You are about to drop the column `markdown` on the `memo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `memo` DROP COLUMN `markdown`;

-- AlterTable
ALTER TABLE `style` MODIFY `option` ENUM('folder', 'secret', 'title', 'font', 'color') NOT NULL;
