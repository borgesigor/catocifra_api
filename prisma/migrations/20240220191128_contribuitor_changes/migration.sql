/*
  Warnings:

  - You are about to drop the `Contributor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_tablatureId_fkey";

-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_userId_fkey";

-- DropTable
DROP TABLE "Contributor";

-- CreateTable
CREATE TABLE "PlaylistContributor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT,

    CONSTRAINT "PlaylistContributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistContributor_userId_key" ON "PlaylistContributor"("userId");

-- AddForeignKey
ALTER TABLE "PlaylistContributor" ADD CONSTRAINT "PlaylistContributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistContributor" ADD CONSTRAINT "PlaylistContributor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
