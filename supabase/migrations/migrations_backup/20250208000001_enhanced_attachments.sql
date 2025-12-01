-- ============================================================================
-- ENHANCED ATTACHMENTS TABLE
-- ============================================================================
-- This migration enhances the attachments table with:
-- - Virus scanning status and results
-- - Folder path organization
-- - Access tracking
-- - File integrity verification
-- - Additional metadata
-- ============================================================================

-- Create enum for virus scan status
DO $$ BEGIN
  CREATE TYPE virus_scan_status AS ENUM (
    'pending',
    'scanning',
    'clean',
    'infected',
    'failed',
    'skipped'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new columns to attachments table
ALTER TABLE attachments
ADD COLUMN IF NOT EXISTS folder_path TEXT,
ADD COLUMN IF NOT EXISTS virus_scan_status virus_scan_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS virus_scan_result JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS virus_scanned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0 CHECK (access_count >= 0),
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_accessed_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS checksum TEXT, -- SHA256 hash for integrity
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
ADD COLUMN IF NOT EXISTS last_downloaded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ, -- For temporary files
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1 CHECK (version > 0),
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES attachments(id) ON DELETE SET NULL; -- For versioning

-- Add comments for documentation
COMMENT ON COLUMN attachments.folder_path IS 'Custom folder path for organization (e.g., "contracts/2025")';
COMMENT ON COLUMN attachments.virus_scan_status IS 'Status of virus/malware scan';
COMMENT ON COLUMN attachments.virus_scan_result IS 'Detailed scan results from antivirus service';
COMMENT ON COLUMN attachments.checksum IS 'SHA256 checksum for file integrity verification';
COMMENT ON COLUMN attachments.access_count IS 'Number of times file has been accessed/viewed';
COMMENT ON COLUMN attachments.download_count IS 'Number of times file has been downloaded';
COMMENT ON COLUMN attachments.expiry_date IS 'Date when temporary file should be deleted';
COMMENT ON COLUMN attachments.parent_id IS 'Reference to previous version for file versioning';
COMMENT ON COLUMN attachments.version IS 'Version number of the file';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attachments_folder_path ON attachments(folder_path);
CREATE INDEX IF NOT EXISTS idx_attachments_virus_scan_status ON attachments(virus_scan_status);
CREATE INDEX IF NOT EXISTS idx_attachments_virus_scanned_at ON attachments(virus_scanned_at);
CREATE INDEX IF NOT EXISTS idx_attachments_checksum ON attachments(checksum);
CREATE INDEX IF NOT EXISTS idx_attachments_expiry_date ON attachments(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_attachments_parent_id ON attachments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_attachments_company_folder ON attachments(company_id, folder_path);
CREATE INDEX IF NOT EXISTS idx_attachments_entity_folder ON attachments(entity_type, entity_id, folder_path);
CREATE INDEX IF NOT EXISTS idx_attachments_last_accessed ON attachments(last_accessed_at DESC);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_attachments_company_status_created 
ON attachments(company_id, virus_scan_status, created_at DESC)
WHERE deleted_at IS NULL;

-- ============================================================================
-- DOCUMENT FOLDERS TABLE
-- ============================================================================
-- Separate table for managing folder structure and permissions
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES document_folders(id) ON DELETE CASCADE,
  
  -- Folder information
  name TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly name
  path TEXT NOT NULL, -- Full path for breadcrumbs (e.g., "/contracts/2025")
  
  -- Context (optional - folder can be specific to an entity)
  context_type TEXT CHECK (context_type IN ('customer', 'job', 'equipment', 'general', 'invoice', 'estimate')),
  context_id UUID, -- Reference to customer_id, job_id, etc.
  
  -- Permissions
  permissions JSONB DEFAULT '{"public": false, "roles": []}'::jsonb,
  is_private BOOLEAN DEFAULT FALSE,
  allowed_roles TEXT[] DEFAULT ARRAY['owner', 'admin', 'manager'],
  
  -- Metadata
  description TEXT,
  color TEXT, -- For UI customization
  icon TEXT, -- Icon name for UI
  sort_order INTEGER DEFAULT 0,
  is_system BOOLEAN DEFAULT FALSE, -- System folders can't be deleted
  
  -- Statistics
  file_count INTEGER DEFAULT 0 CHECK (file_count >= 0),
  total_size BIGINT DEFAULT 0 CHECK (total_size >= 0),
  
  -- Audit
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT unique_company_folder_path UNIQUE(company_id, path),
  CONSTRAINT valid_context CHECK (
    (context_type IS NULL AND context_id IS NULL) OR
    (context_type IS NOT NULL AND context_id IS NOT NULL)
  )
);

-- Add indexes for document_folders
CREATE INDEX idx_document_folders_company ON document_folders(company_id, deleted_at);
CREATE INDEX idx_document_folders_parent ON document_folders(parent_id);
CREATE INDEX idx_document_folders_context ON document_folders(context_type, context_id);
CREATE INDEX idx_document_folders_path ON document_folders(company_id, path);
CREATE INDEX idx_document_folders_created ON document_folders(created_at DESC);

-- Add comments
COMMENT ON TABLE document_folders IS 'Hierarchical folder structure for organizing company documents';
COMMENT ON COLUMN document_folders.path IS 'Full hierarchical path for breadcrumb navigation';
COMMENT ON COLUMN document_folders.context_type IS 'Optional link to specific entity (customer, job, etc.)';
COMMENT ON COLUMN document_folders.is_system IS 'System folders cannot be deleted by users';
COMMENT ON COLUMN document_folders.permissions IS 'JSONB object defining access permissions';

-- Enable RLS on document_folders
ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_folders
CREATE POLICY "Company members can view folders"
  ON document_folders FOR SELECT
  USING (
    deleted_at IS NULL AND
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Company members can create folders"
  ON document_folders FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Company members can update folders"
  ON document_folders FOR UPDATE
  USING (
    deleted_at IS NULL AND
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Company owners can delete folders"
  ON document_folders FOR DELETE
  USING (
    is_system = FALSE AND
    company_id IN (
      SELECT company_id FROM team_members
      WHERE user_id = auth.uid() 
      AND status = 'active'
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update folder statistics when files are added/removed
CREATE OR REPLACE FUNCTION update_folder_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment file count and size
    UPDATE document_folders
    SET 
      file_count = file_count + 1,
      total_size = total_size + NEW.file_size,
      updated_at = NOW()
    WHERE company_id = NEW.company_id
    AND path = NEW.folder_path;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement file count and size
    UPDATE document_folders
    SET 
      file_count = GREATEST(0, file_count - 1),
      total_size = GREATEST(0, total_size - OLD.file_size),
      updated_at = NOW()
    WHERE company_id = OLD.company_id
    AND path = OLD.folder_path;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle folder path changes
    IF OLD.folder_path IS DISTINCT FROM NEW.folder_path THEN
      -- Decrement old folder
      UPDATE document_folders
      SET 
        file_count = GREATEST(0, file_count - 1),
        total_size = GREATEST(0, total_size - OLD.file_size),
        updated_at = NOW()
      WHERE company_id = OLD.company_id
      AND path = OLD.folder_path;
      
      -- Increment new folder
      UPDATE document_folders
      SET 
        file_count = file_count + 1,
        total_size = total_size + NEW.file_size,
        updated_at = NOW()
      WHERE company_id = NEW.company_id
      AND path = NEW.folder_path;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for folder statistics
DROP TRIGGER IF EXISTS trigger_update_folder_statistics ON attachments;
CREATE TRIGGER trigger_update_folder_statistics
  AFTER INSERT OR UPDATE OR DELETE ON attachments
  FOR EACH ROW
  WHEN (pg_trigger_depth() = 0) -- Prevent recursive triggers
  EXECUTE FUNCTION update_folder_statistics();

-- Function to track file access
CREATE OR REPLACE FUNCTION track_file_access(
  p_attachment_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS void AS $$
BEGIN
  UPDATE attachments
  SET 
    access_count = access_count + 1,
    last_accessed_at = NOW(),
    last_accessed_by = p_user_id
  WHERE id = p_attachment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track file download
CREATE OR REPLACE FUNCTION track_file_download(
  p_attachment_id UUID
)
RETURNS void AS $$
BEGIN
  UPDATE attachments
  SET 
    download_count = download_count + 1,
    last_downloaded_at = NOW()
  WHERE id = p_attachment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get folder breadcrumbs
CREATE OR REPLACE FUNCTION get_folder_breadcrumbs(
  p_folder_id UUID
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  path TEXT,
  level INTEGER
) AS $$
WITH RECURSIVE folder_tree AS (
  -- Base case: start with the given folder
  SELECT 
    f.id,
    f.name,
    f.path,
    f.parent_id,
    1 as level
  FROM document_folders f
  WHERE f.id = p_folder_id
  
  UNION ALL
  
  -- Recursive case: get parent folders
  SELECT 
    f.id,
    f.name,
    f.path,
    f.parent_id,
    ft.level + 1
  FROM document_folders f
  INNER JOIN folder_tree ft ON f.id = ft.parent_id
)
SELECT 
  folder_tree.id,
  folder_tree.name,
  folder_tree.path,
  folder_tree.level
FROM folder_tree
ORDER BY level DESC;
$$ LANGUAGE sql STABLE;

-- Function to cleanup expired files
CREATE OR REPLACE FUNCTION cleanup_expired_attachments()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Soft delete expired files
  UPDATE attachments
  SET 
    deleted_at = NOW(),
    deleted_by = NULL -- System deletion
  WHERE 
    expiry_date IS NOT NULL
    AND expiry_date < NOW()
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CREATE DEFAULT FOLDERS FOR EXISTING COMPANIES
-- ============================================================================

-- Create default folder structure for all companies
INSERT INTO document_folders (company_id, name, slug, path, is_system, created_by, permissions)
SELECT 
  c.id,
  'General',
  'general',
  '/general',
  TRUE,
  c.owner_id,
  '{"public": false, "roles": ["owner", "admin", "manager", "member"]}'::jsonb
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM document_folders df
  WHERE df.company_id = c.id AND df.path = '/general'
)
ON CONFLICT (company_id, path) DO NOTHING;

INSERT INTO document_folders (company_id, name, slug, path, is_system, created_by, permissions)
SELECT 
  c.id,
  'Contracts',
  'contracts',
  '/contracts',
  TRUE,
  c.owner_id,
  '{"public": false, "roles": ["owner", "admin"]}'::jsonb
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM document_folders df
  WHERE df.company_id = c.id AND df.path = '/contracts'
)
ON CONFLICT (company_id, path) DO NOTHING;

INSERT INTO document_folders (company_id, name, slug, path, is_system, created_by, permissions)
SELECT 
  c.id,
  'Customer Files',
  'customers',
  '/customers',
  TRUE,
  c.owner_id,
  '{"public": false, "roles": ["owner", "admin", "manager", "member"]}'::jsonb
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM document_folders df
  WHERE df.company_id = c.id AND df.path = '/customers'
)
ON CONFLICT (company_id, path) DO NOTHING;

INSERT INTO document_folders (company_id, name, slug, path, is_system, created_by, permissions)
SELECT 
  c.id,
  'Job Files',
  'jobs',
  '/jobs',
  TRUE,
  c.owner_id,
  '{"public": false, "roles": ["owner", "admin", "manager", "member"]}'::jsonb
FROM companies c
WHERE NOT EXISTS (
  SELECT 1 FROM document_folders df
  WHERE df.company_id = c.id AND df.path = '/jobs'
)
ON CONFLICT (company_id, path) DO NOTHING;

-- ============================================================================
-- ENHANCED ATTACHMENTS TABLE COMPLETE
-- ============================================================================
-- Added virus scanning, folder organization, access tracking
-- Created document_folders table for hierarchical structure
-- Added helper functions for statistics and cleanup
-- Created default folders for all companies
-- ============================================================================

