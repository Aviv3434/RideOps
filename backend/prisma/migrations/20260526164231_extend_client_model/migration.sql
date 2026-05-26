-- Add new client fields safely

ALTER TABLE "clients"
ADD COLUMN IF NOT EXISTS "externalCode" TEXT,
ADD COLUMN IF NOT EXISTS "primaryPhone" TEXT,
ADD COLUMN IF NOT EXISTS "secondaryPhone" TEXT,
ADD COLUMN IF NOT EXISTS "mobilePhone" TEXT,
ADD COLUMN IF NOT EXISTS "institutionAddress" TEXT,
ADD COLUMN IF NOT EXISTS "notes" TEXT,
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;

-- Make sure existing isActive values are valid

UPDATE "clients"
SET "isActive" = true
WHERE "isActive" IS NULL;

ALTER TABLE "clients"
ALTER COLUMN "isActive" SET DEFAULT true;

ALTER TABLE "clients"
ALTER COLUMN "isActive" SET NOT NULL;

-- Backfill externalCode for existing clients

WITH numbered_clients AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "transportationCompanyId"
      ORDER BY "createdAt", "id"
    ) AS row_number
  FROM "clients"
  WHERE "externalCode" IS NULL
)
UPDATE "clients"
SET "externalCode" = 'LEGACY-' || numbered_clients.row_number
FROM numbered_clients
WHERE "clients"."id" = numbered_clients."id";

-- Now externalCode can safely become required

ALTER TABLE "clients"
ALTER COLUMN "externalCode" SET NOT NULL;

-- Remove old client contact fields if they exist

ALTER TABLE "clients"
DROP COLUMN IF EXISTS "contactName",
DROP COLUMN IF EXISTS "contactEmail",
DROP COLUMN IF EXISTS "contactPhone";

-- Indexes

CREATE UNIQUE INDEX IF NOT EXISTS "clients_transportationCompanyId_externalCode_key"
ON "clients"("transportationCompanyId", "externalCode");

CREATE INDEX IF NOT EXISTS "clients_transportationCompanyId_idx"
ON "clients"("transportationCompanyId");

CREATE INDEX IF NOT EXISTS "clients_externalCode_idx"
ON "clients"("externalCode");

CREATE INDEX IF NOT EXISTS "clients_isActive_idx"
ON "clients"("isActive");