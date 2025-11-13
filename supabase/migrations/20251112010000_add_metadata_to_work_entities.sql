-- ============================================================================
-- Add metadata JSONB columns for core work entities to support tagging
-- Migration: 20251112010000_add_metadata_to_work_entities.sql
-- ============================================================================

BEGIN;

-- Jobs ----------------------------------------------------------------------
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{"tags": []}'::jsonb;
ALTER TABLE jobs
  ALTER COLUMN metadata SET DEFAULT '{"tags": []}'::jsonb;
UPDATE jobs
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{tags}',
    COALESCE(metadata->'tags', '[]'::jsonb),
    true
  );

-- Properties ----------------------------------------------------------------
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{"tags": []}'::jsonb;
ALTER TABLE properties
  ALTER COLUMN metadata SET DEFAULT '{"tags": []}'::jsonb;
UPDATE properties
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{tags}',
    COALESCE(metadata->'tags', '[]'::jsonb),
    true
  );

-- Estimates -----------------------------------------------------------------
ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{"tags": []}'::jsonb;
ALTER TABLE estimates
  ALTER COLUMN metadata SET DEFAULT '{"tags": []}'::jsonb;
UPDATE estimates
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{tags}',
    COALESCE(metadata->'tags', '[]'::jsonb),
    true
  );

-- Invoices ------------------------------------------------------------------
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{"tags": []}'::jsonb;
ALTER TABLE invoices
  ALTER COLUMN metadata SET DEFAULT '{"tags": []}'::jsonb;
UPDATE invoices
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{tags}',
    COALESCE(metadata->'tags', '[]'::jsonb),
    true
  );

-- Job Materials -------------------------------------------------------------
ALTER TABLE job_materials
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{"tags": []}'::jsonb;
ALTER TABLE job_materials
  ALTER COLUMN metadata SET DEFAULT '{"tags": []}'::jsonb;
UPDATE job_materials
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{tags}',
    COALESCE(metadata->'tags', '[]'::jsonb),
    true
  );

COMMIT;

