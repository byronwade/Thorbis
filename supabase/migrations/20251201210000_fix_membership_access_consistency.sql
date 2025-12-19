-- ============================================================================
-- FIX MEMBERSHIP ACCESS CONSISTENCY
-- ============================================================================
-- Created: 2025-12-01
-- Purpose: Ensure team_members table is properly populated with role for RLS
--
-- Issues Fixed:
-- 1. Trigger handle_new_company_owner() doesn't set role (RLS checks role)
-- 2. Existing team_members records may have NULL role
-- 3. Ensure company owners always have 'owner' role for RLS policies
-- ============================================================================

-- ============================================================================
-- 1. FIX EXISTING DATA - Set role='owner' for company owners
-- ============================================================================

-- Update existing team_members records for company owners who have NULL role
UPDATE team_members tm
SET role = 'owner'::user_role
FROM companies c
WHERE tm.user_id = c.owner_id
  AND tm.company_id = c.id
  AND (tm.role IS NULL OR tm.role != 'owner'::user_role);

-- ============================================================================
-- 2. UPDATE TRIGGER TO SET ROLE
-- ============================================================================

-- Drop and recreate the trigger function with proper role assignment
CREATE OR REPLACE FUNCTION handle_new_company_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Create team_members record for the company owner with proper role
  INSERT INTO team_members (user_id, company_id, status, role, job_title, joined_at)
  VALUES (NEW.owner_id, NEW.id, 'active', 'owner'::user_role, 'Owner', NOW())
  ON CONFLICT (user_id, company_id) DO UPDATE SET
    role = 'owner'::user_role,
    status = 'active';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. UPDATE ensure_owner_team_member FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION ensure_owner_team_member()
RETURNS void AS $$
BEGIN
  -- Insert team_members records for company owners who don't have one
  INSERT INTO team_members (user_id, company_id, status, role, job_title, joined_at)
  SELECT
    c.owner_id,
    c.id,
    'active',
    'owner'::user_role,
    'Owner',
    NOW()
  FROM companies c
  WHERE c.owner_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.user_id = c.owner_id AND tm.company_id = c.id
    )
  ON CONFLICT (user_id, company_id) DO UPDATE SET
    role = 'owner'::user_role,
    status = 'active';

  -- Ensure active status and owner role for company owners
  UPDATE team_members tm
  SET status = 'active',
      role = 'owner'::user_role
  FROM companies c
  WHERE tm.user_id = c.owner_id
    AND tm.company_id = c.id
    AND (tm.status IS NULL OR tm.status != 'active' OR tm.role IS NULL OR tm.role != 'owner'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to fix any existing issues
SELECT ensure_owner_team_member();

-- ============================================================================
-- 4. VERIFY RLS FUNCTIONS USE CORRECT TABLE
-- ============================================================================

-- The RLS functions in 20251120000001_optimize_rls_policies.sql already use
-- team_members table which is correct. Verify the functions exist:

-- get_user_company_ids() - Returns company IDs where user is a team member
-- is_company_owner() - Checks companies.owner_id
-- is_company_admin() - Checks team_members.role IN ('owner', 'admin')
-- get_user_company_role() - Returns role from team_members

-- ============================================================================
-- 5. ADD INDEX FOR ROLE-BASED LOOKUPS
-- ============================================================================

-- Create index for role-based RLS lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_team_members_role_company_user
  ON team_members(company_id, user_id, role)
  WHERE status = 'active' AND archived_at IS NULL;

-- ============================================================================
-- 6. ADD COMMENTS
-- ============================================================================

COMMENT ON FUNCTION handle_new_company_owner() IS
'Automatically creates team_members record with owner role for new company owners';

COMMENT ON FUNCTION ensure_owner_team_member() IS
'Ensures all company owners have team_members records with correct role and status';

-- ============================================================================
-- VERIFICATION QUERY (run manually to verify)
-- ============================================================================
-- SELECT c.id as company_id, c.name, c.owner_id,
--        tm.id as tm_id, tm.role, tm.status
-- FROM companies c
-- LEFT JOIN team_members tm ON tm.company_id = c.id AND tm.user_id = c.owner_id
-- WHERE c.deleted_at IS NULL
-- ORDER BY c.created_at DESC;
