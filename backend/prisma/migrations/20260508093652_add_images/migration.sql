-- AlterTable
ALTER TABLE "User" ADD COLUMN "profilePicture" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "houseId" INTEGER NOT NULL,
    CONSTRAINT "Image_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
