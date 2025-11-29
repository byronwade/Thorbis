-- ============================================================================
-- ADD SENDGRID DOMAIN ID TO COMPANY EMAIL DOMAINS
-- Created: 2025-01-31
-- Purpose: Support SendGrid domain authentication alongside Resend
-- ============================================================================

-- Add sendgrid_domain_id column to company_email_domains table
ALTER TABLE company_email_domains
  ADD COLUMN IF NOT EXISTS sendgrid_domain_id TEXT;

-- Add index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_company_email_domains_sendgrid_domain_id 
  ON company_email_domains(sendgrid_domain_id) 
  WHERE sendgrid_domain_id IS NOT NULL;

-- Add helpful comment
COMMENT ON COLUMN company_email_domains.sendgrid_domain_id IS 'SendGrid domain ID for domain authentication. Used when company uses SendGrid as email provider.';


