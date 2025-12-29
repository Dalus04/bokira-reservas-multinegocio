/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,reason]` on the table `LoyaltyEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyEvent_bookingId_reason_key" ON "LoyaltyEvent"("bookingId", "reason");
