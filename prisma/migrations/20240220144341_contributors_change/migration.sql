/*
  Warnings:

  - The primary key for the `PlaylistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `PlaylistContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TablatureContributor` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `PlaylistSong` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "PlaylistContributor" DROP CONSTRAINT "PlaylistContributor_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistContributor" DROP CONSTRAINT "PlaylistContributor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "TablatureContributor" DROP CONSTRAINT "TablatureContributor_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "TablatureContributor" DROP CONSTRAINT "TablatureContributor_tablatureId_fkey";

-- AlterTable
ALTER TABLE "Contributor" ADD COLUMN     "playlistId" TEXT,
ADD COLUMN     "tablatureId" TEXT;

-- AlterTable
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "PlaylistContributor";

-- DropTable
DROP TABLE "TablatureContributor";

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_tablatureId_fkey" FOREIGN KEY ("tablatureId") REFERENCES "Tablature"("id") ON DELETE SET NULL ON UPDATE CASCADE;
