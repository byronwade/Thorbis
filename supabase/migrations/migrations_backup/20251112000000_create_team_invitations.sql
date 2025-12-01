-- ============================================================================
-- TEAM INVITATIONS TABLE
-- ============================================================================
-- Migration: 20251112000000_create_team_invitations
-- Description: Creates team_invitations table for magic link invitations
-- Date: 2025-11-12
-- ============================================================================

-- Create team_invitations table for storing invitation tokens
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  token TEXT UNIQUE NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one invitation per email per company at a time
  UNIQUE(company_id, email)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_team_invitations_company_id ON team_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_expires_at ON team_invitations(expires_at) WHERE used_at IS NULL;

-- Enable RLS
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_invitations
-- Company owners and admins can view invitations for their company
CREATE POLICY "Company owners can view team invitations"
ON team_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.company_id = team_invitations.company_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
    AND team_members.status = 'active'
  )
);

-- Company owners and admins can create invitations
CREATE POLICY "Company owners can create team invitations"
ON team_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.company_id = company_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
    AND team_members.status = 'active'
  )
);

-- Company owners and admins can delete invitations (cancel them)
CREATE POLICY "Company owners can delete team invitations"
ON team_invitations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.company_id = team_invitations.company_id
    AND team_members.user_id = auth.uid()
    AND team_members.role IN ('owner', 'admin')
    AND team_members.status = 'active'
  )
);

-- Add comments
COMMENT ON TABLE team_invitations IS 'Stores magic link invitations for team members to join companies';
COMMENT ON COLUMN team_invitations.token IS 'Secure token (JWT) for magic link authentication';
COMMENT ON COLUMN team_invitations.expires_at IS 'Expiration timestamp for the invitation (typically 7 days)';
COMMENT ON COLUMN team_invitations.used_at IS 'Timestamp when the invitation was accepted';

