-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "tripNumber" INTEGER NOT NULL,
    "pickupDateTime" TIMESTAMP(3) NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "duplicateWarning" BOOLEAN NOT NULL DEFAULT false,
    "rejectionReason" TEXT,
    "createdByUserId" TEXT,
    "approvedByUserId" TEXT,
    "rejectedByUserId" TEXT,
    "cancelledByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trips_transportationCompanyId_idx" ON "trips"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "trips_clientId_idx" ON "trips"("clientId");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_pickupDateTime_idx" ON "trips"("pickupDateTime");

-- CreateIndex
CREATE INDEX "trips_duplicateWarning_idx" ON "trips"("duplicateWarning");

-- CreateIndex
CREATE UNIQUE INDEX "trips_transportationCompanyId_tripNumber_key" ON "trips"("transportationCompanyId", "tripNumber");

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_rejectedByUserId_fkey" FOREIGN KEY ("rejectedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_cancelledByUserId_fkey" FOREIGN KEY ("cancelledByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
