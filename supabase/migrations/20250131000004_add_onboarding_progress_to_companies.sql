-- Add onboarding_progress JSONB column to companies table
-- This stores progress for all onboarding steps (team members, phone number, notifications, etc.)

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{}'::jsonb;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_companies_onboarding_progress ON companies USING GIN (onboarding_progress);

-- Add comment
COMMENT ON COLUMN companies.onboarding_progress IS 'Stores onboarding progress data: { step: number, teamMembers: [], phoneNumber: {}, notifications: {}, etc. }';

