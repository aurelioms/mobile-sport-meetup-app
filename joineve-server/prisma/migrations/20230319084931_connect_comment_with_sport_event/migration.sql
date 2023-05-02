/*
  Warnings:

  - Added the required column `sportEventId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `sportEventId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_sportEventId_fkey` FOREIGN KEY (`sportEventId`) REFERENCES `SportEvent`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
