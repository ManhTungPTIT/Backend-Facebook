/*
  Warnings:

  - Added the required column `date` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `sex` INTEGER NOT NULL;
