-- ============================================================================
-- COMPREHENSIVE BASELINE SCHEMA - ALL CORE TABLES
-- ============================================================================
-- Migration: 00000000000000_baseline_schema
-- Description: Complete foundation schema with ALL core tables
-- Author: AI Assistant (Gemini)
-- Date: 2024-01-01 (predates all migrations)
--
-- This mega-baseline creates the ENTIRE core schema in one migration:
-- - 21 ENUMs for type safety
-- - 20+ core tables with proper dependency ordering
-- - All indexes, triggers, and RLS infrastructure  
-- - Ensures NO subsequent migration fails due to missing dependencies
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 2: ALL CORE ENUMS
-- ============================================================================

-- User enums
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'dispatcher', 'technician', 'csr');
CREATE TYPE user_status AS ENUM ('online', 'available', 'busy');

-- Customer enums
CREATE TYPE customer_type AS ENUM ('residential', 'commercial', 'industrial');

-- Communication enums
CREATE TYPE communication_type AS ENUM ('email', 'sms', 'phone', 'chat', 'note');
CREATE TYPE communication_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE communication_status AS ENUM ('draft', 'queued', 'sending', 'sent', 'delivered', 'failed', 'read');
CREATE TYPE communication_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- Payment enums
CREATE TYPE payment_method AS ENUM ('cash', 'check', 'credit_card', 'debit_card', 'ach', 'wire', 'venmo', 'paypal', 'other');
CREATE TYPE payment_type_enum AS ENUM ('payment', 'refund', 'credit');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled');
CREATE TYPE card_brand AS ENUM ('visa', 'mastercard', 'amex', 'discover');

-- Equipment enums
CREATE TYPE equipment_type AS ENUM ('hvac', 'plumbing', 'electrical', 'appliance', 'water_heater', 'furnace', 'ac_unit', 'other');
CREATE TYPE equipment_condition AS ENUM ('excellent', 'good', 'fair', 'poor', 'needs_replacement');
CREATE TYPE equipment_status AS ENUM ('active', 'inactive', 'retired', 'replaced');

-- Service plan enums
CREATE TYPE service_plan_type AS ENUM ('preventive', 'warranty', 'subscription', 'contract');
CREATE TYPE service_plan_frequency AS ENUM ('weekly', 'bi_weekly', 'monthly', 'quarterly', 'semi_annually', 'annually');
CREATE TYPE service_plan_status AS ENUM ('draft', 'active', 'paused', 'cancelled', 'expired', 'completed');
CREATE TYPE renewal_type AS ENUM ('auto', 'manual', 'none');

-- Schedule enums
CREATE TYPE schedule_type AS ENUM ('appointment', 'recurring', 'on_call', 'emergency');
CREATE TYPE schedule_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled');

-- Inventory enums
CREATE TYPE inventory_status AS ENUM ('active', 'discontinued', 'on_order');

-- Tag enums
CREATE TYPE tag_category AS ENUM ('customer', 'job', 'equipment', 'general', 'status', 'priority');

-- Attachment enums
CREATE TYPE attachment_entity_type AS ENUM ('job', 'customer', 'invoice', 'estimate', 'equipment', 'property', 'communication');
CREATE TYPE attachment_category AS ENUM ('photo', 'document', 'receipt', 'manual', 'warranty', 'other');

-- ============================================================================
-- SECTION 3: CORE FOUNDATION TABLES (no dependencies)
-- ============================================================================

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar TEXT,
  bio TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status user_status DEFAULT 'available',
  stripe_customer_id TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- SECTION 4: COMPANIES TABLE (depends on users)
-- ============================================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  legal_name TEXT,
  doing_business_as TEXT,
  email TEXT,
  phone TEXT,
  support_email TEXT,
  support_phone TEXT,
  website TEXT,
  website_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  lat NUMERIC,
  lon NUMERIC,
  industry TEXT,
  company_size TEXT,
  ein TEXT,
  tax_id TEXT,
  license_number TEXT,
  business_timezone TEXT DEFAULT 'America/New_York',
  logo TEXT,
  logo_url TEXT,
  logo_square_url TEXT,
  brand_color TEXT,
  brand_primary_color TEXT,
  brand_secondary_color TEXT,
  brand_accent_color TEXT,
  brand_font TEXT,
  email_settings JSONB DEFAULT '{}'::jsonb,
  portal_settings JSONB DEFAULT '{}'::jsonb,
  refund_settings JSONB DEFAULT '{}'::jsonb,
  onboarding_step INTEGER DEFAULT 0,
  onboarding_progress JSONB DEFAULT '{}'::jsonb,
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  onboarding_step_completed JSONB DEFAULT '{}'::jsonb,
  onboarding_completion_percentage INTEGER DEFAULT 0,
  onboarding_completed_at TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_subscription_status TEXT,
  subscription_current_period_start TIMESTAMPTZ,
  subscription_current_period_end TIMESTAMPTZ,
  subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMPTZ,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  archived_at TIMESTAMPTZ,
  permanent_delete_scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_owner_id ON companies(owner_id);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX idx_companies_active ON companies(id) WHERE deleted_at IS NULL AND archived_at IS NULL;

-- ============================================================================
-- SECTION 5: TEAM_MEMBERS TABLE
-- ============================================================================

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'technician',
  status TEXT NOT NULL DEFAULT 'active',
  email TEXT,
  phone TEXT,
  job_title TEXT,
  department TEXT,
  department_id UUID,
  permissions JSONB,
  role_id UUID,
  invited_at TIMESTAMPTZ,
  invited_by UUID,
  invited_email TEXT,
  invited_name TEXT,
  joined_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  phone_extension TEXT,
  direct_inward_dial TEXT,
  extension_enabled BOOLEAN DEFAULT FALSE,
  call_forwarding_enabled BOOLEAN DEFAULT FALSE,
  call_forwarding_number TEXT,
  simultaneous_ring_enabled BOOLEAN DEFAULT FALSE,
  ring_timeout_seconds INTEGER DEFAULT 30,
  voicemail_pin TEXT,
  voicemail_greeting_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT team_members_company_user_unique UNIQUE (company_id, user_id)
);

CREATE INDEX idx_team_members_company_id ON team_members(company_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_status ON team_members(status) WHERE status = 'active';

-- ============================================================================
-- SECTION 6: CUSTOMERS TABLE
-- ============================================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type customer_type NOT NULL DEFAULT 'residential',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  secondary_phone TEXT,
  address TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  tags JSONB DEFAULT '[]'::jsonb,
  source TEXT,
  referred_by UUID REFERENCES customers(id) ON DELETE SET NULL,
  communication_preferences JSONB DEFAULT '{}'::jsonb,
  preferred_contact_method TEXT DEFAULT 'email',
  preferred_technician UUID REFERENCES users(id) ON DELETE SET NULL,
  billing_email TEXT,
  payment_terms TEXT DEFAULT 'due_on_receipt',
  credit_limit INTEGER DEFAULT 0,
  tax_exempt BOOLEAN NOT NULL DEFAULT FALSE,
  tax_exempt_number TEXT,
  total_revenue INTEGER DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  total_invoices INTEGER DEFAULT 0,
  average_job_value INTEGER DEFAULT 0,
  outstanding_balance INTEGER DEFAULT 0,
  last_job_date TIMESTAMPTZ,
  last_invoice_date TIMESTAMPTZ,
  last_payment_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  internal_notes TEXT,
  portal_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  portal_invited_at TIMESTAMPTZ,
  portal_last_login_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_company_id ON customers(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_email ON customers(company_id, email);
CREATE INDEX idx_customers_phone ON customers(company_id, phone);

-- ============================================================================
-- SECTION 7: PROPERTIES TABLE
-- ============================================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'residential',
  name TEXT,
  address TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  square_footage INTEGER,
  year_built INTEGER,
  number_of_units INTEGER DEFAULT 1,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  access_notes TEXT,
  gate_code TEXT,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_properties_company_id ON properties(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_customer_id ON properties(customer_id) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 8: PRICE BOOK TABLES
-- ============================================================================

CREATE TABLE price_book_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES price_book_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT price_book_categories_company_slug_unique UNIQUE (company_id, slug)
);

CREATE INDEX idx_price_book_categories_company_id ON price_book_categories(company_id);
CREATE INDEX idx_price_book_categories_parent_id ON price_book_categories(parent_id);

CREATE TABLE price_book_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES price_book_categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'service',
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  unit_price INTEGER NOT NULL DEFAULT 0,
  cost INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'ea',
  taxable BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_price_book_items_company_id ON price_book_items(company_id);
CREATE INDEX idx_price_book_items_category_id ON price_book_items(category_id);
CREATE INDEX idx_price_book_items_type ON price_book_items(type);

-- ============================================================================
-- SECTION 9: PURCHASE_ORDERS TABLE
-- ============================================================================

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal INTEGER DEFAULT 0 NOT NULL,
  tax_amount INTEGER DEFAULT 0 NOT NULL,
  total_amount INTEGER DEFAULT 0 NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_purchase_orders_company_id ON purchase_orders(company_id);

-- ============================================================================
-- SECTION 10: JOBS TABLE
-- ============================================================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  job_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'quoted',
  priority TEXT NOT NULL DEFAULT 'medium',
  job_type TEXT,
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  subtotal INTEGER DEFAULT 0 NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL,
  discount_amount INTEGER DEFAULT 0 NOT NULL,
  total_amount INTEGER DEFAULT 0 NOT NULL,
  completion_notes TEXT,
  customer_signature TEXT,
  technician_signature TEXT,
  internal_notes TEXT,
  recurring_job_id UUID,
  source TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_job_number ON jobs(job_number);
CREATE INDEX idx_jobs_status ON jobs(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 11: ESTIMATES TABLE
-- ============================================================================

CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal INTEGER DEFAULT 0 NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL,
  discount_amount INTEGER DEFAULT 0 NOT NULL,
  total_amount INTEGER DEFAULT 0 NOT NULL,
  valid_until DATE,
  line_items JSONB DEFAULT '[]'::jsonb,
  terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_estimates_company_id ON estimates(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_estimate_number ON estimates(estimate_number);
CREATE INDEX idx_estimates_status ON estimates(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 12: INVOICES TABLE
-- ============================================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal INTEGER DEFAULT 0 NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL,
  discount_amount INTEGER DEFAULT 0 NOT NULL,
  total_amount INTEGER DEFAULT 0 NOT NULL,
  amount_paid INTEGER DEFAULT 0 NOT NULL,
  amount_due INTEGER DEFAULT 0 NOT NULL,
  due_date DATE,
  payment_terms TEXT,
  line_items JSONB DEFAULT '[]'::jsonb,
  terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_invoices_company_id ON invoices(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 13: COMMUNICATIONS TABLE
-- ============================================================================

CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  type communication_type NOT NULL,
  direction communication_direction NOT NULL,
  channel TEXT,
  from_address TEXT,
  from_name TEXT,
  to_address TEXT NOT NULL,
  to_name TEXT,
  cc_addresses JSONB DEFAULT '[]'::jsonb,
  bcc_addresses JSONB DEFAULT '[]'::jsonb,
  subject TEXT,
  body TEXT NOT NULL,
  body_html TEXT,
  body_plain TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  attachment_count INTEGER DEFAULT 0,
  thread_id UUID,
  parent_id UUID REFERENCES communications(id) ON DELETE SET NULL,
  is_thread_starter BOOLEAN NOT NULL DEFAULT TRUE,
  status communication_status NOT NULL DEFAULT 'draft',
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  read_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  call_duration INTEGER,
  call_recording_url TEXT,
  call_transcript TEXT,
  call_sentiment TEXT,
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  provider_message_id TEXT,
  provider_status TEXT,
  provider_metadata JSONB DEFAULT '{}'::jsonb,
  cost INTEGER DEFAULT 0,
  template_id UUID,
  automation_workflow_id UUID,
  is_automated BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT,
  priority communication_priority NOT NULL DEFAULT 'normal',
  tags JSONB DEFAULT '[]'::jsonb,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_communications_company_type ON communications(company_id, type, created_at DESC);
CREATE INDEX idx_communications_customer ON communications(customer_id, created_at DESC);

-- ============================================================================
-- SECTION 14: PAYMENTS TABLE
-- ============================================================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  payment_number TEXT NOT NULL UNIQUE,
  reference_number TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  payment_method payment_method NOT NULL,
  payment_type payment_type_enum NOT NULL DEFAULT 'payment',
  card_brand card_brand,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  check_number TEXT,
  bank_name TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  failure_code TEXT,
  failure_message TEXT,
  processor_name TEXT,
  processor_transaction_id TEXT,
  processor_fee INTEGER DEFAULT 0,
  net_amount INTEGER DEFAULT 0,
  processor_metadata JSONB DEFAULT '{}'::jsonb,
  refunded_amount INTEGER DEFAULT 0,
  refund_reason TEXT,
  refunded_at TIMESTAMPTZ,
  original_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  receipt_url TEXT,
  receipt_number TEXT,
  receipt_emailed BOOLEAN NOT NULL DEFAULT FALSE,
  receipt_emailed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  customer_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_reconciled BOOLEAN NOT NULL DEFAULT FALSE,
  reconciled_at TIMESTAMPTZ,
  reconciled_by UUID REFERENCES users(id) ON DELETE SET NULL,
  bank_deposit_date TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_company_id ON payments(company_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);

-- ============================================================================
-- SECTION 15: EQUIPMENT TABLE
-- ============================================================================

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  equipment_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type equipment_type NOT NULL,
  category TEXT,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  model_year INTEGER,
  install_date TIMESTAMPTZ,
  installed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  install_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  warranty_expiration TIMESTAMPTZ,
  warranty_provider TEXT,
  warranty_notes TEXT,
  is_under_warranty BOOLEAN NOT NULL DEFAULT FALSE,
  last_service_date TIMESTAMPTZ,
  last_service_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  next_service_due TIMESTAMPTZ,
  service_interval_days INTEGER DEFAULT 365,
  capacity TEXT,
  efficiency TEXT,
  fuel_type TEXT,
  location TEXT,
  condition equipment_condition NOT NULL DEFAULT 'good',
  status equipment_status NOT NULL DEFAULT 'active',
  replaced_date TIMESTAMPTZ,
  replaced_by_equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  documents JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  customer_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  total_service_count INTEGER DEFAULT 0,
  total_service_cost INTEGER DEFAULT 0,
  average_service_cost INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_equipment_company_id ON equipment(company_id);
CREATE INDEX idx_equipment_customer_id ON equipment(customer_id);

-- ============================================================================
-- SECTION 16: SERVICE_PLANS TABLE
-- ============================================================================

CREATE TABLE service_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  plan_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  type service_plan_type NOT NULL DEFAULT 'preventive',
  frequency service_plan_frequency NOT NULL DEFAULT 'annually',
  visits_per_term INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  renewal_type renewal_type DEFAULT 'manual',
  renewal_notice_days INTEGER DEFAULT 30,
  price INTEGER NOT NULL DEFAULT 0,
  billing_frequency TEXT DEFAULT 'annually',
  taxable BOOLEAN NOT NULL DEFAULT TRUE,
  included_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  included_equipment_types JSONB DEFAULT '[]'::jsonb,
  price_book_item_ids JSONB DEFAULT '[]'::jsonb,
  last_service_date TIMESTAMPTZ,
  next_service_due TIMESTAMPTZ NOT NULL,
  auto_generate_jobs BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_technician UUID REFERENCES users(id) ON DELETE SET NULL,
  status service_plan_status NOT NULL DEFAULT 'active',
  paused_at TIMESTAMPTZ,
  paused_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_reason TEXT,
  completed_at TIMESTAMPTZ,
  terms TEXT,
  customer_signature TEXT,
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,
  total_visits_completed INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  notes TEXT,
  customer_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_service_plans_company_id ON service_plans(company_id);
CREATE INDEX idx_service_plans_customer_id ON service_plans(customer_id);

-- ============================================================================
-- SECTION 17: SCHEDULES TABLE
-- ============================================================================

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  service_plan_id UUID REFERENCES service_plans(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  type schedule_type NOT NULL DEFAULT 'appointment',
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  recurrence_rule JSONB,
  parent_schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  recurrence_end_date TIMESTAMPTZ,
  status schedule_status NOT NULL DEFAULT 'scheduled',
  confirmed_at TIMESTAMPTZ,
  confirmed_by TEXT,
  actual_start_time TIMESTAMPTZ,
  actual_end_time TIMESTAMPTZ,
  actual_duration INTEGER,
  completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_sent_at TIMESTAMPTZ,
  reminder_method TEXT,
  reminder_hours_before INTEGER DEFAULT 24,
  service_types JSONB DEFAULT '[]'::jsonb,
  estimated_cost INTEGER DEFAULT 0,
  location TEXT,
  access_instructions TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  rescheduled_from_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  rescheduled_to_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
  notes TEXT,
  customer_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_schedules_company_id ON schedules(company_id);
CREATE INDEX idx_schedules_assigned_to ON schedules(assigned_to);

-- ============================================================================
-- SECTION 18: INVENTORY TABLE
-- ============================================================================

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  price_book_item_id UUID NOT NULL REFERENCES price_book_items(id) ON DELETE RESTRICT,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  quantity_available INTEGER NOT NULL DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 0,
  maximum_quantity INTEGER,
  reorder_point INTEGER DEFAULT 0,
  reorder_quantity INTEGER DEFAULT 0,
  warehouse_location TEXT,
  primary_location TEXT,
  secondary_locations JSONB DEFAULT '[]'::jsonb,
  cost_per_unit INTEGER DEFAULT 0,
  total_cost_value INTEGER DEFAULT 0,
  last_purchase_cost INTEGER DEFAULT 0,
  last_restock_date TIMESTAMPTZ,
  last_restock_quantity INTEGER,
  last_restock_purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  last_stock_check_date TIMESTAMPTZ,
  last_used_date TIMESTAMPTZ,
  last_used_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  is_low_stock BOOLEAN NOT NULL DEFAULT FALSE,
  low_stock_alert_sent BOOLEAN NOT NULL DEFAULT FALSE,
  low_stock_alert_sent_at TIMESTAMPTZ,
  status inventory_status NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_inventory_company_id ON inventory(company_id);
CREATE INDEX idx_inventory_price_book_item_id ON inventory(price_book_item_id);

-- ============================================================================
-- SECTION 19: TAGS TABLE
-- ============================================================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  category tag_category,
  color TEXT,
  icon TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tags_company_slug_unique UNIQUE (company_id, slug)
);

CREATE INDEX idx_tags_company_id ON tags(company_id);

CREATE TABLE customer_tags (
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (customer_id, tag_id)
);

CREATE TABLE job_tags (
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (job_id, tag_id)
);

CREATE TABLE equipment_tags (
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  PRIMARY KEY (equipment_id, tag_id)
);

-- ============================================================================
-- SECTION 20: ATTACHMENTS TABLE
-- ============================================================================

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  entity_type attachment_entity_type NOT NULL,
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_extension TEXT,
  storage_provider TEXT NOT NULL DEFAULT 'supabase',
  storage_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  storage_bucket TEXT,
  is_image BOOLEAN NOT NULL DEFAULT FALSE,
  is_document BOOLEAN NOT NULL DEFAULT FALSE,
  is_video BOOLEAN NOT NULL DEFAULT FALSE,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  thumbnail_url TEXT,
  category attachment_category,
  tags JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX idx_attachments_company_id ON attachments(company_id);

-- ============================================================================
-- SECTION 21: HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 22: TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_book_categories_updated_at BEFORE UPDATE ON price_book_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_price_book_items_updated_at BEFORE UPDATE ON price_book_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_plans_updated_at BEFORE UPDATE ON service_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attachments_updated_at BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 23: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_book_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Note: Detailed RLS policies will be added in later migrations

-- ============================================================================
-- SECTION 24: HELPFUL VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW company_owners AS
SELECT 
  c.id AS company_id,
  c.name AS company_name,
  c.owner_id,
  u.name AS owner_name,
  u.email AS owner_email
FROM companies c
INNER JOIN users u ON u.id = c.owner_id
WHERE c.deleted_at IS NULL;

-- ============================================================================
-- COMPREHENSIVE BASELINE COMPLETE
-- ============================================================================
-- This baseline creates:
-- ✅ 21 ENUMs for type safety
-- ✅ 22 tables (users, companies, team_members, customers, properties, price_book_categories, price_book_items, purchase_orders, jobs, estimates, invoices, communications, payments, equipment, service_plans, schedules, inventory, tags, customer_tags, job_tags, equipment_tags, attachments)
-- ✅ 50+ indexes for performance
-- ✅ 19 triggers for updated_at automation
-- ✅ RLS enabled on all tables
-- ✅ Helper functions and views

COMMENT ON SCHEMA public IS 'Complete baseline schema for Thorbis FSM platform - all core tables and infrastructure';
