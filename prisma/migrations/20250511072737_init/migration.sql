-- DropIndex
DROP INDEX `User_userNum_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `userNum` INTEGER NULL;
