-- ============================================================================
-- VENDORS TABLE MIGRATION
-- ============================================================================
-- Migration: 20250212000000_add_vendors_table
-- Description: Adds vendors table and updates purchase_orders table with vendor_id
-- Author: Claude Code (AI Assistant)
-- Date: 2025-02-12
--
-- This migration:
-- - Creates vendors table for vendor management
-- - Adds vendor_id to purchase_orders table
-- - Adds indexes for performance
-- - Adds RLS policies for vendors table
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE VENDORS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Core fields
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  vendor_number TEXT NOT NULL,
  
  -- Contact information
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  website TEXT,
  
  -- Address
  address TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Business information
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'net_30',
  credit_limit INTEGER DEFAULT 0, -- In cents
  preferred_payment_method TEXT, -- 'check' | 'ach' | 'credit_card' | 'wire'
  
  -- Classification
  category TEXT, -- 'supplier' | 'distributor' | 'manufacturer' | 'service_provider' | 'other'
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'inactive'
  
  -- Metadata
  notes TEXT,
  internal_notes TEXT,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: ADD VENDOR_ID TO PURCHASE_ORDERS TABLE
-- ============================================================================

-- Add vendor_id column (nullable to support existing records)
ALTER TABLE purchase_orders 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;

-- ============================================================================
-- SECTION 3: CREATE INDEXES
-- ============================================================================

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_company_id ON vendors(company_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_number ON vendors(vendor_number) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email) WHERE deleted_at IS NULL AND email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category) WHERE deleted_at IS NULL;

-- Purchase orders vendor_id index
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id) WHERE vendor_id IS NOT NULL;

-- ============================================================================
-- SECTION 4: CREATE UNIQUE CONSTRAINT
-- ============================================================================

-- Vendor number should be unique per company
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendors_company_vendor_number 
ON vendors(company_id, vendor_number) 
WHERE deleted_at IS NULL;

-- ============================================================================
-- SECTION 5: CREATE TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_vendors_updated_at();

-- ============================================================================
-- SECTION 6: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 7: CREATE RLS POLICIES
-- ============================================================================

-- Policy: Users can view vendors in their company
CREATE POLICY "Users can view vendors in their company"
ON vendors FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
  AND deleted_at IS NULL
);

-- Policy: Users can insert vendors in their company
CREATE POLICY "Users can insert vendors in their company"
ON vendors FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Policy: Users can update vendors in their company
CREATE POLICY "Users can update vendors in their company"
ON vendors FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Policy: Users can delete (soft delete) vendors in their company
CREATE POLICY "Users can delete vendors in their company"
ON vendors FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM team_members
    WHERE user_id = auth.uid() AND status = 'active'
  )
  AND deleted_at IS NOT NULL
);

-- ============================================================================
-- SECTION 8: ADD CHECK CONSTRAINTS
-- ============================================================================

-- Status constraint
ALTER TABLE vendors ADD CONSTRAINT check_vendors_status 
CHECK (status IN ('active', 'inactive'));

-- Payment terms constraint
ALTER TABLE vendors ADD CONSTRAINT check_vendors_payment_terms
CHECK (payment_terms IN ('net_15', 'net_30', 'net_60', 'due_on_receipt', 'custom') OR payment_terms IS NULL);

-- Preferred payment method constraint
ALTER TABLE vendors ADD CONSTRAINT check_vendors_preferred_payment_method
CHECK (preferred_payment_method IN ('check', 'ach', 'credit_card', 'wire') OR preferred_payment_method IS NULL);

-- Category constraint
ALTER TABLE vendors ADD CONSTRAINT check_vendors_category
CHECK (category IN ('supplier', 'distributor', 'manufacturer', 'service_provider', 'other') OR category IS NULL);

-- Credit limit constraint
ALTER TABLE vendors ADD CONSTRAINT check_vendors_credit_limit
CHECK (credit_limit >= 0);

-- ============================================================================
-- SECTION 9: COMMENTS
-- ============================================================================

COMMENT ON TABLE vendors IS 'Vendor management table for tracking supplier information';
COMMENT ON COLUMN vendors.vendor_number IS 'Unique vendor number per company';
COMMENT ON COLUMN vendors.credit_limit IS 'Credit limit in cents';
COMMENT ON COLUMN vendors.tags IS 'Array of tag strings for categorization';
COMMENT ON COLUMN vendors.custom_fields IS 'JSON object for custom vendor fields';

