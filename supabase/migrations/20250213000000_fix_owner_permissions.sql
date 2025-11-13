-- ============================================================================
-- Fix Owner Permissions - Owners in Team Members Get Full Access
-- ============================================================================
-- 
-- This migration fixes authorization functions to ensure company owners
-- ALWAYS have full access by checking if team_member IS the owner.
--
-- Key changes:
-- 1. All functions join team_members with companies
-- 2. Check if team_member.user_id = companies.owner_id
-- 3. If yes, grant full permissions/roles
-- 4. If no, apply normal role-based permissions
--
-- Architecture: Owners MUST be in team_members, but get elevated privileges
--
-- Date: 2025-02-13
-- ============================================================================

-- Function to check if user has a specific role in a company
-- FIXED: Checks if team member IS the owner
CREATE OR REPLACE FUNCTION has_role(user_uuid UUID, required_role user_role, company_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  -- Check if this team member IS the company owner
  SELECT (c.owner_id = user_uuid) INTO is_owner
  FROM team_members tm
  JOIN companies c ON c.id = tm.company_id
  WHERE tm.user_id = user_uuid
  AND tm.company_id = company_uuid
  AND tm.status = 'active'
  LIMIT 1;

  -- Owners are considered to have ALL roles
  IF is_owner THEN
    RETURN TRUE;
  END IF;

  -- Regular members: Check their actual role
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = user_uuid
    AND company_id = company_uuid
    AND role = required_role
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_role IS 'Check if user has a specific role. Team members who ARE the company owner automatically have all roles.';

-- Function to check if user has ANY of the specified roles
-- FIXED: Checks if team member IS the owner
CREATE OR REPLACE FUNCTION has_any_role(user_uuid UUID, required_roles user_role[], company_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  -- Check if this team member IS the company owner
  SELECT (c.owner_id = user_uuid) INTO is_owner
  FROM team_members tm
  JOIN companies c ON c.id = tm.company_id
  WHERE tm.user_id = user_uuid
  AND tm.company_id = company_uuid
  AND tm.status = 'active'
  LIMIT 1;

  -- Owners are considered to have ALL roles
  IF is_owner THEN
    RETURN TRUE;
  END IF;

  -- Regular members: Check their actual roles
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = user_uuid
    AND company_id = company_uuid
    AND role = ANY(required_roles)
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_any_role IS 'Check if user has any of the specified roles. Team members who ARE the company owner automatically have all roles.';

-- Function to get user's role in a company
-- FIXED: Returns 'owner' if team member IS the company owner
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID, company_uuid UUID)
RETURNS user_role AS $$
DECLARE
  is_owner BOOLEAN;
  user_role_val user_role;
BEGIN
  -- Get team member's role and check if they're the owner
  SELECT 
    tm.role,
    (c.owner_id = user_uuid)
  INTO user_role_val, is_owner
  FROM team_members tm
  JOIN companies c ON c.id = tm.company_id
  WHERE tm.user_id = user_uuid
  AND tm.company_id = company_uuid
  AND tm.status = 'active'
  LIMIT 1;

  -- If this team member IS the owner, return 'owner' role
  IF is_owner THEN
    RETURN 'owner';
  END IF;

  -- Otherwise return their actual role
  RETURN user_role_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_user_role IS 'Get user role. Returns owner if team member IS the company owner.';

-- Function to check if user has a specific permission
-- FIXED: Checks if team member IS the owner
CREATE OR REPLACE FUNCTION has_permission(user_uuid UUID, permission_key TEXT, company_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_permissions JSONB;
  user_role_val user_role;
  is_owner BOOLEAN;
BEGIN
  -- Get team member's permissions, role, and check if they're the owner
  SELECT 
    tm.permissions,
    tm.role,
    (c.owner_id = user_uuid)
  INTO user_permissions, user_role_val, is_owner
  FROM team_members tm
  JOIN companies c ON c.id = tm.company_id
  WHERE tm.user_id = user_uuid
  AND tm.company_id = company_uuid
  AND tm.status = 'active'
  LIMIT 1;

  -- If no team member found, no permission
  IF user_role_val IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Team members who ARE the owner have ALL permissions
  IF is_owner THEN
    RETURN TRUE;
  END IF;

  -- Admin has all permissions
  IF user_role_val = 'admin' THEN
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
    WHEN 'approve_estimates' THEN user_role_val IN ('manager', 'admin')
    WHEN 'handle_escalations' THEN user_role_val IN ('manager', 'admin')

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

    -- Delete permissions
    WHEN 'delete_jobs' THEN user_role_val IN ('manager', 'admin')
    WHEN 'delete_customers' THEN user_role_val IN ('manager', 'admin')
    WHEN 'delete_team_members' THEN user_role_val = 'admin'

    ELSE FALSE
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_permission IS 'Check if user has a specific permission. Team members who ARE the company owner automatically have all permissions.';

-- ============================================================================
-- Helper Function: Check if user has ANY access to a company
-- ============================================================================
-- This checks if user is an active team member (which includes owners)

CREATE OR REPLACE FUNCTION has_company_access(user_uuid UUID, company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is an active team member (includes owners)
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = user_uuid
    AND company_id = company_uuid
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION has_company_access IS 'Check if user has access to a company (is an active team member)';

-- ============================================================================
-- Grant execute permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION has_role(UUID, user_role, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_any_role(UUID, user_role[], UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_permission(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_company_access(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_company_owner(UUID, UUID) TO authenticated;

