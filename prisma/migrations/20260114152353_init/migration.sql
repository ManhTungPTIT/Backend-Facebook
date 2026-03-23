/*
  Warnings:

  - You are about to drop the `_attachmenttomess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_commenttopost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_commenttouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_liketopost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_liketouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_memberroomtoroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_memberroomtouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_messstatustouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_messtomessstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_messtoroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_messtouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_posttouser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roomId,userId]` on the table `MemberRoom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_attachmenttomess` DROP FOREIGN KEY `_AttachmentToMess_A_fkey`;

-- DropForeignKey
ALTER TABLE `_attachmenttomess` DROP FOREIGN KEY `_AttachmentToMess_B_fkey`;

-- DropForeignKey
ALTER TABLE `_commenttopost` DROP FOREIGN KEY `_CommentToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_commenttopost` DROP FOREIGN KEY `_CommentToPost_B_fkey`;

-- DropForeignKey
ALTER TABLE `_commenttouser` DROP FOREIGN KEY `_CommentToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_commenttouser` DROP FOREIGN KEY `_CommentToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_liketopost` DROP FOREIGN KEY `_LikeToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_liketopost` DROP FOREIGN KEY `_LikeToPost_B_fkey`;

-- DropForeignKey
ALTER TABLE `_liketouser` DROP FOREIGN KEY `_LikeToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_liketouser` DROP FOREIGN KEY `_LikeToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_memberroomtoroom` DROP FOREIGN KEY `_MemberRoomToRoom_A_fkey`;

-- DropForeignKey
ALTER TABLE `_memberroomtoroom` DROP FOREIGN KEY `_MemberRoomToRoom_B_fkey`;

-- DropForeignKey
ALTER TABLE `_memberroomtouser` DROP FOREIGN KEY `_MemberRoomToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_memberroomtouser` DROP FOREIGN KEY `_MemberRoomToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_messstatustouser` DROP FOREIGN KEY `_MessStatusToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_messstatustouser` DROP FOREIGN KEY `_MessStatusToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_messtomessstatus` DROP FOREIGN KEY `_MessToMessStatus_A_fkey`;

-- DropForeignKey
ALTER TABLE `_messtomessstatus` DROP FOREIGN KEY `_MessToMessStatus_B_fkey`;

-- DropForeignKey
ALTER TABLE `_messtoroom` DROP FOREIGN KEY `_MessToRoom_A_fkey`;

-- DropForeignKey
ALTER TABLE `_messtoroom` DROP FOREIGN KEY `_MessToRoom_B_fkey`;

-- DropForeignKey
ALTER TABLE `_messtouser` DROP FOREIGN KEY `_MessToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_messtouser` DROP FOREIGN KEY `_MessToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_posttouser` DROP FOREIGN KEY `_PostToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_posttouser` DROP FOREIGN KEY `_PostToUser_B_fkey`;

-- DropTable
DROP TABLE `_attachmenttomess`;

-- DropTable
DROP TABLE `_commenttopost`;

-- DropTable
DROP TABLE `_commenttouser`;

-- DropTable
DROP TABLE `_liketopost`;

-- DropTable
DROP TABLE `_liketouser`;

-- DropTable
DROP TABLE `_memberroomtoroom`;

-- DropTable
DROP TABLE `_memberroomtouser`;

-- DropTable
DROP TABLE `_messstatustouser`;

-- DropTable
DROP TABLE `_messtomessstatus`;

-- DropTable
DROP TABLE `_messtoroom`;

-- DropTable
DROP TABLE `_messtouser`;

-- DropTable
DROP TABLE `_posttouser`;

-- CreateIndex
CREATE UNIQUE INDEX `MemberRoom_roomId_userId_key` ON `MemberRoom`(`roomId`, `userId`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberRoom` ADD CONSTRAINT `MemberRoom_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberRoom` ADD CONSTRAINT `MemberRoom_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mess` ADD CONSTRAINT `Mess_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mess` ADD CONSTRAINT `Mess_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessStatus` ADD CONSTRAINT `MessStatus_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Mess`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Mess`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
