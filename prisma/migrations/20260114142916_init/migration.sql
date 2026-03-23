/*
  Warnings:

  - You are about to drop the column `userCus` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `userMain` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `des` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `userCus` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `userMain` on the `like` table. All the data in the column will be lost.
  - You are about to drop the column `des` on the `mess` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `mess` table. All the data in the column will be lost.
  - You are about to drop the column `userMain` on the `post` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Mess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Mess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Mess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userMain_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_userMain_fkey`;

-- DropIndex
DROP INDEX `Comment_userMain_fkey` ON `comment`;

-- DropIndex
DROP INDEX `Post_userMain_fkey` ON `post`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `userCus`,
    DROP COLUMN `userMain`,
    ADD COLUMN `postId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `like` DROP COLUMN `des`,
    DROP COLUMN `userCus`,
    DROP COLUMN `userMain`,
    ADD COLUMN `postId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mess` DROP COLUMN `des`,
    DROP COLUMN `img`,
    ADD COLUMN `content` LONGTEXT NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `roomId` INTEGER NOT NULL,
    ADD COLUMN `senderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `userMain`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` BOOLEAN NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemberRoom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `joinAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` INTEGER NOT NULL,
    `fileUrl` TEXT NOT NULL,
    `fileType` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostToUser_AB_unique`(`A`, `B`),
    INDEX `_PostToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CommentToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CommentToUser_AB_unique`(`A`, `B`),
    INDEX `_CommentToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CommentToPost` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CommentToPost_AB_unique`(`A`, `B`),
    INDEX `_CommentToPost_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MemberRoomToRoom` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MemberRoomToRoom_AB_unique`(`A`, `B`),
    INDEX `_MemberRoomToRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MemberRoomToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MemberRoomToUser_AB_unique`(`A`, `B`),
    INDEX `_MemberRoomToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MessToRoom` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MessToRoom_AB_unique`(`A`, `B`),
    INDEX `_MessToRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MessToMessStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MessToMessStatus_AB_unique`(`A`, `B`),
    INDEX `_MessToMessStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MessStatusToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MessStatusToUser_AB_unique`(`A`, `B`),
    INDEX `_MessStatusToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToMess` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AttachmentToMess_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToMess_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToUser` ADD CONSTRAINT `_PostToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToUser` ADD CONSTRAINT `_CommentToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToUser` ADD CONSTRAINT `_CommentToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToPost` ADD CONSTRAINT `_CommentToPost_A_fkey` FOREIGN KEY (`A`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CommentToPost` ADD CONSTRAINT `_CommentToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberRoomToRoom` ADD CONSTRAINT `_MemberRoomToRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `MemberRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberRoomToRoom` ADD CONSTRAINT `_MemberRoomToRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberRoomToUser` ADD CONSTRAINT `_MemberRoomToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `MemberRoom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MemberRoomToUser` ADD CONSTRAINT `_MemberRoomToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessToRoom` ADD CONSTRAINT `_MessToRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `Mess`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessToRoom` ADD CONSTRAINT `_MessToRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessToMessStatus` ADD CONSTRAINT `_MessToMessStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Mess`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessToMessStatus` ADD CONSTRAINT `_MessToMessStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `MessStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessStatusToUser` ADD CONSTRAINT `_MessStatusToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `MessStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MessStatusToUser` ADD CONSTRAINT `_MessStatusToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToMess` ADD CONSTRAINT `_AttachmentToMess_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToMess` ADD CONSTRAINT `_AttachmentToMess_B_fkey` FOREIGN KEY (`B`) REFERENCES `Mess`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
