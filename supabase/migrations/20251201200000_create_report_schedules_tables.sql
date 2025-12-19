-- Create report schedules and notification preferences tables
-- Migration: 20251201200000_create_report_schedules_tables.sql

-- Report Schedules Table
CREATE TABLE IF NOT EXISTS report_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    time VARCHAR(5) NOT NULL, -- HH:MM format
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
    format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'csv', 'excel')) DEFAULT 'pdf',
    include_charts BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    next_run_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    run_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Unique constraint per user per report type
    UNIQUE(company_id, created_by, report_type)
);

-- Report Notification Preferences Table
CREATE TABLE IF NOT EXISTS report_notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_type VARCHAR(100) NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    alerts JSONB NOT NULL DEFAULT '[]'::jsonb,
    channels JSONB NOT NULL DEFAULT '{"inApp": true, "email": true, "sms": false}'::jsonb,
    quiet_hours JSONB NOT NULL DEFAULT '{"enabled": false, "start": "22:00", "end": "08:00"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Unique constraint per user per report type
    UNIQUE(company_id, user_id, report_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_schedules_company_id ON report_schedules(company_id);
CREATE INDEX IF NOT EXISTS idx_report_schedules_created_by ON report_schedules(created_by);
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON report_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_report_schedules_company_report ON report_schedules(company_id, report_type);

CREATE INDEX IF NOT EXISTS idx_report_notification_prefs_company_id ON report_notification_preferences(company_id);
CREATE INDEX IF NOT EXISTS idx_report_notification_prefs_user_id ON report_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_report_notification_prefs_company_report ON report_notification_preferences(company_id, report_type);

-- Enable RLS
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for report_schedules
CREATE POLICY "Users can view their own report schedules"
    ON report_schedules FOR SELECT
    USING (created_by = auth.uid());

CREATE POLICY "Users can create their own report schedules"
    ON report_schedules FOR INSERT
    WITH CHECK (created_by = auth.uid() AND company_id IN (
        SELECT company_id FROM team_members WHERE user_id = auth.uid() AND deleted_at IS NULL
    ));

CREATE POLICY "Users can update their own report schedules"
    ON report_schedules FOR UPDATE
    USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own report schedules"
    ON report_schedules FOR DELETE
    USING (created_by = auth.uid());

-- RLS Policies for report_notification_preferences
CREATE POLICY "Users can view their own notification preferences"
    ON report_notification_preferences FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own notification preferences"
    ON report_notification_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid() AND company_id IN (
        SELECT company_id FROM team_members WHERE user_id = auth.uid() AND deleted_at IS NULL
    ));

CREATE POLICY "Users can update their own notification preferences"
    ON report_notification_preferences FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notification preferences"
    ON report_notification_preferences FOR DELETE
    USING (user_id = auth.uid());

-- Updated at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_report_schedules_updated_at ON report_schedules;
CREATE TRIGGER update_report_schedules_updated_at
    BEFORE UPDATE ON report_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_report_notification_prefs_updated_at ON report_notification_preferences;
CREATE TRIGGER update_report_notification_prefs_updated_at
    BEFORE UPDATE ON report_notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON report_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON report_notification_preferences TO authenticated;
