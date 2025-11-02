-- ============================================================================
-- FIX PROPERTIES CUSTOMER FOREIGN KEY
-- ============================================================================
-- Migration: 20250131000005_fix_properties_customer_foreign_key
-- Description: Fix incorrect foreign key on properties.customer_id (should point to customers, not users)
-- Author: Claude Code (AI Assistant)
-- Date: 2025-01-31
-- ============================================================================

-- Drop the incorrect foreign key constraint
ALTER TABLE properties
DROP CONSTRAINT IF EXISTS properties_customer_id_users_id_fk;

-- Add the correct foreign key constraint pointing to customers table
ALTER TABLE properties
ADD CONSTRAINT properties_customer_id_customers_id_fk
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE CASCADE;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
