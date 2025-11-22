-- Add default email domain configuration to companies table
-- This allows companies to receive all emails to their configured domain
-- without needing to create specific inbound routes for each address

ALTER TABLE companies 
  ADD COLUMN IF NOT EXISTS email_domain TEXT,
  ADD COLUMN IF NOT EXISTS email_receive_all BOOLEAN DEFAULT true;

-- Create index for quick domain lookups during webhook processing
CREATE INDEX IF NOT EXISTS idx_companies_email_domain 
  ON companies(email_domain) WHERE email_domain IS NOT NULL;

-- Add helpful comments for documentation
COMMENT ON COLUMN companies.email_domain IS 'Primary email domain for receiving emails (e.g., biezru.resend.app). All emails to addresses @this-domain will be routed to this company.';
COMMENT ON COLUMN companies.email_receive_all IS 'Whether to receive all emails to the email_domain regardless of specific inbound routes. When true, acts as a catch-all for the domain.';

-- Update existing companies to use the default Resend domain
-- This is based on the domain seen in the codebase
UPDATE companies 
SET email_domain = 'biezru.resend.app'
WHERE email_domain IS NULL;
