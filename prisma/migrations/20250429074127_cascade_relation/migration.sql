-- DropForeignKey
ALTER TABLE `bookmark` DROP FOREIGN KEY `BookMark_memoId_fkey`;

-- DropForeignKey
ALTER TABLE `bookmark` DROP FOREIGN KEY `BookMark_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_memoId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_memoId_fkey`;

-- DropForeignKey
ALTER TABLE `memo` DROP FOREIGN KEY `Memo_userId_fkey`;

-- DropForeignKey
ALTER TABLE `style` DROP FOREIGN KEY `Style_memoId_fkey`;

-- DropForeignKey
ALTER TABLE `thread` DROP FOREIGN KEY `Thread_firstId_fkey`;

-- DropForeignKey
ALTER TABLE `thread` DROP FOREIGN KEY `Thread_laterId_fkey`;

-- DropIndex
DROP INDEX `BookMark_memoId_fkey` ON `bookmark`;

-- DropIndex
DROP INDEX `BookMark_userId_fkey` ON `bookmark`;

-- DropIndex
DROP INDEX `Comment_memoId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Comment_userId_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Image_memoId_fkey` ON `image`;

-- DropIndex
DROP INDEX `Memo_userId_fkey` ON `memo`;

-- DropIndex
DROP INDEX `Style_memoId_fkey` ON `style`;

-- DropIndex
DROP INDEX `Thread_firstId_fkey` ON `thread`;

-- DropIndex
DROP INDEX `Thread_laterId_fkey` ON `thread`;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Style` ADD CONSTRAINT `Style_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thread` ADD CONSTRAINT `Thread_firstId_fkey` FOREIGN KEY (`firstId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thread` ADD CONSTRAINT `Thread_laterId_fkey` FOREIGN KEY (`laterId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookMark` ADD CONSTRAINT `BookMark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookMark` ADD CONSTRAINT `BookMark_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
