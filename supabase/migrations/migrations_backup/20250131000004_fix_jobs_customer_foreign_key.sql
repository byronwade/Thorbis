-- ============================================================================
-- FIX JOBS CUSTOMER FOREIGN KEY
-- ============================================================================
-- Migration: 20250131000004_fix_jobs_customer_foreign_key
-- Description: Fix incorrect foreign key on jobs.customer_id (should point to customers, not users)
-- Author: Claude Code (AI Assistant)
-- Date: 2025-01-31
--
-- Issue: The jobs.customer_id foreign key incorrectly points to users.id
-- Fix: Drop the incorrect constraint and add correct one pointing to customers.id
-- ============================================================================

-- Drop the incorrect foreign key constraint
ALTER TABLE jobs
DROP CONSTRAINT IF EXISTS jobs_customer_id_users_id_fk;

-- Add the correct foreign key constraint pointing to customers table
ALTER TABLE jobs
ADD CONSTRAINT jobs_customer_id_customers_id_fk
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE SET NULL;

-- Verify the fix by checking all foreign keys on jobs table
-- Run this query manually to verify:
-- SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS foreign_table
-- FROM pg_constraint
-- WHERE conrelid = 'jobs'::regclass AND contype = 'f';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
