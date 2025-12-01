-- ============================================================================
-- Job Notes Table
-- Created: 2025-02-08
-- Description: Adds job_notes table for tracking notes on jobs
-- Similar to customer_notes structure
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  -- Note details
  note_type TEXT NOT NULL DEFAULT 'internal' CHECK (note_type IN ('customer', 'internal')),
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_job_notes_job_id ON job_notes(job_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_notes_company_id ON job_notes(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_notes_user_id ON job_notes(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_notes_note_type ON job_notes(note_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_notes_is_pinned ON job_notes(is_pinned) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_notes_created_at ON job_notes(created_at DESC) WHERE deleted_at IS NULL;

-- Enable RLS
ALTER TABLE job_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view job notes for their company"
  ON job_notes FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create job notes for their company"
  ON job_notes FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update job notes for their company"
  ON job_notes FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete job notes for their company"
  ON job_notes FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

