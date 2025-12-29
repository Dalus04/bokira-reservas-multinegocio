-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "completedAt" DATETIME;

-- CreateIndex
CREATE INDEX "Booking_businessId_completedAt_idx" ON "Booking"("businessId", "completedAt");
