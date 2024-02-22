/*
  Warnings:

  - You are about to drop the column `permission` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ACL` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission";

-- CreateIndex
CREATE UNIQUE INDEX "ACL_userId_key" ON "ACL"("userId");
