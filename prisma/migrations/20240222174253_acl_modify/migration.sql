/*
  Warnings:

  - You are about to drop the `ACL` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ACL" DROP CONSTRAINT "ACL_userId_fkey";

-- DropTable
DROP TABLE "ACL";

-- CreateTable
CREATE TABLE "ACLGroupUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ACLGroupUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ACLGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "permission" TEXT[],

    CONSTRAINT "ACLGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ACLGroupUser" ADD CONSTRAINT "ACLGroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACLGroupUser" ADD CONSTRAINT "ACLGroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ACLGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
