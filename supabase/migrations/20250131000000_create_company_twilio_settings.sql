-- ============================================================================
-- COMPANY TWILIO SETTINGS TABLE
-- Created: 2025-01-31
-- Purpose: Store Twilio configuration per company
-- ============================================================================

CREATE TABLE IF NOT EXISTS company_twilio_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Twilio Account Credentials
    account_sid TEXT NOT NULL,
    auth_token TEXT, -- Encrypted in production
    api_key_sid TEXT, -- Preferred over auth_token
    api_key_secret TEXT, -- Encrypted in production
    
    -- Twilio Application Settings
    twiml_app_sid TEXT,
    messaging_service_sid TEXT,
    verify_service_sid TEXT,
    
    -- Default Phone Numbers
    default_from_number TEXT,
    
    -- Email Integration (SendGrid via Twilio)
    sendgrid_api_key TEXT, -- Encrypted in production
    sendgrid_verified_domain TEXT,
    default_from_email TEXT,
    
    -- Webhook Configuration
    webhook_url TEXT,
    status_callback_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    
    -- One settings record per company
    UNIQUE(company_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_company_twilio_settings_company_id ON company_twilio_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_company_twilio_settings_active ON company_twilio_settings(company_id, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE company_twilio_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "company_twilio_settings_service_role"
    ON company_twilio_settings
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "company_twilio_settings_read_members"
    ON company_twilio_settings
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.company_id = company_twilio_settings.company_id
              AND tm.user_id = auth.uid()
              AND tm.status = 'active'
        )
    );

CREATE POLICY IF NOT EXISTS "company_twilio_settings_manage_admins"
    ON company_twilio_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.company_id = company_twilio_settings.company_id
              AND tm.user_id = auth.uid()
              AND tm.status = 'active'
              AND tm.role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.company_id = company_twilio_settings.company_id
              AND tm.user_id = auth.uid()
              AND tm.status = 'active'
              AND tm.role IN ('owner', 'admin')
        )
    );

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_company_twilio_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_twilio_settings_updated_at
    BEFORE UPDATE ON company_twilio_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_company_twilio_settings_updated_at();

