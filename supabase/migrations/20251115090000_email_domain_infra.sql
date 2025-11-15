-- Email domain & inbound infrastructure

CREATE TABLE IF NOT EXISTS communication_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  resend_domain_id TEXT,
  dns_records JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_synced_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_domains_company ON communication_email_domains(company_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_domains_unique_company_domain
  ON communication_email_domains(company_id, domain);

CREATE TABLE IF NOT EXISTS communication_email_inbound_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  route_address TEXT NOT NULL,
  resend_route_id TEXT,
  signing_secret TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  destination_url TEXT,
  last_synced_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_inbound_route_address
  ON communication_email_inbound_routes(route_address);
CREATE INDEX IF NOT EXISTS idx_email_inbound_company
  ON communication_email_inbound_routes(company_id);

CREATE TABLE IF NOT EXISTS communication_email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID REFERENCES communications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  provider_event_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_events_comm ON communication_email_events(communication_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_domains_updated_at
  BEFORE UPDATE ON communication_email_domains
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_email_inbound_routes_updated_at
  BEFORE UPDATE ON communication_email_inbound_routes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE communication_email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_email_inbound_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can read email domains"
  ON communication_email_domains
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_domains.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can manage email domains"
  ON communication_email_domains
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_domains.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_domains.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can read inbound routes"
  ON communication_email_inbound_routes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_inbound_routes.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can manage inbound routes"
  ON communication_email_inbound_routes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_inbound_routes.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = communication_email_inbound_routes.company_id
        AND team_members.user_id = auth.uid()
        AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can read email events"
  ON communication_email_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM communications
      WHERE communications.id = communication_email_events.communication_id
        AND communications.company_id IN (
          SELECT company_id
          FROM team_members
          WHERE team_members.user_id = auth.uid()
            AND team_members.status = 'active'
        )
    )
  );

