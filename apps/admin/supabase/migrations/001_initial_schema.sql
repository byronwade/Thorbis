-- ============================================================================
-- ADMIN DATABASE INITIAL SCHEMA
-- ============================================================================
-- This creates the core tables for the Thorbis Admin Dashboard
-- Run this in the ADMIN Supabase project (iwudmixxoozwskgolqlz)
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
-- Separate authentication for admin users (not using Supabase Auth)
-- Only Thorbis/Stratos employees with verified accounts

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'support' CHECK (role IN ('super_admin', 'admin', 'support')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  failed_login_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for email lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- ============================================================================
-- ADMIN SESSIONS TABLE
-- ============================================================================
-- JWT session tracking for admin users

CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

-- Index for session lookups
CREATE INDEX idx_admin_sessions_user ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token_hash);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- ============================================================================
-- COMPANIES REGISTRY TABLE
-- ============================================================================
-- Platform-level view of all companies (synced from web database)
-- This is the admin's view of companies for management purposes

CREATE TABLE companies_registry (
  id UUID PRIMARY KEY,  -- Matches web.companies.id
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_email TEXT,
  owner_name TEXT,
  plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'churned', 'deleted')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  mrr_cents INTEGER DEFAULT 0,  -- Monthly Recurring Revenue in cents
  employee_count INTEGER DEFAULT 1,
  industry TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_companies_registry_status ON companies_registry(status);
CREATE INDEX idx_companies_registry_plan ON companies_registry(plan);
CREATE INDEX idx_companies_registry_created ON companies_registry(created_at DESC);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Billing and subscription management

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies_registry(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscriptions_company ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- ============================================================================
-- SUPPORT TICKETS TABLE
-- ============================================================================
-- Customer support ticket tracking

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies_registry(id) ON DELETE SET NULL,
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_customer', 'waiting_on_us', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category TEXT CHECK (category IN ('billing', 'technical', 'feature_request', 'bug', 'account', 'other')),
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_support_tickets_company ON support_tickets(company_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_created ON support_tickets(created_at DESC);

-- ============================================================================
-- SUPPORT TICKET MESSAGES TABLE
-- ============================================================================
-- Messages/replies in support tickets

CREATE TABLE support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'admin', 'system')),
  sender_id UUID,  -- admin_user_id if admin, null if customer
  sender_email TEXT,
  sender_name TEXT,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,  -- Internal notes not visible to customer
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ticket_messages_ticket ON support_ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created ON support_ticket_messages(created_at);

-- ============================================================================
-- ADMIN AUDIT LOGS TABLE
-- ============================================================================
-- Comprehensive audit trail for admin actions

CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_audit_logs_admin ON admin_audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON admin_audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON admin_audit_logs(created_at DESC);

-- ============================================================================
-- PLATFORM SETTINGS TABLE
-- ============================================================================
-- Global platform configuration

CREATE TABLE platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- EMAIL CAMPAIGNS TABLE (moved from web)
-- ============================================================================
-- Marketing email campaign management

CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  from_name TEXT,
  from_email TEXT,
  reply_to TEXT,
  html_content TEXT,
  text_content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'canceled')),
  campaign_type TEXT DEFAULT 'marketing' CHECK (campaign_type IN ('marketing', 'announcement', 'product_update', 'newsletter')),
  audience_filter JSONB DEFAULT '{}',  -- Filter criteria for recipients
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_campaigns_scheduled ON email_campaigns(scheduled_at);

-- ============================================================================
-- EMAIL CAMPAIGN SENDS TABLE
-- ============================================================================
-- Individual email sends tracking

CREATE TABLE email_campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  recipient_company_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,
  resend_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_campaign_sends_campaign ON email_campaign_sends(campaign_id);
CREATE INDEX idx_campaign_sends_email ON email_campaign_sends(recipient_email);
CREATE INDEX idx_campaign_sends_status ON email_campaign_sends(status);

-- ============================================================================
-- EMAIL CAMPAIGN LINKS TABLE
-- ============================================================================
-- Link click tracking for campaigns

CREATE TABLE email_campaign_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  send_id UUID REFERENCES email_campaign_sends(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Indexes
CREATE INDEX idx_campaign_links_campaign ON email_campaign_links(campaign_id);
CREATE INDEX idx_campaign_links_send ON email_campaign_links(send_id);

-- ============================================================================
-- EMAIL SUPPRESSIONS TABLE
-- ============================================================================
-- Unsubscribed/bounced emails

CREATE TABLE email_suppressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('unsubscribe', 'bounce', 'complaint', 'manual')),
  source_campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_email_suppressions_email ON email_suppressions(email);

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================
-- Waitlist signups for new features/launches

CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company_name TEXT,
  phone TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'converted', 'declined')),
  notes TEXT,
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Automatically update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_registry_updated_at BEFORE UPDATE ON companies_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Enable RLS on all tables (policies will use service role, so these are for safety)

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Service role bypass policy (for admin app using service role key)
-- This allows the admin app to access all data when using the service role key

CREATE POLICY "Service role has full access" ON admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON admin_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON companies_registry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON support_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON support_ticket_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON admin_audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON platform_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON email_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON email_campaign_sends FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON email_campaign_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON email_suppressions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role has full access" ON waitlist FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED INITIAL SUPER ADMIN
-- ============================================================================
-- Password: Admin123! (hashed with pgcrypto)
-- IMPORTANT: Change this password immediately after first login!

INSERT INTO admin_users (email, password_hash, full_name, role, is_active, email_verified)
VALUES (
  'admin@thorbis.com',
  crypt('Admin123!', gen_salt('bf', 12)),
  'Super Admin',
  'super_admin',
  true,
  true
);

-- ============================================================================
-- SEED PLATFORM SETTINGS
-- ============================================================================

INSERT INTO platform_settings (key, value, description) VALUES
  ('maintenance_mode', 'false', 'Enable/disable platform maintenance mode'),
  ('signup_enabled', 'true', 'Enable/disable new signups'),
  ('trial_days', '14', 'Number of days for trial period'),
  ('default_plan', '"starter"', 'Default plan for new signups');
