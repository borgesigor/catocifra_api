/*
  Warnings:

  - You are about to drop the `UserProfileComment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Artist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Compositor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Contributor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfileComment" DROP CONSTRAINT "UserProfileComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileComment" DROP CONSTRAINT "UserProfileComment_userTargetId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "text" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserProfileComment";

-- CreateTable
CREATE TABLE "CommentWhere" (
    "id" TEXT NOT NULL,
    "targetProfileId" TEXT,
    "targetTablatureId" TEXT,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "CommentWhere_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentWhere_commentId_key" ON "CommentWhere"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_userId_key" ON "Artist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Compositor_userId_key" ON "Compositor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_userId_key" ON "Contributor"("userId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentWhere" ADD CONSTRAINT "CommentWhere_targetProfileId_fkey" FOREIGN KEY ("targetProfileId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentWhere" ADD CONSTRAINT "CommentWhere_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
