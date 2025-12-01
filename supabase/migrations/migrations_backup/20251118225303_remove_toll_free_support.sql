-- Remove toll-free number type support
-- Company policy: Local 10DLC numbers only

-- 1. Delete any existing toll-free numbers
DELETE FROM phone_numbers WHERE number_type = 'toll-free';

-- 2. Remove toll-free from number_type enum
-- Note: PostgreSQL doesn't support removing enum values directly
-- So we'll add a CHECK constraint instead
ALTER TABLE phone_numbers 
  DROP CONSTRAINT IF EXISTS check_local_only;

ALTER TABLE phone_numbers
  ADD CONSTRAINT check_local_only 
  CHECK (number_type = 'local');

-- 3. Remove toll-free verification columns from company_telnyx_settings
ALTER TABLE company_telnyx_settings
  DROP COLUMN IF EXISTS toll_free_verification_request_id CASCADE,
  DROP COLUMN IF EXISTS toll_free_verification_status CASCADE,
  DROP COLUMN IF EXISTS toll_free_verification_submitted_at CASCADE;

-- Add comment
COMMENT ON CONSTRAINT check_local_only ON phone_numbers IS 
  'Company policy: Only local 10DLC numbers are supported';
