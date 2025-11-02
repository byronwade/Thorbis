-- Add onboarding fields to companies table
-- These fields are collected during the welcome onboarding flow

-- Add industry field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Add company size field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS company_size TEXT;

-- Add phone field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add address field
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add created_by field to track who created the company
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add onboarding_completed field to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add active_company_id field to profiles table if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS active_company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);
CREATE INDEX IF NOT EXISTS idx_profiles_active_company ON profiles(active_company_id);

-- Add comment to document these fields
COMMENT ON COLUMN companies.industry IS 'Business industry (HVAC, Plumbing, Electrical, etc.)';
COMMENT ON COLUMN companies.company_size IS 'Number of employees (1-5, 6-10, etc.)';
COMMENT ON COLUMN companies.phone IS 'Business phone number';
COMMENT ON COLUMN companies.address IS 'Business address';
COMMENT ON COLUMN companies.created_by IS 'User who created this company';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether user has completed onboarding';
COMMENT ON COLUMN profiles.active_company_id IS 'Currently active company for this user';
