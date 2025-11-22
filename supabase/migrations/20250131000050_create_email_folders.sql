-- ============================================================================
-- EMAIL FOLDERS TABLE
-- ============================================================================
-- Migration: 20250131000050_create_email_folders
-- Description: Custom email folders/labels that users can create and organize
-- Author: AI Assistant
-- Date: 2025-01-31
--
-- This migration creates:
-- - email_folders: Custom folders users can create (e.g., "CSLB", "Notes", "Important")
-- - Links emails to folders via tags or a junction table
-- ============================================================================

-- Create email_folders table
CREATE TABLE IF NOT EXISTS email_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Folder information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly name (e.g., "cslb", "notes")
  description TEXT,
  
  -- Display
  color TEXT, -- Hex color for UI
  icon TEXT, -- Icon name (optional)
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Status
  is_system BOOLEAN NOT NULL DEFAULT FALSE, -- System folders can't be deleted
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Constraints
  UNIQUE(company_id, slug),
  CONSTRAINT email_folders_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
  CONSTRAINT email_folders_slug_not_empty CHECK (LENGTH(TRIM(slug)) > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_folders_company ON email_folders(company_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_folders_slug ON email_folders(company_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_folders_active ON email_folders(company_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_folders_sort ON email_folders(company_id, sort_order) WHERE deleted_at IS NULL AND is_active = TRUE;

-- Add comment
COMMENT ON TABLE email_folders IS 'Custom email folders/labels that users can create to organize emails';
COMMENT ON COLUMN email_folders.is_system IS 'System folders (Inbox, Sent, etc.) cannot be deleted by users';
COMMENT ON COLUMN email_folders.slug IS 'URL-friendly identifier used in routes (e.g., /communication/folder/cslb)';

-- Enable RLS
ALTER TABLE email_folders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Company members can view folders"
  ON email_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM company_memberships
      WHERE company_memberships.company_id = email_folders.company_id
      AND company_memberships.user_id = auth.uid()
      AND company_memberships.status = 'active'
    ) AND
    (deleted_at IS NULL)
  );

CREATE POLICY "Company members can create folders"
  ON email_folders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_memberships
      WHERE company_memberships.company_id = company_id
      AND company_memberships.user_id = auth.uid()
      AND company_memberships.status = 'active'
    ) AND
    created_by = auth.uid()
  );

CREATE POLICY "Company members can update folders"
  ON email_folders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM company_memberships
      WHERE company_memberships.company_id = email_folders.company_id
      AND company_memberships.user_id = auth.uid()
      AND company_memberships.status = 'active'
    ) AND
    (deleted_at IS NULL)
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_memberships
      WHERE company_memberships.company_id = company_id
      AND company_memberships.user_id = auth.uid()
      AND company_memberships.status = 'active'
    ) AND
    -- Prevent updating system folders
    (is_system = FALSE OR OLD.is_system = FALSE)
  );

CREATE POLICY "Company members can delete folders"
  ON email_folders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM company_memberships
      WHERE company_memberships.company_id = email_folders.company_id
      AND company_memberships.user_id = auth.uid()
      AND company_memberships.status = 'active'
    ) AND
    is_system = FALSE AND -- Cannot delete system folders
    deleted_at IS NULL
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_folders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_email_folders_updated_at
  BEFORE UPDATE ON email_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_email_folders_updated_at();

-- Create default system folders for existing companies
-- These will be created via application logic, but we can add them here for reference
-- Note: System folders are managed by the application, not stored in this table
-- Custom folders are what users create

