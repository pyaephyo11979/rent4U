/*
  Warnings:

  - Added the required column `city` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_House" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "rooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "dateAvailable" DATETIME NOT NULL,
    "rented" BOOLEAN NOT NULL DEFAULT false,
    "rentedAt" DATETIME,
    "rentedUntil" DATETIME,
    "rentedById" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "House_rentedById_fkey" FOREIGN KEY ("rentedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "House_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_House" ("address", "bathrooms", "createdAt", "dateAvailable", "description", "id", "isAvailable", "name", "ownerId", "price", "rented", "rentedAt", "rentedById", "rentedUntil", "rooms", "updatedAt") SELECT "address", "bathrooms", "createdAt", "dateAvailable", "description", "id", "isAvailable", "name", "ownerId", "price", "rented", "rentedAt", "rentedById", "rentedUntil", "rooms", "updatedAt" FROM "House";
DROP TABLE "House";
ALTER TABLE "new_House" RENAME TO "House";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
