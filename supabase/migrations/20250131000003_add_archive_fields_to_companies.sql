-- Add archive fields to companies table
-- These fields enable soft delete/archive functionality for companies

-- Add deleted_at field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Add deleted_by field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add archived_at field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Add permanent_delete_scheduled_at field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS permanent_delete_scheduled_at TIMESTAMPTZ;

-- Add index for faster queries on archived companies
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_archived_at ON companies(archived_at) WHERE archived_at IS NOT NULL;

-- Add comments to document these fields
COMMENT ON COLUMN companies.deleted_at IS 'Timestamp when company was archived/deleted';
COMMENT ON COLUMN companies.deleted_by IS 'User who archived/deleted the company';
COMMENT ON COLUMN companies.archived_at IS 'Timestamp when company was archived';
COMMENT ON COLUMN companies.permanent_delete_scheduled_at IS 'Timestamp when company will be permanently deleted (90 days after archive)';

