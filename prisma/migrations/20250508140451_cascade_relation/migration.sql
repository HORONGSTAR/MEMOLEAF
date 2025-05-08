/*
  Warnings:

  - You are about to alter the column `option` on the `style` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(10)`.
  - Made the column `alt` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `image` MODIFY `alt` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `style` MODIFY `option` VARCHAR(10) NOT NULL;
