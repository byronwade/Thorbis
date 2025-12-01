-- ============================================================================
-- FIX ALL CUSTOMER FOREIGN KEYS
-- ============================================================================
-- Migration: 20250131000006_fix_all_customer_foreign_keys
-- Description: Fix incorrect foreign keys that point to users instead of customers
-- Author: Claude Code (AI Assistant)
-- Date: 2025-01-31
--
-- This fixes foreign keys in:
-- - estimates.customer_id
-- - invoices.customer_id
-- ============================================================================

-- Fix estimates.customer_id
ALTER TABLE estimates
DROP CONSTRAINT IF EXISTS estimates_customer_id_users_id_fk;

ALTER TABLE estimates
ADD CONSTRAINT estimates_customer_id_customers_id_fk
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE SET NULL;

-- Fix invoices.customer_id
ALTER TABLE invoices
DROP CONSTRAINT IF EXISTS invoices_customer_id_users_id_fk;

ALTER TABLE invoices
ADD CONSTRAINT invoices_customer_id_customers_id_fk
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON DELETE SET NULL;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
