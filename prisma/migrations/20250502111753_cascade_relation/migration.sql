/*
  Warnings:

  - You are about to drop the column `target` on the `style` table. All the data in the column will be lost.
  - You are about to alter the column `options` on the `style` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `style` DROP COLUMN `target`,
    MODIFY `options` ENUM('collapse') NOT NULL;
