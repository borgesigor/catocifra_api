/*
  Warnings:

  - The primary key for the `PlaylistContributor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlaylistContributor` table. All the data in the column will be lost.
  - Made the column `playlistId` on table `PlaylistContributor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PlaylistContributor" DROP CONSTRAINT "PlaylistContributor_playlistId_fkey";

-- DropIndex
DROP INDEX "PlaylistContributor_userId_key";

-- AlterTable
ALTER TABLE "PlaylistContributor" DROP CONSTRAINT "PlaylistContributor_pkey",
DROP COLUMN "id",
ALTER COLUMN "playlistId" SET NOT NULL,
ADD CONSTRAINT "PlaylistContributor_pkey" PRIMARY KEY ("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "PlaylistContributor" ADD CONSTRAINT "PlaylistContributor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
