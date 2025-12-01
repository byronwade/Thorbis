-- Create table to store unrouted emails for manual review
-- This prevents data loss when emails arrive for addresses without routes

CREATE TABLE IF NOT EXISTS communication_unrouted_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_address TEXT NOT NULL,
  from_address TEXT NOT NULL,
  subject TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL,
  
  -- Optional company association (can be NULL if no match found)
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  
  -- Processing status
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_unrouted_emails_company 
  ON communication_unrouted_emails(company_id);
  
CREATE INDEX IF NOT EXISTS idx_unrouted_emails_status 
  ON communication_unrouted_emails(status);
  
CREATE INDEX IF NOT EXISTS idx_unrouted_emails_received_at 
  ON communication_unrouted_emails(received_at DESC);

-- RLS policies
ALTER TABLE communication_unrouted_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view unrouted emails"
  ON communication_unrouted_emails
  FOR SELECT
  USING (
    company_id IS NULL OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_unrouted_emails.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER trg_unrouted_emails_updated_at
  BEFORE UPDATE ON communication_unrouted_emails
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add helpful comment
COMMENT ON TABLE communication_unrouted_emails IS 'Stores emails that arrive without a matching inbound route for manual review and processing';
