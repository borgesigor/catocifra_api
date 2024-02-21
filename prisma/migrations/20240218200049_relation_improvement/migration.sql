/*
  Warnings:

  - The primary key for the `PlaylistContributor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlaylistContributor` table. All the data in the column will be lost.
  - The primary key for the `PlaylistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PlaylistSong` table. All the data in the column will be lost.
  - The primary key for the `SongArtist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SongArtist` table. All the data in the column will be lost.
  - The primary key for the `SongCompositor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artistId` on the `SongCompositor` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SongCompositor` table. All the data in the column will be lost.
  - The primary key for the `SongGenre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SongGenre` table. All the data in the column will be lost.
  - The primary key for the `TablatureContributor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TablatureContributor` table. All the data in the column will be lost.
  - You are about to drop the `CommentWhere` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `compositorId` to the `SongCompositor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommentWhere" DROP CONSTRAINT "CommentWhere_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentWhere" DROP CONSTRAINT "CommentWhere_targetProfileId_fkey";

-- DropForeignKey
ALTER TABLE "SongCompositor" DROP CONSTRAINT "SongCompositor_artistId_fkey";

-- AlterTable
ALTER TABLE "PlaylistContributor" DROP CONSTRAINT "PlaylistContributor_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlaylistContributor_pkey" PRIMARY KEY ("contributorId", "playlistId");

-- AlterTable
ALTER TABLE "PlaylistSong" DROP CONSTRAINT "PlaylistSong_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PlaylistSong_pkey" PRIMARY KEY ("playlistId", "songId");

-- AlterTable
ALTER TABLE "SongArtist" DROP CONSTRAINT "SongArtist_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SongArtist_pkey" PRIMARY KEY ("songId", "artistId");

-- AlterTable
ALTER TABLE "SongCompositor" DROP CONSTRAINT "SongCompositor_pkey",
DROP COLUMN "artistId",
DROP COLUMN "id",
ADD COLUMN     "compositorId" TEXT NOT NULL,
ADD CONSTRAINT "SongCompositor_pkey" PRIMARY KEY ("songId", "compositorId");

-- AlterTable
ALTER TABLE "SongGenre" DROP CONSTRAINT "SongGenre_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SongGenre_pkey" PRIMARY KEY ("songId", "genreId");

-- AlterTable
ALTER TABLE "TablatureContributor" DROP CONSTRAINT "TablatureContributor_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "TablatureContributor_pkey" PRIMARY KEY ("contributorId", "tablatureId");

-- DropTable
DROP TABLE "CommentWhere";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "userId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("userId","followingId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileImageId" TEXT NOT NULL,
    "coverImageId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentProfile" (
    "commentId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentProfile_pkey" PRIMARY KEY ("commentId","profileId")
);

-- CreateTable
CREATE TABLE "CommentTablature" (
    "commentId" TEXT NOT NULL,
    "tablatureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentTablature_pkey" PRIMARY KEY ("commentId","tablatureId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentProfile_commentId_key" ON "CommentProfile"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentTablature_commentId_key" ON "CommentTablature"("commentId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongCompositor" ADD CONSTRAINT "SongCompositor_compositorId_fkey" FOREIGN KEY ("compositorId") REFERENCES "Compositor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentProfile" ADD CONSTRAINT "CommentProfile_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentProfile" ADD CONSTRAINT "CommentProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTablature" ADD CONSTRAINT "CommentTablature_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentTablature" ADD CONSTRAINT "CommentTablature_tablatureId_fkey" FOREIGN KEY ("tablatureId") REFERENCES "Tablature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
