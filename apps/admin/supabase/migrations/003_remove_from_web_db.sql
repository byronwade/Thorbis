-- ============================================================================
-- REMOVE ADMIN TABLES FROM WEB DATABASE
-- ============================================================================
-- Run this in the WEB Supabase project (togejqdwggezkxahomeh)
-- ONLY run this AFTER verifying the admin database is working correctly!
-- ============================================================================

-- WARNING: This will permanently delete data! Ensure you have migrated any
-- existing campaign data to the admin database before running this.

-- Drop email campaign tables (now in admin database)
DROP TABLE IF EXISTS email_campaign_links CASCADE;
DROP TABLE IF EXISTS email_campaign_sends CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS email_suppressions CASCADE;

-- Note: The following tables should REMAIN in the web database:
-- - companies (customer businesses)
-- - users (via Supabase Auth)
-- - team_members
-- - customers
-- - jobs, invoices, estimates, etc.
-- - All other business data

-- The admin app will access this data via READ-ONLY service role connection
