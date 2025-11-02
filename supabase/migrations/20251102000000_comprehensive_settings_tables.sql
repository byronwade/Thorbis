-- ============================================================================
-- COMPREHENSIVE SETTINGS SYSTEM MIGRATION
-- Created: 2025-11-02
-- Purpose: Add all settings tables for Thorbis platform
-- ============================================================================

-- ============================================================================
-- 1. COMPANY SETTINGS (extend existing)
-- ============================================================================

-- Add missing fields to companies table
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS legal_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS license_number VARCHAR(100);

-- Add company feed settings
ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS company_feed_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS feed_visibility VARCHAR(20) DEFAULT 'all_team' CHECK (feed_visibility IN ('all_team', 'managers_only', 'admins_only'));

-- ============================================================================
-- 2. COMMUNICATION SETTINGS
-- ============================================================================

-- Email Settings
CREATE TABLE IF NOT EXISTS communication_email_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- SMTP Configuration
    smtp_enabled BOOLEAN DEFAULT false,
    smtp_host VARCHAR(255),
    smtp_port INTEGER,
    smtp_username VARCHAR(255),
    smtp_password_encrypted TEXT,
    smtp_from_email VARCHAR(255),
    smtp_from_name VARCHAR(255),
    smtp_use_tls BOOLEAN DEFAULT true,

    -- Email Preferences
    default_signature TEXT,
    auto_cc_enabled BOOLEAN DEFAULT false,
    auto_cc_email VARCHAR(255),
    track_opens BOOLEAN DEFAULT true,
    track_clicks BOOLEAN DEFAULT true,

    -- Branding
    email_logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS Settings
CREATE TABLE IF NOT EXISTS communication_sms_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Provider Configuration
    provider VARCHAR(50) DEFAULT 'telnyx' CHECK (provider IN ('telnyx', 'twilio', 'other')),
    provider_api_key_encrypted TEXT,
    sender_number VARCHAR(20),

    -- SMS Preferences
    auto_reply_enabled BOOLEAN DEFAULT false,
    auto_reply_message TEXT,
    opt_out_message TEXT DEFAULT 'Reply STOP to unsubscribe',

    -- Compliance
    include_opt_out BOOLEAN DEFAULT true,
    consent_required BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone Settings
CREATE TABLE IF NOT EXISTS communication_phone_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Call Routing
    routing_strategy VARCHAR(50) DEFAULT 'round_robin' CHECK (routing_strategy IN ('round_robin', 'skills_based', 'priority', 'simultaneous')),
    fallback_number VARCHAR(20),
    business_hours_only BOOLEAN DEFAULT false,

    -- Voicemail
    voicemail_enabled BOOLEAN DEFAULT true,
    voicemail_greeting_url TEXT,
    voicemail_email_notifications BOOLEAN DEFAULT true,
    voicemail_transcription_enabled BOOLEAN DEFAULT false,

    -- Call Recording
    recording_enabled BOOLEAN DEFAULT false,
    recording_announcement TEXT DEFAULT 'This call may be recorded for quality assurance',
    recording_consent_required BOOLEAN DEFAULT true,

    -- IVR
    ivr_enabled BOOLEAN DEFAULT false,
    ivr_menu JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication Templates
CREATE TABLE IF NOT EXISTS communication_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'voice')),
    category VARCHAR(100),

    -- Template Content
    subject VARCHAR(500), -- For emails
    body TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Array of available variables like {{customer_name}}

    -- Metadata
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    use_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, name, type)
);

-- Notification Settings (company-wide defaults)
CREATE TABLE IF NOT EXISTS communication_notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Job Notifications
    notify_new_jobs BOOLEAN DEFAULT true,
    notify_job_updates BOOLEAN DEFAULT true,
    notify_job_completions BOOLEAN DEFAULT true,

    -- Customer Notifications
    notify_new_customers BOOLEAN DEFAULT false,
    notify_customer_updates BOOLEAN DEFAULT false,

    -- Invoice Notifications
    notify_invoice_sent BOOLEAN DEFAULT true,
    notify_invoice_paid BOOLEAN DEFAULT true,
    notify_invoice_overdue BOOLEAN DEFAULT true,

    -- Estimate Notifications
    notify_estimate_sent BOOLEAN DEFAULT true,
    notify_estimate_approved BOOLEAN DEFAULT true,
    notify_estimate_declined BOOLEAN DEFAULT false,

    -- Schedule Notifications
    notify_schedule_changes BOOLEAN DEFAULT true,
    notify_technician_assigned BOOLEAN DEFAULT true,

    -- Communication Channels
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    in_app_notifications BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. CUSTOMER SETTINGS
-- ============================================================================

-- Customer Preferences Settings
CREATE TABLE IF NOT EXISTS customer_preference_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Contact Preferences
    default_contact_method VARCHAR(20) DEFAULT 'email' CHECK (default_contact_method IN ('email', 'sms', 'phone', 'app')),
    allow_marketing_emails BOOLEAN DEFAULT true,
    allow_marketing_sms BOOLEAN DEFAULT false,

    -- Customer Experience
    request_feedback BOOLEAN DEFAULT true,
    feedback_delay_hours INTEGER DEFAULT 24,
    send_appointment_reminders BOOLEAN DEFAULT true,
    reminder_hours_before INTEGER DEFAULT 24,

    -- Tags and Categories
    require_service_address BOOLEAN DEFAULT true,
    auto_tag_customers BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Fields (per company)
CREATE TABLE IF NOT EXISTS customer_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    field_name VARCHAR(100) NOT NULL,
    field_key VARCHAR(100) NOT NULL, -- snake_case identifier
    field_type VARCHAR(50) NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'boolean', 'select', 'multi_select', 'textarea')),
    field_options JSONB, -- For select/multi_select types

    is_required BOOLEAN DEFAULT false,
    show_in_list BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, field_key)
);

-- Loyalty Program Settings
CREATE TABLE IF NOT EXISTS customer_loyalty_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Program Status
    loyalty_enabled BOOLEAN DEFAULT false,
    program_name VARCHAR(100) DEFAULT 'Loyalty Rewards',

    -- Points System
    points_per_dollar_spent DECIMAL(10, 2) DEFAULT 1.00,
    points_per_referral INTEGER DEFAULT 100,
    points_expiry_days INTEGER, -- NULL = no expiry

    -- Rewards
    reward_tiers JSONB DEFAULT '[]', -- Array of {points_required, discount_percentage, reward_name}

    -- Settings
    auto_apply_rewards BOOLEAN DEFAULT false,
    notify_on_points_earned BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Privacy Settings
CREATE TABLE IF NOT EXISTS customer_privacy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Data Retention
    data_retention_years INTEGER DEFAULT 7,
    auto_delete_inactive_customers BOOLEAN DEFAULT false,
    inactive_threshold_years INTEGER DEFAULT 3,

    -- Consent
    require_marketing_consent BOOLEAN DEFAULT true,
    require_data_processing_consent BOOLEAN DEFAULT true,

    -- Privacy Policy
    privacy_policy_url TEXT,
    terms_of_service_url TEXT,

    -- GDPR/CCPA Compliance
    enable_right_to_deletion BOOLEAN DEFAULT true,
    enable_data_export BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Portal Settings
CREATE TABLE IF NOT EXISTS customer_portal_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Portal Access
    portal_enabled BOOLEAN DEFAULT false,
    require_account_approval BOOLEAN DEFAULT false,

    -- Features
    allow_booking BOOLEAN DEFAULT true,
    allow_invoice_payment BOOLEAN DEFAULT true,
    allow_estimate_approval BOOLEAN DEFAULT true,
    show_service_history BOOLEAN DEFAULT true,
    show_invoices BOOLEAN DEFAULT true,
    show_estimates BOOLEAN DEFAULT true,
    allow_messaging BOOLEAN DEFAULT true,

    -- Branding
    portal_logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    welcome_message TEXT,

    -- Notifications
    notify_on_new_invoice BOOLEAN DEFAULT true,
    notify_on_new_estimate BOOLEAN DEFAULT true,
    notify_on_appointment BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Intake Settings
CREATE TABLE IF NOT EXISTS customer_intake_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Required Fields
    require_phone BOOLEAN DEFAULT true,
    require_email BOOLEAN DEFAULT true,
    require_address BOOLEAN DEFAULT true,
    require_property_type BOOLEAN DEFAULT false,

    -- Custom Intake Form
    custom_questions JSONB DEFAULT '[]', -- Array of {question, type, required, options}

    -- Lead Source Tracking
    track_lead_source BOOLEAN DEFAULT true,
    require_lead_source BOOLEAN DEFAULT false,

    -- Automation
    auto_assign_technician BOOLEAN DEFAULT false,
    auto_create_job BOOLEAN DEFAULT false,
    send_welcome_email BOOLEAN DEFAULT true,
    welcome_email_template_id UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. SCHEDULE SETTINGS
-- ============================================================================

-- Schedule Availability Settings
CREATE TABLE IF NOT EXISTS schedule_availability_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Working Hours (company-wide defaults)
    default_work_hours JSONB NOT NULL DEFAULT '{
        "monday": {"start": "08:00", "end": "17:00", "enabled": true},
        "tuesday": {"start": "08:00", "end": "17:00", "enabled": true},
        "wednesday": {"start": "08:00", "end": "17:00", "enabled": true},
        "thursday": {"start": "08:00", "end": "17:00", "enabled": true},
        "friday": {"start": "08:00", "end": "17:00", "enabled": true},
        "saturday": {"start": "08:00", "end": "12:00", "enabled": false},
        "sunday": {"start": null, "end": null, "enabled": false}
    }',

    -- Appointment Duration
    default_appointment_duration_minutes INTEGER DEFAULT 60,
    buffer_time_minutes INTEGER DEFAULT 15,

    -- Booking Windows
    min_booking_notice_hours INTEGER DEFAULT 24,
    max_booking_advance_days INTEGER DEFAULT 90,

    -- Break Times
    lunch_break_enabled BOOLEAN DEFAULT true,
    lunch_break_start TIME DEFAULT '12:00',
    lunch_break_duration_minutes INTEGER DEFAULT 60,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Settings
CREATE TABLE IF NOT EXISTS schedule_calendar_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- View Preferences
    default_view VARCHAR(20) DEFAULT 'week' CHECK (default_view IN ('day', 'week', 'month', 'timeline')),
    start_day_of_week INTEGER DEFAULT 0 CHECK (start_day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
    time_slot_duration_minutes INTEGER DEFAULT 30,

    -- Display Options
    show_technician_colors BOOLEAN DEFAULT true,
    show_job_status_colors BOOLEAN DEFAULT true,
    show_travel_time BOOLEAN DEFAULT true,
    show_customer_name BOOLEAN DEFAULT true,
    show_job_type BOOLEAN DEFAULT true,

    -- Integration
    sync_with_google_calendar BOOLEAN DEFAULT false,
    sync_with_outlook BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispatch Rules
CREATE TABLE IF NOT EXISTS schedule_dispatch_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    rule_name VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,

    -- Conditions
    conditions JSONB NOT NULL DEFAULT '{}', -- {job_type, priority_level, skill_required, etc.}

    -- Assignment Logic
    assignment_method VARCHAR(50) DEFAULT 'auto' CHECK (assignment_method IN ('auto', 'manual', 'round_robin', 'closest_technician', 'skill_based')),

    -- Actions
    actions JSONB DEFAULT '{}', -- {notify_method, auto_confirm, buffer_time, etc.}

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, rule_name)
);

-- Service Areas
CREATE TABLE IF NOT EXISTS schedule_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    area_name VARCHAR(100) NOT NULL,
    area_type VARCHAR(20) DEFAULT 'zip_code' CHECK (area_type IN ('zip_code', 'radius', 'polygon', 'city', 'state')),

    -- Area Definition
    zip_codes TEXT[], -- For zip_code type
    center_lat DECIMAL(10, 7), -- For radius type
    center_lng DECIMAL(10, 7), -- For radius type
    radius_miles INTEGER, -- For radius type
    polygon_coordinates JSONB, -- For polygon type (array of lat/lng pairs)

    -- Service Details
    service_fee DECIMAL(10, 2) DEFAULT 0,
    minimum_job_amount DECIMAL(10, 2),
    estimated_travel_time_minutes INTEGER,

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, area_name)
);

-- Team Scheduling Rules
CREATE TABLE IF NOT EXISTS schedule_team_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Workload Management
    max_jobs_per_day INTEGER DEFAULT 8,
    max_jobs_per_week INTEGER DEFAULT 40,
    allow_overtime BOOLEAN DEFAULT false,

    -- Scheduling Preferences
    prefer_same_technician BOOLEAN DEFAULT true, -- For repeat customers
    balance_workload BOOLEAN DEFAULT true,

    -- Travel Optimization
    optimize_for_travel_time BOOLEAN DEFAULT true,
    max_travel_time_minutes INTEGER DEFAULT 60,

    -- Breaks
    require_breaks BOOLEAN DEFAULT true,
    break_after_hours INTEGER DEFAULT 4,
    break_duration_minutes INTEGER DEFAULT 15,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. TEAM SETTINGS
-- ============================================================================

-- Department Settings (extend departments table if needed)
CREATE TABLE IF NOT EXISTS team_department_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Department Structure
    require_department_assignment BOOLEAN DEFAULT false,
    allow_multiple_departments BOOLEAN DEFAULT false,

    -- Hierarchy
    enable_department_hierarchy BOOLEAN DEFAULT false,
    require_department_head BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. PROFILE/USER SETTINGS (per-user preferences)
-- ============================================================================

-- User Notification Preferences (individual user settings)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Email Notifications
    email_new_jobs BOOLEAN DEFAULT true,
    email_job_updates BOOLEAN DEFAULT true,
    email_mentions BOOLEAN DEFAULT true,
    email_messages BOOLEAN DEFAULT true,

    -- Push Notifications
    push_new_jobs BOOLEAN DEFAULT true,
    push_job_updates BOOLEAN DEFAULT true,
    push_mentions BOOLEAN DEFAULT true,
    push_messages BOOLEAN DEFAULT true,

    -- SMS Notifications
    sms_urgent_jobs BOOLEAN DEFAULT false,
    sms_schedule_changes BOOLEAN DEFAULT false,

    -- In-App Notifications
    in_app_all BOOLEAN DEFAULT true,

    -- Frequency
    digest_enabled BOOLEAN DEFAULT false,
    digest_frequency VARCHAR(20) DEFAULT 'daily' CHECK (digest_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Display Preferences
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    time_format VARCHAR(10) DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),

    -- Dashboard Preferences
    default_dashboard_view VARCHAR(50),
    show_welcome_banner BOOLEAN DEFAULT true,

    -- Table/List Preferences
    default_page_size INTEGER DEFAULT 25 CHECK (default_page_size IN (10, 25, 50, 100)),

    -- Calendar Preferences
    calendar_view VARCHAR(20) DEFAULT 'week',
    calendar_start_day INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. WORK SETTINGS
-- ============================================================================

-- Job Settings
CREATE TABLE IF NOT EXISTS job_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Job Number Format
    job_number_prefix VARCHAR(10) DEFAULT 'JOB',
    job_number_format VARCHAR(50) DEFAULT '{PREFIX}-{YYYY}{MM}{DD}-{XXXX}',
    next_job_number INTEGER DEFAULT 1,

    -- Defaults
    default_job_status VARCHAR(50) DEFAULT 'scheduled',
    default_priority VARCHAR(20) DEFAULT 'normal',
    require_customer_signature BOOLEAN DEFAULT false,
    require_photo_completion BOOLEAN DEFAULT false,

    -- Automations
    auto_invoice_on_completion BOOLEAN DEFAULT false,
    auto_send_completion_email BOOLEAN DEFAULT true,

    -- Tracking
    track_technician_time BOOLEAN DEFAULT true,
    require_arrival_confirmation BOOLEAN DEFAULT false,
    require_completion_notes BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estimate Settings
CREATE TABLE IF NOT EXISTS estimate_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Estimate Number Format
    estimate_number_prefix VARCHAR(10) DEFAULT 'EST',
    estimate_number_format VARCHAR(50) DEFAULT '{PREFIX}-{YYYY}{MM}{DD}-{XXXX}',
    next_estimate_number INTEGER DEFAULT 1,

    -- Validity
    default_valid_for_days INTEGER DEFAULT 30,
    show_expiry_date BOOLEAN DEFAULT true,

    -- Content
    include_terms_and_conditions BOOLEAN DEFAULT true,
    default_terms TEXT,
    show_payment_terms BOOLEAN DEFAULT true,

    -- Pricing
    allow_discounts BOOLEAN DEFAULT true,
    show_individual_prices BOOLEAN DEFAULT true,
    show_subtotals BOOLEAN DEFAULT true,
    show_tax_breakdown BOOLEAN DEFAULT true,

    -- Workflow
    require_approval BOOLEAN DEFAULT false,
    auto_convert_to_job BOOLEAN DEFAULT false,
    send_reminder_enabled BOOLEAN DEFAULT true,
    reminder_days_before_expiry INTEGER DEFAULT 7,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Settings
CREATE TABLE IF NOT EXISTS invoice_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Invoice Number Format
    invoice_number_prefix VARCHAR(10) DEFAULT 'INV',
    invoice_number_format VARCHAR(50) DEFAULT '{PREFIX}-{YYYY}{MM}{DD}-{XXXX}',
    next_invoice_number INTEGER DEFAULT 1,

    -- Payment Terms
    default_payment_terms INTEGER DEFAULT 30, -- Days
    payment_terms_options INTEGER[] DEFAULT ARRAY[0, 15, 30, 60, 90],

    -- Late Fees
    late_fee_enabled BOOLEAN DEFAULT false,
    late_fee_type VARCHAR(20) DEFAULT 'percentage' CHECK (late_fee_type IN ('percentage', 'flat')),
    late_fee_amount DECIMAL(10, 2) DEFAULT 5.00,
    late_fee_grace_period_days INTEGER DEFAULT 7,

    -- Content
    include_terms_and_conditions BOOLEAN DEFAULT true,
    default_terms TEXT,
    show_payment_instructions BOOLEAN DEFAULT true,
    payment_instructions TEXT,

    -- Tax Settings
    tax_enabled BOOLEAN DEFAULT true,
    default_tax_rate DECIMAL(5, 2) DEFAULT 0,
    tax_label VARCHAR(50) DEFAULT 'Sales Tax',

    -- Reminders
    send_reminders BOOLEAN DEFAULT true,
    reminder_schedule INTEGER[] DEFAULT ARRAY[7, 14, 30], -- Days after due date

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Plan Settings
CREATE TABLE IF NOT EXISTS service_plan_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Plan Management
    allow_multiple_plans_per_customer BOOLEAN DEFAULT false,
    require_contract_signature BOOLEAN DEFAULT true,

    -- Billing
    auto_renew_enabled BOOLEAN DEFAULT true,
    renewal_notice_days INTEGER DEFAULT 30,
    auto_invoice_on_renewal BOOLEAN DEFAULT true,

    -- Service Scheduling
    auto_schedule_services BOOLEAN DEFAULT true,
    schedule_advance_days INTEGER DEFAULT 7,
    send_reminder_before_service BOOLEAN DEFAULT true,
    reminder_days INTEGER DEFAULT 3,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricebook Settings
CREATE TABLE IF NOT EXISTS pricebook_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Pricing
    show_cost_prices BOOLEAN DEFAULT true, -- Show cost to technicians
    markup_default_percentage DECIMAL(5, 2) DEFAULT 50.00,

    -- Catalog
    require_categories BOOLEAN DEFAULT true,
    allow_custom_items BOOLEAN DEFAULT true,
    require_approval_for_custom BOOLEAN DEFAULT false,

    -- Display
    show_item_codes BOOLEAN DEFAULT true,
    show_item_descriptions BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. BOOKING SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS booking_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Online Booking
    online_booking_enabled BOOLEAN DEFAULT false,
    require_account BOOLEAN DEFAULT false,

    -- Booking Options
    available_services JSONB DEFAULT '[]', -- Array of service IDs or types
    require_service_selection BOOLEAN DEFAULT true,
    show_pricing BOOLEAN DEFAULT true,
    allow_time_preferences BOOLEAN DEFAULT true,

    -- Confirmation
    require_immediate_payment BOOLEAN DEFAULT false,
    send_confirmation_email BOOLEAN DEFAULT true,
    send_confirmation_sms BOOLEAN DEFAULT false,

    -- Restrictions
    min_booking_notice_hours INTEGER DEFAULT 24,
    max_bookings_per_day INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. TAG SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS tag_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Tag Management
    allow_custom_tags BOOLEAN DEFAULT true,
    require_tag_approval BOOLEAN DEFAULT false,
    max_tags_per_item INTEGER DEFAULT 10,

    -- Tag Colors
    use_color_coding BOOLEAN DEFAULT true,
    auto_assign_colors BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. CHECKLIST SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS checklist_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Checklist Management
    require_checklist_completion BOOLEAN DEFAULT false,
    allow_skip_items BOOLEAN DEFAULT true,
    require_photos_for_checklist BOOLEAN DEFAULT false,

    -- Templates
    default_template_id UUID,
    auto_assign_by_job_type BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. LEAD SOURCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- e.g., 'online', 'referral', 'advertising', 'organic'
    is_active BOOLEAN DEFAULT true,

    -- Tracking
    total_leads INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5, 2),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, name)
);

-- ============================================================================
-- 12. DATA IMPORT/EXPORT SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_import_export_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Import Settings
    allow_bulk_import BOOLEAN DEFAULT true,
    require_import_approval BOOLEAN DEFAULT false,
    auto_deduplicate BOOLEAN DEFAULT true,

    -- Export Settings
    default_export_format VARCHAR(20) DEFAULT 'csv' CHECK (default_export_format IN ('csv', 'excel', 'json', 'pdf')),
    include_metadata BOOLEAN DEFAULT true,

    -- Scheduling
    auto_export_enabled BOOLEAN DEFAULT false,
    auto_export_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly'
    auto_export_email VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE communication_email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_sms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_phone_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preference_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_intake_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_availability_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_calendar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_dispatch_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_team_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_department_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_plan_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricebook_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_import_export_settings ENABLE ROW LEVEL SECURITY;

-- Create a helper function for checking company membership
CREATE OR REPLACE FUNCTION is_company_member(company_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id = company_uuid
    AND team_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for company settings tables (SELECT, INSERT, UPDATE)
DO $$
DECLARE
  table_name TEXT;
  company_tables TEXT[] := ARRAY[
    'communication_email_settings',
    'communication_sms_settings',
    'communication_phone_settings',
    'communication_templates',
    'communication_notification_settings',
    'customer_preference_settings',
    'customer_custom_fields',
    'customer_loyalty_settings',
    'customer_privacy_settings',
    'customer_portal_settings',
    'customer_intake_settings',
    'schedule_availability_settings',
    'schedule_calendar_settings',
    'schedule_dispatch_rules',
    'schedule_service_areas',
    'schedule_team_rules',
    'team_department_settings',
    'job_settings',
    'estimate_settings',
    'invoice_settings',
    'service_plan_settings',
    'pricebook_settings',
    'booking_settings',
    'tag_settings',
    'checklist_settings',
    'lead_sources',
    'data_import_export_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY company_tables
  LOOP
    -- SELECT policy
    EXECUTE format('
      CREATE POLICY %I ON %I
      FOR SELECT
      USING (is_company_member(company_id))
    ', table_name || '_select', table_name);

    -- INSERT policy
    EXECUTE format('
      CREATE POLICY %I ON %I
      FOR INSERT
      WITH CHECK (is_company_member(company_id))
    ', table_name || '_insert', table_name);

    -- UPDATE policy
    EXECUTE format('
      CREATE POLICY %I ON %I
      FOR UPDATE
      USING (is_company_member(company_id))
      WITH CHECK (is_company_member(company_id))
    ', table_name || '_update', table_name);

    -- DELETE policy
    EXECUTE format('
      CREATE POLICY %I ON %I
      FOR DELETE
      USING (is_company_member(company_id))
    ', table_name || '_delete', table_name);
  END LOOP;
END $$;

-- RLS Policies for user-specific settings
CREATE POLICY user_notification_preferences_select ON user_notification_preferences
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY user_notification_preferences_insert ON user_notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY user_notification_preferences_update ON user_notification_preferences
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY user_notification_preferences_delete ON user_notification_preferences
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY user_preferences_select ON user_preferences
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY user_preferences_insert ON user_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY user_preferences_update ON user_preferences
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY user_preferences_delete ON user_preferences
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Company ID indexes (most queries will filter by company_id)
CREATE INDEX IF NOT EXISTS idx_comm_email_company ON communication_email_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_sms_company ON communication_sms_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_phone_company ON communication_phone_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_templates_company ON communication_templates(company_id);
CREATE INDEX IF NOT EXISTS idx_comm_notif_company ON communication_notification_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_pref_company ON customer_preference_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_fields_company ON customer_custom_fields(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_loyalty_company ON customer_loyalty_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_privacy_company ON customer_privacy_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_portal_company ON customer_portal_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_cust_intake_company ON customer_intake_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_sched_avail_company ON schedule_availability_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_sched_cal_company ON schedule_calendar_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_sched_dispatch_company ON schedule_dispatch_rules(company_id);
CREATE INDEX IF NOT EXISTS idx_sched_areas_company ON schedule_service_areas(company_id);
CREATE INDEX IF NOT EXISTS idx_sched_team_company ON schedule_team_rules(company_id);
CREATE INDEX IF NOT EXISTS idx_team_dept_company ON team_department_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_job_settings_company ON job_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_est_settings_company ON estimate_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_inv_settings_company ON invoice_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_sp_settings_company ON service_plan_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_pb_settings_company ON pricebook_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_booking_settings_company ON booking_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_tag_settings_company ON tag_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_checklist_settings_company ON checklist_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_lead_sources_company ON lead_sources(company_id);
CREATE INDEX IF NOT EXISTS idx_data_ie_company ON data_import_export_settings(company_id);

-- User ID indexes
CREATE INDEX IF NOT EXISTS idx_user_notif_pref_user ON user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pref_user ON user_preferences(user_id);

-- Template filtering indexes
CREATE INDEX IF NOT EXISTS idx_comm_templates_type ON communication_templates(type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_comm_templates_category ON communication_templates(category) WHERE is_active = true;

-- Service area lookups
CREATE INDEX IF NOT EXISTS idx_service_areas_active ON schedule_service_areas(is_active);

-- ============================================================================
-- TRIGGER FOR updated_at TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all settings tables
DO $$
DECLARE
  table_name TEXT;
  all_tables TEXT[] := ARRAY[
    'communication_email_settings',
    'communication_sms_settings',
    'communication_phone_settings',
    'communication_templates',
    'communication_notification_settings',
    'customer_preference_settings',
    'customer_custom_fields',
    'customer_loyalty_settings',
    'customer_privacy_settings',
    'customer_portal_settings',
    'customer_intake_settings',
    'schedule_availability_settings',
    'schedule_calendar_settings',
    'schedule_dispatch_rules',
    'schedule_service_areas',
    'schedule_team_rules',
    'team_department_settings',
    'user_notification_preferences',
    'user_preferences',
    'job_settings',
    'estimate_settings',
    'invoice_settings',
    'service_plan_settings',
    'pricebook_settings',
    'booking_settings',
    'tag_settings',
    'checklist_settings',
    'lead_sources',
    'data_import_export_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY all_tables
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
  END LOOP;
END $$;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE communication_email_settings IS 'Company-wide email configuration and preferences';
COMMENT ON TABLE communication_sms_settings IS 'Company-wide SMS configuration and preferences';
COMMENT ON TABLE communication_phone_settings IS 'Company-wide phone, call routing, and voicemail settings';
COMMENT ON TABLE communication_templates IS 'Reusable communication templates for email, SMS, and voice';
COMMENT ON TABLE communication_notification_settings IS 'Company-wide default notification preferences';
COMMENT ON TABLE customer_preference_settings IS 'Customer experience and contact preference defaults';
COMMENT ON TABLE customer_custom_fields IS 'Company-defined custom fields for customer records';
COMMENT ON TABLE customer_loyalty_settings IS 'Loyalty program configuration and rewards';
COMMENT ON TABLE customer_privacy_settings IS 'Privacy policy and data retention settings';
COMMENT ON TABLE customer_portal_settings IS 'Customer portal access and feature configuration';
COMMENT ON TABLE customer_intake_settings IS 'New customer intake form and automation settings';
COMMENT ON TABLE schedule_availability_settings IS 'Company-wide scheduling and availability configuration';
COMMENT ON TABLE schedule_calendar_settings IS 'Calendar view and display preferences';
COMMENT ON TABLE schedule_dispatch_rules IS 'Automated job assignment and dispatch logic';
COMMENT ON TABLE schedule_service_areas IS 'Geographic service areas with travel times and fees';
COMMENT ON TABLE schedule_team_rules IS 'Team workload and scheduling constraints';
COMMENT ON TABLE team_department_settings IS 'Department structure and hierarchy settings';
COMMENT ON TABLE user_notification_preferences IS 'Individual user notification channel preferences';
COMMENT ON TABLE user_preferences IS 'Individual user display and localization preferences';
COMMENT ON TABLE job_settings IS 'Job numbering, workflow, and tracking configuration';
COMMENT ON TABLE estimate_settings IS 'Estimate numbering, content, and workflow configuration';
COMMENT ON TABLE invoice_settings IS 'Invoice numbering, payment terms, and late fee configuration';
COMMENT ON TABLE service_plan_settings IS 'Recurring service plan and maintenance contract settings';
COMMENT ON TABLE pricebook_settings IS 'Pricebook catalog and pricing display preferences';
COMMENT ON TABLE booking_settings IS 'Online booking availability and requirements';
COMMENT ON TABLE tag_settings IS 'Tag management and organization preferences';
COMMENT ON TABLE checklist_settings IS 'Checklist template and completion requirements';
COMMENT ON TABLE lead_sources IS 'Marketing lead source tracking and attribution';
COMMENT ON TABLE data_import_export_settings IS 'Bulk data import/export preferences and scheduling';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
