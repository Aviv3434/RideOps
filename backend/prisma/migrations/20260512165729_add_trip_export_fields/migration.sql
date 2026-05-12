-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "exportedAt" TIMESTAMP(3),
ADD COLUMN     "isExported" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "trips_isExported_idx" ON "trips"("isExported");
