-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('COMPANY_ADMIN', 'CUSTOMER_USER');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPORTED');

-- CreateTable
CREATE TABLE "transportation_companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transportation_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tripNumber" INTEGER NOT NULL,
    "pickupDateTime" TIMESTAMP(3) NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "rejectionReason" TEXT,
    "createdByUserId" TEXT,
    "approvedByUserId" TEXT,
    "rejectedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "isExported" BOOLEAN NOT NULL DEFAULT false,
    "exportedAt" TIMESTAMP(3),
    "duplicateWarning" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_batches" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "exportedByUserId" TEXT,
    "fileName" TEXT,
    "tripsCount" INTEGER NOT NULL,
    "dateFrom" TIMESTAMP(3),
    "dateTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_batch_trips" (
    "id" TEXT NOT NULL,
    "exportBatchId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "export_batch_trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_transportationCompanyId_idx" ON "customers"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "users_transportationCompanyId_idx" ON "users"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "users_customerId_idx" ON "users"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_transportationCompanyId_email_key" ON "users"("transportationCompanyId", "email");

-- CreateIndex
CREATE INDEX "trips_transportationCompanyId_idx" ON "trips"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "trips_customerId_idx" ON "trips"("customerId");

-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_pickupDateTime_idx" ON "trips"("pickupDateTime");

-- CreateIndex
CREATE INDEX "trips_isExported_idx" ON "trips"("isExported");

-- CreateIndex
CREATE UNIQUE INDEX "trips_transportationCompanyId_tripNumber_key" ON "trips"("transportationCompanyId", "tripNumber");

-- CreateIndex
CREATE INDEX "export_batches_transportationCompanyId_idx" ON "export_batches"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "export_batch_trips_tripId_idx" ON "export_batch_trips"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "export_batch_trips_exportBatchId_tripId_key" ON "export_batch_trips"("exportBatchId", "tripId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_rejectedByUserId_fkey" FOREIGN KEY ("rejectedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_batches" ADD CONSTRAINT "export_batches_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_batches" ADD CONSTRAINT "export_batches_exportedByUserId_fkey" FOREIGN KEY ("exportedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_batch_trips" ADD CONSTRAINT "export_batch_trips_exportBatchId_fkey" FOREIGN KEY ("exportBatchId") REFERENCES "export_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "export_batch_trips" ADD CONSTRAINT "export_batch_trips_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
