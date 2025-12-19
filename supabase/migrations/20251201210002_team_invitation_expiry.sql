-- ============================================================================
-- TEAM INVITATION EXPIRY ENFORCEMENT
-- ============================================================================
-- Created: 2025-12-01
-- Purpose: Ensure expired invitations are filtered at the database level
--
-- Issues Fixed:
-- 1. RLS policy doesn't filter expired invitations
-- 2. No automatic cleanup of old expired invitations
-- 3. Add index for expiry-based queries
-- ============================================================================

-- ============================================================================
-- 1. UPDATE RLS POLICY TO FILTER EXPIRED INVITATIONS
-- ============================================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Company owners can view team invitations" ON team_invitations;

-- Create new policy that filters expired invitations
CREATE POLICY "Company owners can view active team invitations"
ON team_invitations
FOR SELECT
USING (
  -- Only show non-expired or used invitations
  (expires_at > NOW() OR used_at IS NOT NULL)
  AND EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.company_id = team_invitations.company_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
    AND team_members.status = 'active'
  )
);

-- ============================================================================
-- 2. ADD COMPOSITE INDEX FOR EXPIRY LOOKUPS
-- ============================================================================

-- Index for finding valid (non-expired, unused) invitations
CREATE INDEX IF NOT EXISTS idx_team_invitations_valid
ON team_invitations(company_id, expires_at DESC)
WHERE used_at IS NULL;

-- ============================================================================
-- 3. FUNCTION TO VALIDATE INVITATION TOKEN
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_invitation_token(p_token TEXT)
RETURNS TABLE(
  is_valid BOOLEAN,
  invitation_id UUID,
  company_id UUID,
  email TEXT,
  role user_role,
  first_name TEXT,
  last_name TEXT,
  expires_at TIMESTAMPTZ,
  error_message TEXT
) AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- Find the invitation
  SELECT * INTO v_invitation
  FROM team_invitations ti
  WHERE ti.token = p_token;

  -- Check if invitation exists
  IF v_invitation IS NULL THEN
    RETURN QUERY SELECT
      FALSE,
      NULL::UUID,
      NULL::UUID,
      NULL::TEXT,
      NULL::user_role,
      NULL::TEXT,
      NULL::TEXT,
      NULL::TIMESTAMPTZ,
      'Invitation not found'::TEXT;
    RETURN;
  END IF;

  -- Check if already used
  IF v_invitation.used_at IS NOT NULL THEN
    RETURN QUERY SELECT
      FALSE,
      v_invitation.id,
      v_invitation.company_id,
      v_invitation.email,
      v_invitation.role,
      v_invitation.first_name,
      v_invitation.last_name,
      v_invitation.expires_at,
      'Invitation has already been used'::TEXT;
    RETURN;
  END IF;

  -- Check if expired
  IF v_invitation.expires_at < NOW() THEN
    RETURN QUERY SELECT
      FALSE,
      v_invitation.id,
      v_invitation.company_id,
      v_invitation.email,
      v_invitation.role,
      v_invitation.first_name,
      v_invitation.last_name,
      v_invitation.expires_at,
      'Invitation has expired'::TEXT;
    RETURN;
  END IF;

  -- Invitation is valid
  RETURN QUERY SELECT
    TRUE,
    v_invitation.id,
    v_invitation.company_id,
    v_invitation.email,
    v_invitation.role,
    v_invitation.first_name,
    v_invitation.last_name,
    v_invitation.expires_at,
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow anyone to validate invitation tokens (needed for sign up flow)
GRANT EXECUTE ON FUNCTION validate_invitation_token TO anon, authenticated;

COMMENT ON FUNCTION validate_invitation_token IS
'Validates an invitation token and returns status with details. Safe for public use.';

-- ============================================================================
-- 4. CLEANUP FUNCTION FOR EXPIRED INVITATIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_invitations(p_days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Delete invitations that:
  -- 1. Expired more than X days ago AND are unused
  -- 2. Were used more than X days ago (for record cleanup)
  DELETE FROM team_invitations
  WHERE (
    -- Unused and expired long ago
    (used_at IS NULL AND expires_at < NOW() - (p_days_old || ' days')::INTERVAL)
    OR
    -- Used long ago (keep for some time for auditing)
    (used_at IS NOT NULL AND used_at < NOW() - (p_days_old || ' days')::INTERVAL)
  );

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_invitations IS
'Deletes old expired or used invitations. Called by cron job.';

-- ============================================================================
-- 5. ADD COMMENT
-- ============================================================================

COMMENT ON POLICY "Company owners can view active team invitations" ON team_invitations IS
'Only shows non-expired or used invitations to company admins/owners';
