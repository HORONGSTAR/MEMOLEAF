/*
  Warnings:

  - The values [title] on the enum `Style_option` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `style` MODIFY `option` ENUM('info', 'folder', 'secret', 'font', 'color') NOT NULL;
