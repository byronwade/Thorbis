-- ============================================================================
-- OWNER PROTECTION MIGRATION
-- ============================================================================
-- Migration: 20250211000001_owner_protections
-- Description: Adds protections and constraints for company ownership
-- Author: Claude Code (AI Assistant)
-- Date: 2025-02-11
--
-- This migration adds:
-- - Ownership transfer function
-- - Owner deletion prevention
-- - Owner archived prevention
-- - Ownership transfer audit log
-- - Triggers to enforce owner existence
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE OWNERSHIP TRANSFER LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS ownership_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Transfer parties
  previous_owner_id UUID NOT NULL REFERENCES users(id),
  new_owner_id UUID NOT NULL REFERENCES users(id),
  initiated_by UUID NOT NULL REFERENCES users(id),

  -- Transfer details
  reason TEXT,
  password_verified BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  CONSTRAINT different_owners CHECK (previous_owner_id != new_owner_id)
);

CREATE INDEX IF NOT EXISTS idx_ownership_transfers_company ON ownership_transfers(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_previous_owner ON ownership_transfers(previous_owner_id);
CREATE INDEX IF NOT EXISTS idx_ownership_transfers_new_owner ON ownership_transfers(new_owner_id);

COMMENT ON TABLE ownership_transfers IS 'Audit log of company ownership transfers';

-- ============================================================================
-- SECTION 2: OWNER PROTECTION FUNCTIONS
-- ============================================================================

-- Function to check if user is the company owner
CREATE OR REPLACE FUNCTION is_owner_of_company(user_uuid UUID, company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM companies
    WHERE id = company_uuid
    AND owner_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION is_owner_of_company IS 'Check if user is the owner of a specific company';

-- Function to prevent owner team member deletion
CREATE OR REPLACE FUNCTION prevent_owner_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the team member being deleted is the company owner
  IF EXISTS (
    SELECT 1 FROM companies
    WHERE id = OLD.company_id
    AND owner_id = OLD.user_id
  ) THEN
    RAISE EXCEPTION 'Cannot delete company owner. Transfer ownership first.'
      USING ERRCODE = 'check_violation',
            HINT = 'Use the ownership transfer function to change ownership before removing this team member.';
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prevent owner deletion
DROP TRIGGER IF EXISTS prevent_owner_team_member_deletion ON team_members;
CREATE TRIGGER prevent_owner_team_member_deletion
  BEFORE DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION prevent_owner_deletion();

COMMENT ON TRIGGER prevent_owner_team_member_deletion ON team_members IS 'Prevents deletion of company owner team member';

-- Function to prevent owner archiving/status change
CREATE OR REPLACE FUNCTION prevent_owner_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the company owner
  IF EXISTS (
    SELECT 1 FROM companies
    WHERE id = NEW.company_id
    AND owner_id = NEW.user_id
  ) THEN
    -- Prevent status changes that aren't 'active'
    IF NEW.status != 'active' AND OLD.status = 'active' THEN
      RAISE EXCEPTION 'Cannot archive or deactivate company owner. Transfer ownership first.'
        USING ERRCODE = 'check_violation',
              HINT = 'Company owner must remain active. Transfer ownership to another user first.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to prevent owner status change
DROP TRIGGER IF EXISTS prevent_owner_team_member_status_change ON team_members;
CREATE TRIGGER prevent_owner_team_member_status_change
  BEFORE UPDATE OF status ON team_members
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION prevent_owner_status_change();

COMMENT ON TRIGGER prevent_owner_team_member_status_change ON team_members IS 'Prevents archiving or deactivating company owner';

-- ============================================================================
-- SECTION 3: OWNERSHIP TRANSFER FUNCTION
-- ============================================================================

-- Function to transfer company ownership
CREATE OR REPLACE FUNCTION transfer_company_ownership(
  p_company_id UUID,
  p_current_owner_id UUID,
  p_new_owner_id UUID,
  p_reason TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transfer_id UUID;
  v_current_company_owner_id UUID;
  v_new_owner_team_member_id UUID;
  v_old_owner_team_member_id UUID;
BEGIN
  -- Validate that current user is the actual owner
  SELECT owner_id INTO v_current_company_owner_id
  FROM companies
  WHERE id = p_company_id;

  IF v_current_company_owner_id IS NULL THEN
    RAISE EXCEPTION 'Company not found'
      USING ERRCODE = 'no_data_found';
  END IF;

  IF v_current_company_owner_id != p_current_owner_id THEN
    RAISE EXCEPTION 'Only the current owner can transfer ownership'
      USING ERRCODE = 'insufficient_privilege',
            HINT = 'Current user is not the company owner.';
  END IF;

  -- Validate new owner is different
  IF p_current_owner_id = p_new_owner_id THEN
    RAISE EXCEPTION 'New owner must be different from current owner'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Validate new owner is a team member
  SELECT id INTO v_new_owner_team_member_id
  FROM team_members
  WHERE company_id = p_company_id
  AND user_id = p_new_owner_id
  AND status = 'active';

  IF v_new_owner_team_member_id IS NULL THEN
    RAISE EXCEPTION 'New owner must be an active team member'
      USING ERRCODE = 'check_violation',
            HINT = 'Add the user as a team member before transferring ownership.';
  END IF;

  -- Get current owner team member ID
  SELECT id INTO v_old_owner_team_member_id
  FROM team_members
  WHERE company_id = p_company_id
  AND user_id = p_current_owner_id;

  -- Start transaction (already in transaction, but making it explicit)
  -- Create ownership transfer log entry
  INSERT INTO ownership_transfers (
    company_id,
    previous_owner_id,
    new_owner_id,
    initiated_by,
    reason,
    password_verified,
    ip_address,
    user_agent,
    completed_at
  ) VALUES (
    p_company_id,
    p_current_owner_id,
    p_new_owner_id,
    p_current_owner_id,
    p_reason,
    true, -- Password verified by calling function
    p_ip_address,
    p_user_agent,
    NOW()
  ) RETURNING id INTO v_transfer_id;

  -- Update company owner
  UPDATE companies
  SET
    owner_id = p_new_owner_id,
    updated_at = NOW()
  WHERE id = p_company_id;

  -- Update new owner's team member role to 'owner'
  UPDATE team_members
  SET
    role = 'owner'::user_role,
    updated_at = NOW()
  WHERE id = v_new_owner_team_member_id;

  -- Update old owner's team member role to 'admin'
  -- (They remain as admin to maintain some privileges)
  UPDATE team_members
  SET
    role = 'admin'::user_role,
    updated_at = NOW()
  WHERE id = v_old_owner_team_member_id;

  -- Log role changes
  INSERT INTO role_change_log (
    team_member_id,
    changed_by,
    old_role,
    new_role,
    reason
  ) VALUES
  (
    v_new_owner_team_member_id,
    p_current_owner_id,
    (SELECT role FROM team_members WHERE id = v_new_owner_team_member_id),
    'owner'::user_role,
    format('Ownership transferred: %s', COALESCE(p_reason, 'No reason provided'))
  ),
  (
    v_old_owner_team_member_id,
    p_current_owner_id,
    'owner'::user_role,
    'admin'::user_role,
    format('Former owner, transferred to %s', p_new_owner_id::text)
  );

  -- Return transfer ID for audit
  RETURN v_transfer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION transfer_company_ownership IS 'Transfers company ownership with full audit trail and role updates';

-- ============================================================================
-- SECTION 4: OWNER EXISTENCE VALIDATION
-- ============================================================================

-- Function to ensure every company has an owner team member
CREATE OR REPLACE FUNCTION ensure_owner_team_member()
RETURNS TRIGGER AS $$
BEGIN
  -- When a company is created, ensure owner is added as team member
  IF TG_OP = 'INSERT' THEN
    INSERT INTO team_members (
      company_id,
      user_id,
      role,
      status,
      department,
      job_title
    ) VALUES (
      NEW.id,
      NEW.owner_id,
      'owner'::user_role,
      'active',
      'Management',
      'Owner'
    )
    ON CONFLICT (company_id, user_id) DO UPDATE
    SET
      role = 'owner'::user_role,
      status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create owner team member
DROP TRIGGER IF EXISTS auto_create_owner_team_member ON companies;
CREATE TRIGGER auto_create_owner_team_member
  AFTER INSERT ON companies
  FOR EACH ROW
  EXECUTE FUNCTION ensure_owner_team_member();

COMMENT ON TRIGGER auto_create_owner_team_member ON companies IS 'Automatically creates owner as team member when company is created';

-- ============================================================================
-- SECTION 5: RLS POLICIES FOR OWNERSHIP TRANSFERS
-- ============================================================================

-- Enable RLS
ALTER TABLE ownership_transfers ENABLE ROW LEVEL SECURITY;

-- Company owners and admins can view transfers for their company
CREATE POLICY "Company owners and admins can view transfers"
  ON ownership_transfers FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- Only owners can initiate transfers (enforced by function, but policy for safety)
CREATE POLICY "Only owners can initiate transfers"
  ON ownership_transfers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE id = company_id
      AND owner_id = auth.uid()
    )
  );

-- ============================================================================
-- SECTION 6: UPDATE EXISTING DATA
-- ============================================================================

-- Ensure all existing company owners are team members with owner role
INSERT INTO team_members (
  company_id,
  user_id,
  role,
  status,
  department,
  job_title,
  created_at,
  updated_at
)
SELECT
  c.id,
  c.owner_id,
  'owner'::user_role,
  'active',
  'Management',
  'Owner',
  c.created_at,
  NOW()
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM team_members tm
  WHERE tm.company_id = c.id
  AND tm.user_id = c.owner_id
)
ON CONFLICT (company_id, user_id) DO UPDATE
SET
  role = 'owner'::user_role,
  status = 'active',
  department = COALESCE(team_members.department, 'Management'),
  job_title = COALESCE(team_members.job_title, 'Owner');

-- ============================================================================
-- SECTION 7: HELPER VIEWS
-- ============================================================================

-- View to see current company owners
CREATE OR REPLACE VIEW company_owners AS
SELECT
  c.id as company_id,
  c.name as company_name,
  c.owner_id,
  u.name as owner_name,
  u.email as owner_email,
  tm.id as team_member_id,
  tm.role,
  tm.status,
  tm.created_at as owner_since
FROM companies c
JOIN users u ON u.id = c.owner_id
LEFT JOIN team_members tm ON tm.company_id = c.id AND tm.user_id = c.owner_id
ORDER BY c.created_at DESC;

COMMENT ON VIEW company_owners IS 'View of all companies with their owners';

-- Grant access to authenticated users
GRANT SELECT ON company_owners TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
