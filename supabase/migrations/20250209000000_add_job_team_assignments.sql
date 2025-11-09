-- ============================================================================
-- ADD JOB TEAM ASSIGNMENTS - Many-to-Many Relationship
-- ============================================================================
-- Creates a junction table to support multiple team members per job
-- Enables tracking of roles, assignment dates, and team member contributions

-- Create job_team_assignments junction table
CREATE TABLE IF NOT EXISTS job_team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  
  -- Assignment details
  role TEXT NOT NULL DEFAULT 'crew' CHECK (role IN ('primary', 'assistant', 'crew', 'supervisor')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  removed_at TIMESTAMPTZ,
  removed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Prevent duplicate assignments
  UNIQUE(job_id, team_member_id)
);

-- Indexes for performance
CREATE INDEX idx_job_team_assignments_job_id ON job_team_assignments(job_id) WHERE removed_at IS NULL;
CREATE INDEX idx_job_team_assignments_team_member_id ON job_team_assignments(team_member_id) WHERE removed_at IS NULL;
CREATE INDEX idx_job_team_assignments_role ON job_team_assignments(job_id, role) WHERE removed_at IS NULL;

-- RLS Policies
ALTER TABLE job_team_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view team assignments for jobs in their company
CREATE POLICY "Users can view job team assignments in their company"
ON job_team_assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM jobs j
    INNER JOIN team_members tm ON tm.company_id = j.company_id
    WHERE j.id = job_team_assignments.job_id
    AND tm.user_id = auth.uid()
  )
);

-- Policy: Users can manage team assignments for jobs in their company
CREATE POLICY "Users can manage job team assignments in their company"
ON job_team_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM jobs j
    INNER JOIN team_members tm ON tm.company_id = j.company_id
    WHERE j.id = job_team_assignments.job_id
    AND tm.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM jobs j
    INNER JOIN team_members tm ON tm.company_id = j.company_id
    WHERE j.id = job_team_assignments.job_id
    AND tm.user_id = auth.uid()
  )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_team_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_job_team_assignments_updated_at
BEFORE UPDATE ON job_team_assignments
FOR EACH ROW
EXECUTE FUNCTION update_job_team_assignments_updated_at();

-- Comments for documentation
COMMENT ON TABLE job_team_assignments IS 'Junction table for many-to-many relationship between jobs and team members';
COMMENT ON COLUMN job_team_assignments.role IS 'Role of team member on job: primary (lead), assistant, crew, or supervisor';
COMMENT ON COLUMN job_team_assignments.assigned_at IS 'When the team member was assigned to the job';
COMMENT ON COLUMN job_team_assignments.removed_at IS 'When the team member was removed from the job (soft delete)';

