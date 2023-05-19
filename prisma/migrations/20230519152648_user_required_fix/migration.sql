-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "username" TEXT,
    "avatarColor" TEXT,
    "setup" BOOLEAN NOT NULL,
    "description" TEXT
);
INSERT INTO "new_User" ("avatarColor", "createdAt", "description", "email", "id", "name", "phone", "setup", "updatedAt", "username") SELECT "avatarColor", "createdAt", "description", "email", "id", "name", "phone", "setup", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
