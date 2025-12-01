-- =====================================================================================
-- Telnyx Communication System Migration
-- =====================================================================================
-- Created: 2025-11-01
-- Description: Add Telnyx VoIP integration including phone numbers, call routing,
--              voicemail, and extended communication tracking
-- =====================================================================================

-- =====================================================================================
-- Table: phone_numbers
-- Description: Stores company-owned phone numbers from Telnyx
-- =====================================================================================
CREATE TABLE IF NOT EXISTS phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Telnyx identifiers
    telnyx_phone_number_id TEXT UNIQUE,
    telnyx_connection_id TEXT,
    telnyx_messaging_profile_id TEXT,

    -- Phone number details
    phone_number TEXT NOT NULL,
    formatted_number TEXT NOT NULL,
    country_code TEXT NOT NULL DEFAULT 'US',
    area_code TEXT,
    number_type TEXT CHECK (number_type IN ('local', 'toll-free', 'mobile', 'national', 'shared_cost')),

    -- Capabilities
    features JSONB DEFAULT '[]'::JSONB, -- ['sms', 'mms', 'voice', 'fax']

    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'porting', 'deleted')),

    -- Routing configuration
    call_routing_rule_id UUID REFERENCES call_routing_rules(id) ON DELETE SET NULL,
    forward_to_number TEXT,
    voicemail_enabled BOOLEAN DEFAULT true,
    voicemail_greeting_url TEXT,

    -- Usage tracking
    incoming_calls_count INTEGER DEFAULT 0,
    outgoing_calls_count INTEGER DEFAULT 0,
    sms_sent_count INTEGER DEFAULT 0,
    sms_received_count INTEGER DEFAULT 0,

    -- Billing
    monthly_cost DECIMAL(10, 2),
    setup_cost DECIMAL(10, 2),
    billing_group_id TEXT,

    -- Metadata
    customer_reference TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,

    -- Porting information
    ported_from TEXT,
    ported_at TIMESTAMP WITH TIME ZONE,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id)
);

-- Indexes for phone_numbers
CREATE INDEX idx_phone_numbers_company_id ON phone_numbers(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_phone_numbers_telnyx_id ON phone_numbers(telnyx_phone_number_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_phone_numbers_phone_number ON phone_numbers(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_phone_numbers_status ON phone_numbers(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_phone_numbers_country ON phone_numbers(country_code) WHERE deleted_at IS NULL;

-- =====================================================================================
-- Table: call_routing_rules
-- Description: Defines how incoming calls should be routed
-- =====================================================================================
CREATE TABLE IF NOT EXISTS call_routing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Rule details
    name TEXT NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0, -- Higher priority rules execute first

    -- Rule type
    routing_type TEXT NOT NULL CHECK (routing_type IN ('direct', 'round_robin', 'ivr', 'business_hours', 'conditional')),

    -- Business hours configuration
    business_hours JSONB, -- { "monday": [{"start": "09:00", "end": "17:00"}], ... }
    timezone TEXT DEFAULT 'America/Los_Angeles',
    after_hours_action TEXT CHECK (after_hours_action IN ('voicemail', 'forward', 'hangup')),
    after_hours_forward_to TEXT,

    -- Round-robin configuration
    team_members UUID[] DEFAULT ARRAY[]::UUID[], -- Array of user IDs
    current_index INTEGER DEFAULT 0,
    ring_timeout INTEGER DEFAULT 20, -- Seconds before trying next team member

    -- IVR configuration
    ivr_menu JSONB, -- IVR menu structure
    ivr_greeting_url TEXT,
    ivr_invalid_retry_count INTEGER DEFAULT 3,
    ivr_timeout INTEGER DEFAULT 10, -- Seconds to wait for input

    -- Direct routing
    forward_to_number TEXT,
    forward_to_user_id UUID REFERENCES users(id),

    -- Conditional routing
    conditions JSONB, -- Custom routing conditions

    -- Voicemail settings
    enable_voicemail BOOLEAN DEFAULT true,
    voicemail_greeting_url TEXT,
    voicemail_transcription_enabled BOOLEAN DEFAULT true,
    voicemail_email_notifications BOOLEAN DEFAULT true,
    voicemail_sms_notifications BOOLEAN DEFAULT false,
    voicemail_notification_recipients UUID[] DEFAULT ARRAY[]::UUID[],

    -- Call recording
    record_calls BOOLEAN DEFAULT false,
    recording_channels TEXT DEFAULT 'single' CHECK (recording_channels IN ('single', 'dual')),

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id)
);

-- Indexes for call_routing_rules
CREATE INDEX idx_call_routing_rules_company_id ON call_routing_rules(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_call_routing_rules_priority ON call_routing_rules(priority DESC) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_call_routing_rules_type ON call_routing_rules(routing_type) WHERE deleted_at IS NULL;

-- =====================================================================================
-- Table: voicemails
-- Description: Stores voicemail messages
-- =====================================================================================
CREATE TABLE IF NOT EXISTS voicemails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Associated records
    communication_id UUID REFERENCES communications(id) ON DELETE CASCADE,
    phone_number_id UUID REFERENCES phone_numbers(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

    -- Voicemail details
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    duration INTEGER, -- Duration in seconds

    -- Audio file
    audio_url TEXT, -- Supabase Storage URL or Telnyx URL
    audio_format TEXT DEFAULT 'mp3',

    -- Transcription
    transcription TEXT,
    transcription_confidence DECIMAL(3, 2), -- 0.00 to 1.00

    -- Telnyx data
    telnyx_call_control_id TEXT,
    telnyx_recording_id TEXT,

    -- Status
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,

    -- Notifications
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,

    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB,

    -- Audit fields
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    read_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(id)
);

-- Indexes for voicemails
CREATE INDEX idx_voicemails_company_id ON voicemails(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_voicemails_customer_id ON voicemails(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_voicemails_phone_number_id ON voicemails(phone_number_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_voicemails_is_read ON voicemails(is_read) WHERE deleted_at IS NULL;
CREATE INDEX idx_voicemails_received_at ON voicemails(received_at DESC) WHERE deleted_at IS NULL;

-- =====================================================================================
-- Extend communications table with Telnyx fields
-- =====================================================================================
ALTER TABLE communications
ADD COLUMN IF NOT EXISTS telnyx_call_control_id TEXT,
ADD COLUMN IF NOT EXISTS telnyx_call_session_id TEXT,
ADD COLUMN IF NOT EXISTS telnyx_message_id TEXT,
ADD COLUMN IF NOT EXISTS call_answered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS call_ended_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS hangup_cause TEXT,
ADD COLUMN IF NOT EXISTS hangup_source TEXT,
ADD COLUMN IF NOT EXISTS recording_channels TEXT CHECK (recording_channels IN ('single', 'dual')),
ADD COLUMN IF NOT EXISTS answering_machine_detected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_number_id UUID REFERENCES phone_numbers(id) ON DELETE SET NULL;

-- Indexes for new communications fields
CREATE INDEX IF NOT EXISTS idx_communications_telnyx_call_control_id ON communications(telnyx_call_control_id) WHERE telnyx_call_control_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_communications_telnyx_message_id ON communications(telnyx_message_id) WHERE telnyx_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_communications_phone_number_id ON communications(phone_number_id) WHERE phone_number_id IS NOT NULL;

-- =====================================================================================
-- Table: ivr_menus
-- Description: Stores IVR menu configurations
-- =====================================================================================
CREATE TABLE IF NOT EXISTS ivr_menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    call_routing_rule_id UUID REFERENCES call_routing_rules(id) ON DELETE CASCADE,

    -- Menu details
    name TEXT NOT NULL,
    description TEXT,

    -- Menu structure
    greeting_text TEXT,
    greeting_audio_url TEXT,
    use_text_to_speech BOOLEAN DEFAULT true,
    voice TEXT DEFAULT 'female' CHECK (voice IN ('male', 'female')),
    language TEXT DEFAULT 'en-US',

    -- Menu options
    options JSONB NOT NULL DEFAULT '[]'::JSONB,
    -- Example: [
    --   {"digit": "1", "action": "transfer", "destination": "+15551234567", "description": "Sales"},
    --   {"digit": "2", "action": "voicemail", "description": "Leave a message"},
    --   {"digit": "0", "action": "operator", "user_id": "uuid", "description": "Operator"}
    -- ]

    -- Behavior
    max_retries INTEGER DEFAULT 3,
    retry_message TEXT,
    invalid_option_message TEXT,
    timeout_seconds INTEGER DEFAULT 10,
    timeout_action TEXT DEFAULT 'repeat' CHECK (timeout_action IN ('repeat', 'voicemail', 'hangup', 'transfer')),

    -- Parent menu for nested IVRs
    parent_menu_id UUID REFERENCES ivr_menus(id) ON DELETE SET NULL,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- Indexes for ivr_menus
CREATE INDEX idx_ivr_menus_company_id ON ivr_menus(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ivr_menus_routing_rule_id ON ivr_menus(call_routing_rule_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_ivr_menus_parent_id ON ivr_menus(parent_menu_id) WHERE deleted_at IS NULL;

-- =====================================================================================
-- Table: team_availability
-- Description: Real-time team member availability for call routing
-- =====================================================================================
CREATE TABLE IF NOT EXISTS team_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Availability status
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'away', 'do_not_disturb', 'offline')),

    -- Call handling
    can_receive_calls BOOLEAN DEFAULT true,
    max_concurrent_calls INTEGER DEFAULT 1,
    current_calls_count INTEGER DEFAULT 0,

    -- Schedule
    schedule JSONB, -- Custom availability schedule

    -- Timestamps
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_call_at TIMESTAMP WITH TIME ZONE,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one record per user per company
    UNIQUE(company_id, user_id)
);

-- Indexes for team_availability
CREATE INDEX idx_team_availability_company_id ON team_availability(company_id);
CREATE INDEX idx_team_availability_user_id ON team_availability(user_id);
CREATE INDEX idx_team_availability_status ON team_availability(status) WHERE can_receive_calls = true;

-- =====================================================================================
-- Row Level Security (RLS) Policies
-- =====================================================================================

-- Enable RLS on all tables
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE voicemails ENABLE ROW LEVEL SECURITY;
ALTER TABLE ivr_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_availability ENABLE ROW LEVEL SECURITY;

-- phone_numbers policies
CREATE POLICY "Users can view phone numbers for their company" ON phone_numbers
    FOR SELECT USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage phone numbers" ON phone_numbers
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        AND (
            SELECT role FROM users WHERE id = auth.uid()
        ) IN ('owner', 'admin')
    );

-- call_routing_rules policies
CREATE POLICY "Users can view routing rules for their company" ON call_routing_rules
    FOR SELECT USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage routing rules" ON call_routing_rules
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        AND (
            SELECT role FROM users WHERE id = auth.uid()
        ) IN ('owner', 'admin', 'manager')
    );

-- voicemails policies
CREATE POLICY "Users can view voicemails for their company" ON voicemails
    FOR SELECT USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update voicemails for their company" ON voicemails
    FOR UPDATE USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "System can insert voicemails" ON voicemails
    FOR INSERT WITH CHECK (true); -- Webhooks need to insert, verified by API key

-- ivr_menus policies
CREATE POLICY "Users can view IVR menus for their company" ON ivr_menus
    FOR SELECT USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage IVR menus" ON ivr_menus
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        AND (
            SELECT role FROM users WHERE id = auth.uid()
        ) IN ('owner', 'admin', 'manager')
    );

-- team_availability policies
CREATE POLICY "Users can view team availability for their company" ON team_availability
    FOR SELECT USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own availability" ON team_availability
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage team availability" ON team_availability
    FOR ALL USING (
        company_id = (SELECT company_id FROM users WHERE id = auth.uid())
        AND (
            SELECT role FROM users WHERE id = auth.uid()
        ) IN ('owner', 'admin', 'manager')
    );

-- =====================================================================================
-- Functions and Triggers
-- =====================================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_phone_numbers_updated_at BEFORE UPDATE ON phone_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_call_routing_rules_updated_at BEFORE UPDATE ON call_routing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voicemails_updated_at BEFORE UPDATE ON voicemails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ivr_menus_updated_at BEFORE UPDATE ON ivr_menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_availability_updated_at BEFORE UPDATE ON team_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- Comments for documentation
-- =====================================================================================

COMMENT ON TABLE phone_numbers IS 'Company-owned phone numbers from Telnyx with routing and usage tracking';
COMMENT ON TABLE call_routing_rules IS 'Rules for routing incoming calls (business hours, round-robin, IVR, etc.)';
COMMENT ON TABLE voicemails IS 'Voicemail messages with transcription and notification tracking';
COMMENT ON TABLE ivr_menus IS 'Interactive Voice Response (IVR) menu configurations';
COMMENT ON TABLE team_availability IS 'Real-time team member availability status for call routing';

COMMENT ON COLUMN phone_numbers.features IS 'Array of enabled features: sms, mms, voice, fax';
COMMENT ON COLUMN call_routing_rules.business_hours IS 'JSON structure defining business hours per day of week';
COMMENT ON COLUMN call_routing_rules.ivr_menu IS 'IVR menu structure with options and actions';
COMMENT ON COLUMN ivr_menus.options IS 'Array of IVR menu options with digit, action, and destination';
