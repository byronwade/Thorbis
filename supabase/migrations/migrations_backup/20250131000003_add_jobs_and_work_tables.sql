-- ============================================================================
-- JOBS AND WORK TABLES MIGRATION
-- ============================================================================
-- Migration: 20250131000003_add_jobs_and_work_tables
-- Description: Adds properties, jobs, estimates, and invoices tables
-- Author: Claude Code (AI Assistant)
-- Date: 2025-01-31
--
-- This migration adds the core work management tables:
-- - properties: Customer service locations
-- - jobs: Work orders/projects
-- - estimates: Price quotes
-- - invoices: Billing documents
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE PROPERTIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  -- Property type
  type TEXT NOT NULL DEFAULT 'residential' CHECK (type IN ('residential', 'commercial', 'industrial', 'mixed_use')),

  -- Address
  name TEXT, -- Optional friendly name (e.g., "Main Office", "Summer Home")
  address TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'USA',

  -- Property details
  square_footage INTEGER,
  year_built INTEGER,
  number_of_units INTEGER DEFAULT 1,

  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  -- Access information
  access_notes TEXT,
  gate_code TEXT,

  -- Metadata
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for properties
CREATE INDEX idx_properties_company_id ON properties(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_customer_id ON properties(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_location ON properties(latitude, longitude) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_is_primary ON properties(customer_id, is_primary) WHERE is_primary = true AND deleted_at IS NULL;

-- ============================================================================
-- SECTION 2: CREATE JOBS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Job identification
  job_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Job classification
  status TEXT NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  job_type TEXT CHECK (job_type IN ('service', 'installation', 'repair', 'maintenance', 'inspection', 'consultation')),

  -- AI-powered auto-tagging fields
  ai_categories JSONB, -- AI-extracted categories: ["HVAC", "Plumbing", "Electrical"]
  ai_equipment JSONB, -- AI-extracted equipment: ["Furnace", "Water Heater"]
  ai_service_type TEXT CHECK (ai_service_type IN ('emergency', 'routine', 'preventive', 'warranty')),
  ai_priority_score INTEGER CHECK (ai_priority_score BETWEEN 0 AND 100),
  ai_tags JSONB, -- AI-generated tags for search/filtering
  ai_processed_at TIMESTAMPTZ, -- When AI last analyzed this job

  -- Scheduling
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,

  -- Financial
  subtotal INTEGER DEFAULT 0 NOT NULL, -- in cents
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  discount_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  total_amount INTEGER DEFAULT 0 NOT NULL, -- in cents

  -- Job completion
  completion_notes TEXT,
  customer_signature TEXT, -- Base64 encoded signature
  technician_signature TEXT, -- Base64 encoded signature

  -- Internal tracking
  internal_notes TEXT,
  recurring_job_id UUID, -- Reference to parent recurring job template
  source TEXT, -- How the job was created: 'manual', 'recurring', 'service_plan', 'customer_portal'

  -- Custom fields
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for jobs
CREATE INDEX idx_jobs_company_id ON jobs(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_property_id ON jobs(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_assigned_to ON jobs(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_status ON jobs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_priority ON jobs(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_scheduled_start ON jobs(scheduled_start) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_job_number ON jobs(job_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC) WHERE deleted_at IS NULL;

-- Full-text search index for jobs
CREATE INDEX idx_jobs_search ON jobs USING GIN(
  to_tsvector('english',
    COALESCE(job_number, '') || ' ' ||
    COALESCE(title, '') || ' ' ||
    COALESCE(description, '')
  )
) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 3: CREATE ESTIMATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,

  -- Estimate identification
  estimate_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),

  -- Financial
  subtotal INTEGER DEFAULT 0 NOT NULL, -- in cents
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  discount_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  total_amount INTEGER DEFAULT 0 NOT NULL, -- in cents

  -- Estimate validity
  valid_until DATE,

  -- Line items (stored as JSONB array)
  line_items JSONB DEFAULT '[]'::jsonb,

  -- Terms and notes
  terms TEXT,
  notes TEXT,
  internal_notes TEXT,

  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,

  -- Custom fields
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for estimates
CREATE INDEX idx_estimates_company_id ON estimates(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_customer_id ON estimates(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_job_id ON estimates(job_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_status ON estimates(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_estimate_number ON estimates(estimate_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 4: CREATE INVOICES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,

  -- Invoice identification
  invoice_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled')),

  -- Financial
  subtotal INTEGER DEFAULT 0 NOT NULL, -- in cents
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  discount_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  total_amount INTEGER DEFAULT 0 NOT NULL, -- in cents
  amount_paid INTEGER DEFAULT 0 NOT NULL, -- in cents
  amount_due INTEGER DEFAULT 0 NOT NULL, -- in cents

  -- Payment terms
  due_date DATE,
  payment_terms TEXT, -- e.g., "Net 30", "Due on receipt"

  -- Line items (stored as JSONB array)
  line_items JSONB DEFAULT '[]'::jsonb,

  -- Terms and notes
  terms TEXT,
  notes TEXT,
  internal_notes TEXT,

  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,

  -- Custom fields
  custom_fields JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for invoices
CREATE INDEX idx_invoices_company_id ON invoices(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_job_id ON invoices(job_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_status ON invoices(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_due_date ON invoices(due_date) WHERE deleted_at IS NULL AND status != 'paid';
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 5: CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Properties RLS policies
CREATE POLICY "Users can view properties in their company"
  ON properties FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert properties in their company"
  ON properties FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update properties in their company"
  ON properties FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete properties in their company"
  ON properties FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Jobs RLS policies
CREATE POLICY "Users can view jobs in their company"
  ON jobs FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert jobs in their company"
  ON jobs FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update jobs in their company"
  ON jobs FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete jobs in their company"
  ON jobs FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Estimates RLS policies
CREATE POLICY "Users can view estimates in their company"
  ON estimates FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert estimates in their company"
  ON estimates FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update estimates in their company"
  ON estimates FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete estimates in their company"
  ON estimates FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Invoices RLS policies
CREATE POLICY "Users can view invoices in their company"
  ON invoices FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert invoices in their company"
  ON invoices FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update invoices in their company"
  ON invoices FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete invoices in their company"
  ON invoices FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
