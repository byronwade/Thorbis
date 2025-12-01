-- Create data import/export tracking tables
-- Migration: Import/Export System
-- Created: 2024

-- Import/Export Job Tracking
CREATE TABLE IF NOT EXISTS data_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'jobs', 'invoices', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'rejected', 'reverted'
  file_name TEXT,
  total_rows INTEGER DEFAULT 0,
  successful_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb, -- Array of {row, field, error}
  backup_data JSONB, -- Snapshot of data before import
  dry_run BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  format TEXT NOT NULL, -- 'xlsx', 'csv', 'pdf'
  filters JSONB DEFAULT '{}'::jsonb,
  file_url TEXT,
  record_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Exports
CREATE TABLE IF NOT EXISTS scheduled_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL,
  format TEXT NOT NULL, -- 'xlsx', 'csv', 'pdf'
  filters JSONB DEFAULT '{}'::jsonb,
  schedule TEXT NOT NULL, -- Cron expression
  email_to TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_data_imports_company_id ON data_imports(company_id);
CREATE INDEX IF NOT EXISTS idx_data_imports_user_id ON data_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_data_imports_status ON data_imports(status);
CREATE INDEX IF NOT EXISTS idx_data_imports_created_at ON data_imports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_data_exports_company_id ON data_exports(company_id);
CREATE INDEX IF NOT EXISTS idx_data_exports_user_id ON data_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_data_exports_created_at ON data_exports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_exports_expires_at ON data_exports(expires_at);

CREATE INDEX IF NOT EXISTS idx_scheduled_exports_company_id ON scheduled_exports(company_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_exports_active ON scheduled_exports(active);
CREATE INDEX IF NOT EXISTS idx_scheduled_exports_next_run_at ON scheduled_exports(next_run_at);

-- Row Level Security (RLS) Policies
ALTER TABLE data_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_exports ENABLE ROW LEVEL SECURITY;

-- Users can view their own imports
CREATE POLICY "Users can view own imports"
ON data_imports FOR SELECT
USING (auth.uid() = user_id);

-- Users can create imports for their company
CREATE POLICY "Users can create imports"
ON data_imports FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own imports
CREATE POLICY "Users can update own imports"
ON data_imports FOR UPDATE
USING (auth.uid() = user_id);

-- Users can view their own exports
CREATE POLICY "Users can view own exports"
ON data_exports FOR SELECT
USING (auth.uid() = user_id);

-- Users can create exports for their company
CREATE POLICY "Users can create exports"
ON data_exports FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own scheduled exports
CREATE POLICY "Users can view own scheduled exports"
ON scheduled_exports FOR SELECT
USING (auth.uid() = user_id);

-- Users can create scheduled exports
CREATE POLICY "Users can create scheduled exports"
ON scheduled_exports FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own scheduled exports
CREATE POLICY "Users can update own scheduled exports"
ON scheduled_exports FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own scheduled exports
CREATE POLICY "Users can delete own scheduled exports"
ON scheduled_exports FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data_imports_updated_at
    BEFORE UPDATE ON data_imports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_exports_updated_at
    BEFORE UPDATE ON data_exports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_exports_updated_at
    BEFORE UPDATE ON scheduled_exports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE data_imports IS 'Tracks all data import operations with validation results and backup data';
COMMENT ON TABLE data_exports IS 'Tracks all data export operations with download URLs and expiration';
COMMENT ON TABLE scheduled_exports IS 'Manages recurring export schedules with email delivery options';

