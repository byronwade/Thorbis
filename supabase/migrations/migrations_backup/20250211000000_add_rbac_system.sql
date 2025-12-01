-- ============================================================================
-- RBAC (Role-Based Access Control) SYSTEM MIGRATION
-- ============================================================================
-- Migration: 20250211000000_add_rbac_system
-- Description: Adds comprehensive role-based access control system
-- Author: Claude Code (AI Assistant)
-- Date: 2025-02-11
--
-- This migration adds:
-- - Role ENUM with predefined roles (owner, manager, dispatcher, technician, csr, admin)
-- - role column to team_members table
-- - permissions JSONB column for fine-grained permissions
-- - Helper functions for permission checks
-- - Updated RLS policies that respect roles
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE ROLE ENUM
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'manager',
  'dispatcher',
  'technician',
  'csr'
);

COMMENT ON TYPE user_role IS 'User roles for role-based access control (RBAC)';

-- ============================================================================
-- SECTION 2: ADD ROLE COLUMN TO TEAM_MEMBERS
-- ============================================================================

-- Add role column (defaults to 'technician' for safety)
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'technician';

-- Add permissions column for fine-grained control
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;

-- Add department and title for organization
ALTER TABLE team_members
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_company_role ON team_members(company_id, role);

-- Add comments
COMMENT ON COLUMN team_members.role IS 'User role: owner, admin, manager, dispatcher, technician, or csr';
COMMENT ON COLUMN team_members.permissions IS 'Custom permissions JSON: {"can_delete_jobs": true, "can_approve_estimates": true}';
COMMENT ON COLUMN team_members.department IS 'Department name (e.g., "HVAC", "Plumbing", "Sales")';
COMMENT ON COLUMN team_members.job_title IS 'Job title (e.g., "Senior Technician", "Dispatch Manager")';

-- ============================================================================
-- SECTION 3: CREATE PERMISSION HELPER FUNCTIONS
-- ============================================================================

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION has_role(user_uuid UUID, required_role user_role, company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = user_uuid
    AND company_id = company_uuid
    AND role = required_role
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_role IS 'Check if user has a specific role in a company';

-- Function to check if user has ANY of the specified roles
CREATE OR REPLACE FUNCTION has_any_role(user_uuid UUID, required_roles user_role[], company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = user_uuid
    AND company_id = company_uuid
    AND role = ANY(required_roles)
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_any_role IS 'Check if user has any of the specified roles in a company';

-- Function to get user's role in a company
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID, company_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM team_members
  WHERE user_id = user_uuid
  AND company_id = company_uuid
  AND status = 'active'
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_user_role IS 'Get user role in a specific company';

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(user_uuid UUID, permission_key TEXT, company_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
  user_role_val user_role;
BEGIN
  -- Get user's custom permissions and role
  SELECT permissions, role INTO user_permissions, user_role_val
  FROM team_members
  WHERE user_id = user_uuid
  AND company_id = company_uuid
  AND status = 'active'
  LIMIT 1;

  -- If no team member found, no permission
  IF user_role_val IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Owner and Admin have all permissions
  IF user_role_val IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Check custom permissions JSON
  IF user_permissions ? permission_key THEN
    RETURN (user_permissions->permission_key)::boolean;
  END IF;

  -- Default role-based permissions
  RETURN CASE permission_key
    -- Manager permissions
    WHEN 'view_reports' THEN user_role_val IN ('manager', 'dispatcher')
    WHEN 'manage_team' THEN user_role_val = 'manager'
    WHEN 'approve_estimates' THEN user_role_val IN ('manager', 'owner', 'admin')
    WHEN 'handle_escalations' THEN user_role_val IN ('manager', 'owner', 'admin')

    -- Dispatcher permissions
    WHEN 'dispatch_jobs' THEN user_role_val IN ('dispatcher', 'manager')
    WHEN 'manage_schedule' THEN user_role_val IN ('dispatcher', 'manager')
    WHEN 'view_tech_locations' THEN user_role_val IN ('dispatcher', 'manager')

    -- Technician permissions
    WHEN 'update_job_status' THEN user_role_val IN ('technician', 'dispatcher', 'manager')
    WHEN 'create_invoices' THEN user_role_val IN ('technician', 'csr', 'manager')
    WHEN 'upload_photos' THEN user_role_val IN ('technician', 'manager')

    -- CSR permissions
    WHEN 'create_jobs' THEN user_role_val IN ('csr', 'dispatcher', 'manager')
    WHEN 'schedule_appointments' THEN user_role_val IN ('csr', 'dispatcher', 'manager')
    WHEN 'send_communications' THEN user_role_val IN ('csr', 'dispatcher', 'manager')

    -- View permissions (most roles can view)
    WHEN 'view_customers' THEN user_role_val IS NOT NULL
    WHEN 'view_jobs' THEN user_role_val IS NOT NULL
    WHEN 'view_schedule' THEN user_role_val IS NOT NULL

    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_permission IS 'Check if user has a specific permission (custom or role-based)';

-- Function to check if user is company owner
CREATE OR REPLACE FUNCTION is_company_owner(user_uuid UUID, company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM companies
    WHERE id = company_uuid
    AND owner_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_company_owner IS 'Check if user is the company owner';

-- ============================================================================
-- SECTION 4: UPDATE EXISTING RLS POLICIES FOR ROLE-BASED ACCESS
-- ============================================================================

-- Drop and recreate job management policies with role checks
DROP POLICY IF EXISTS "Company members can create jobs" ON jobs;
CREATE POLICY "Company members can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager', 'dispatcher', 'csr']::user_role[],
      company_id
    )
  );

DROP POLICY IF EXISTS "Company members can update jobs" ON jobs;
CREATE POLICY "Company members can update jobs"
  ON jobs FOR UPDATE
  USING (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager', 'dispatcher', 'technician', 'csr']::user_role[],
      company_id
    )
  );

DROP POLICY IF EXISTS "Company members can delete jobs" ON jobs;
CREATE POLICY "Company members can delete jobs"
  ON jobs FOR DELETE
  USING (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager']::user_role[],
      company_id
    )
  );

-- Customer management - CSR, Manager, Owner can manage
DROP POLICY IF EXISTS "Company members can create customers" ON customers;
CREATE POLICY "Company members can create customers"
  ON customers FOR INSERT
  WITH CHECK (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager', 'csr']::user_role[],
      company_id
    )
  );

DROP POLICY IF EXISTS "Company members can update customers" ON customers;
CREATE POLICY "Company members can update customers"
  ON customers FOR UPDATE
  USING (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager', 'csr']::user_role[],
      company_id
    )
  );

DROP POLICY IF EXISTS "Company members can delete customers" ON customers;
CREATE POLICY "Company members can delete customers"
  ON customers FOR DELETE
  USING (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager']::user_role[],
      company_id
    )
  );

-- Schedule management - Dispatcher, Manager can manage
DROP POLICY IF EXISTS "Company members can manage schedules" ON schedules;
CREATE POLICY "Company members can manage schedules"
  ON schedules FOR ALL
  USING (
    has_any_role(
      auth.uid(),
      ARRAY['owner', 'admin', 'manager', 'dispatcher']::user_role[],
      company_id
    )
  );

-- Technicians can view their own schedules
CREATE POLICY "Technicians can view their schedules"
  ON schedules FOR SELECT
  USING (
    assigned_to = auth.uid() AND
    has_role(auth.uid(), 'technician'::user_role, company_id)
  );

-- Team member management - Only owners and admins can add/remove
DROP POLICY IF EXISTS "Company owners can manage team" ON team_members;
CREATE POLICY "Company owners can manage team"
  ON team_members FOR ALL
  USING (
    is_company_owner(auth.uid(), company_id) OR
    has_role(auth.uid(), 'admin'::user_role, company_id)
  );

-- ============================================================================
-- SECTION 5: DATA MIGRATION - SET INITIAL ROLES
-- ============================================================================

-- Set company owners to 'owner' role
UPDATE team_members tm
SET role = 'owner'::user_role
FROM companies c
WHERE tm.company_id = c.id
  AND tm.user_id = c.owner_id
  AND tm.role IS NULL OR tm.role = 'technician';

-- Set a default role for any existing team members without a role
UPDATE team_members
SET role = 'technician'::user_role
WHERE role IS NULL;

-- ============================================================================
-- SECTION 6: ADD CONSTRAINTS
-- ============================================================================

-- Ensure role is always set
ALTER TABLE team_members
ALTER COLUMN role SET NOT NULL;

-- Ensure only one owner per company (company table already has owner_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_owner_per_company
ON team_members (company_id)
WHERE role = 'owner';

COMMENT ON INDEX idx_one_owner_per_company IS 'Ensures only one owner role per company';

-- ============================================================================
-- SECTION 7: CREATE VIEWS FOR ROLE STATISTICS
-- ============================================================================

-- View to see role distribution by company
CREATE OR REPLACE VIEW company_role_stats AS
SELECT
  company_id,
  role,
  COUNT(*) as member_count,
  COUNT(*) FILTER (WHERE status = 'active') as active_count
FROM team_members
GROUP BY company_id, role;

COMMENT ON VIEW company_role_stats IS 'Statistics of roles per company';

-- Grant access to authenticated users
GRANT SELECT ON company_role_stats TO authenticated;

-- ============================================================================
-- SECTION 8: AUDIT LOGGING (Optional but recommended)
-- ============================================================================

-- Add audit log for role changes
CREATE TABLE IF NOT EXISTS role_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES users(id),
  old_role user_role,
  new_role user_role NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_change_log_team_member ON role_change_log(team_member_id);
CREATE INDEX IF NOT EXISTS idx_role_change_log_created_at ON role_change_log(created_at DESC);

COMMENT ON TABLE role_change_log IS 'Audit log for role changes';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
