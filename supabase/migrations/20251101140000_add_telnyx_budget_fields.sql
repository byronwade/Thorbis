-- Add Telnyx budget management fields to companies table
-- Migration: 20251101140000_add_telnyx_budget_fields

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS telnyx_budget_limit DECIMAL(10, 2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS telnyx_budget_alert_threshold INTEGER DEFAULT 80;

-- Add comments for documentation
COMMENT ON COLUMN public.companies.telnyx_budget_limit IS 'Monthly budget limit for Telnyx services in USD';
COMMENT ON COLUMN public.companies.telnyx_budget_alert_threshold IS 'Alert threshold percentage (e.g., 80 means alert at 80% of budget)';
