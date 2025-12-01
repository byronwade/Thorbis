-- Migration: Fix Missing Team Members for Company Owners
-- This migration ensures that all company owners have a corresponding team_members record

-- First, add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'team_members_user_company_unique'
  ) THEN
    ALTER TABLE team_members
    ADD CONSTRAINT team_members_user_company_unique
    UNIQUE (user_id, company_id);
  END IF;
END $$;

-- Function to ensure company owners have team_members records
CREATE OR REPLACE FUNCTION ensure_owner_team_member()
RETURNS void AS $$
BEGIN
  -- Insert team_members records for company owners who don't have one
  INSERT INTO team_members (user_id, company_id, status, job_title, joined_at)
  SELECT
    c.owner_id,
    c.id,
    'active',
    'Owner',
    NOW()
  FROM companies c
  WHERE NOT EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = c.owner_id AND tm.company_id = c.id
  )
  ON CONFLICT (user_id, company_id) DO NOTHING;

  -- Update existing team_members records that have NULL company_id but user is a company owner
  UPDATE team_members tm
  SET company_id = c.id,
      status = COALESCE(tm.status, 'active')
  FROM companies c
  WHERE tm.user_id = c.owner_id
    AND tm.company_id IS NULL;

  -- Ensure active status for company owners
  UPDATE team_members tm
  SET status = 'active'
  FROM companies c
  WHERE tm.user_id = c.owner_id
    AND tm.company_id = c.id
    AND (tm.status IS NULL OR tm.status != 'active');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to fix existing data
SELECT ensure_owner_team_member();

-- Create a trigger to automatically create team_members record when a company is created
CREATE OR REPLACE FUNCTION handle_new_company_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Create team_members record for the company owner
  INSERT INTO team_members (user_id, company_id, status, job_title, joined_at)
  VALUES (NEW.owner_id, NEW.id, 'active', 'Owner', NOW())
  ON CONFLICT (user_id, company_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_company_created ON companies;
CREATE TRIGGER on_company_created
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_company_owner();

-- Add helpful comment
COMMENT ON FUNCTION ensure_owner_team_member() IS 'Ensures all company owners have team_members records';
COMMENT ON FUNCTION handle_new_company_owner() IS 'Automatically creates team_members record for new company owners';
