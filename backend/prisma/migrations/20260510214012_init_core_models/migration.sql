/*
  Warnings:

  - The values [CUSTOMER_USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `export_batch_trips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `export_batches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trips` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('COMPANY_ADMIN', 'CLIENT_USER');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_transportationCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "export_batch_trips" DROP CONSTRAINT "export_batch_trips_exportBatchId_fkey";

-- DropForeignKey
ALTER TABLE "export_batch_trips" DROP CONSTRAINT "export_batch_trips_tripId_fkey";

-- DropForeignKey
ALTER TABLE "export_batches" DROP CONSTRAINT "export_batches_exportedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "export_batches" DROP CONSTRAINT "export_batches_transportationCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_approvedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_customerId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_rejectedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "trips" DROP CONSTRAINT "trips_transportationCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_customerId_fkey";

-- DropIndex
DROP INDEX "users_customerId_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "customerId",
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "export_batch_trips";

-- DropTable
DROP TABLE "export_batches";

-- DropTable
DROP TABLE "trips";

-- DropEnum
DROP TYPE "TripStatus";

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "transportationCompanyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_transportationCompanyId_idx" ON "clients"("transportationCompanyId");

-- CreateIndex
CREATE INDEX "users_clientId_idx" ON "users"("clientId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_transportationCompanyId_fkey" FOREIGN KEY ("transportationCompanyId") REFERENCES "transportation_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
