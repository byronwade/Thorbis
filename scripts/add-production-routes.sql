-- Add inbound email routes to PRODUCTION database
-- This fixes the issue where webhooks return 200 OK but emails aren't inserted

-- First, find your company ID in production
-- Replace 'YOUR_COMPANY_ID' with the actual UUID

-- Option 1: If you know your company ID
INSERT INTO communication_email_inbound_routes 
  (company_id, route_address, name, enabled, status)
VALUES 
  -- Catch-all for all @biezru.resend.app emails
  ('YOUR_COMPANY_ID', '@biezru.resend.app', 'Catch-all for biezru.resend.app', true, 'active'),
  
  -- Specific addresses
  ('YOUR_COMPANY_ID', 'support@biezru.resend.app', 'Support inbox', true, 'active'),
  ('YOUR_COMPANY_ID', 'test@biezru.resend.app', 'Test inbox', true, 'active'),
  ('YOUR_COMPANY_ID', 'sales@biezru.resend.app', 'Sales inbox', true, 'active')
ON CONFLICT (route_address) DO NOTHING;

-- Option 2: If you need to find your company ID first
-- Run this query to see all companies:
SELECT id, name FROM companies ORDER BY created_at DESC;

-- Then use the ID in the INSERT above

-- Verify routes were created:
SELECT route_address, company_id, enabled, status 
FROM communication_email_inbound_routes 
WHERE route_address LIKE '%biezru.resend.app%'
ORDER BY created_at DESC;
