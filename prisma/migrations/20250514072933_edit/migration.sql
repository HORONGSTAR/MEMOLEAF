/*
  Warnings:

  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `VarChar(10)`.

*/
-- DropForeignKey
ALTER TABLE `memo` DROP FOREIGN KEY `Memo_parentId_fkey`;

-- DropIndex
DROP INDEX `Memo_parentId_fkey` ON `memo`;

-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(10) NOT NULL;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
