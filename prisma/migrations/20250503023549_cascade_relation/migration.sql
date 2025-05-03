/*
  Warnings:

  - You are about to drop the column `style` on the `memo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `memo` DROP COLUMN `style`,
    ADD COLUMN `folded` BOOLEAN NULL;
