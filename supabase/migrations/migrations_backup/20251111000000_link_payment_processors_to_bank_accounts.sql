-- ============================================================================
-- LINK PAYMENT PROCESSORS TO BANK ACCOUNTS
-- ============================================================================
-- Migration: 20251111000000_link_payment_processors_to_bank_accounts
-- Description: Adds bank_account_id field to company_payment_processors to
--              link payment processors to specific bank accounts for deposits
-- Date: 2025-11-11
-- ============================================================================

-- Add bank_account_id column to company_payment_processors
ALTER TABLE company_payment_processors
ADD COLUMN IF NOT EXISTS bank_account_id UUID REFERENCES finance_bank_accounts(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_payment_processors_bank_account_id 
ON company_payment_processors(bank_account_id);

-- Add comment explaining the field
COMMENT ON COLUMN company_payment_processors.bank_account_id IS 
'Bank account where payments processed by this processor will be deposited. If NULL, uses the primary bank account for the company.';

