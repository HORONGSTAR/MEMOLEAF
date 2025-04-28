/*
  Warnings:

  - You are about to alter the column `title` on the `memo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE `memo` MODIFY `title` VARCHAR(30) NOT NULL;
