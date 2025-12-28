-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NotificationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'EMAIL',
    "audience" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sendAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "readAt" DATETIME,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NotificationJob_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NotificationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NotificationJob" ("attempts", "bookingId", "channel", "createdAt", "id", "lastError", "readAt", "sendAt", "status", "type", "updatedAt", "userId") SELECT "attempts", "bookingId", "channel", "createdAt", "id", "lastError", "readAt", "sendAt", "status", "type", "updatedAt", "userId" FROM "NotificationJob";
DROP TABLE "NotificationJob";
ALTER TABLE "new_NotificationJob" RENAME TO "NotificationJob";
CREATE INDEX "NotificationJob_status_sendAt_idx" ON "NotificationJob"("status", "sendAt");
CREATE INDEX "NotificationJob_userId_idx" ON "NotificationJob"("userId");
CREATE UNIQUE INDEX "NotificationJob_type_bookingId_channel_audience_key" ON "NotificationJob"("type", "bookingId", "channel", "audience");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
