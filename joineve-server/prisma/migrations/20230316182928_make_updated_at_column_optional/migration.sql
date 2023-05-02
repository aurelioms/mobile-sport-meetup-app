-- AlterTable
ALTER TABLE `Comment` MODIFY `createdAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `OtpCode` MODIFY `createdAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `SportEvent` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `SportType` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NULL;
