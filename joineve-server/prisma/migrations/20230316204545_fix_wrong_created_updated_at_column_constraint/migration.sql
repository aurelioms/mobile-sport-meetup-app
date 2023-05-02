/*
  Warnings:

  - Made the column `createdAt` on table `comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `otpcode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `comment` MODIFY `updatedAt` DATETIME(3) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `otpcode` MODIFY `updatedAt` DATETIME(3) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
