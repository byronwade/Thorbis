-- Migration: Add Customer Enrichment Data Table
-- Description: Store enriched customer data from external APIs with caching and TTL
-- Author: AI Assistant
-- Date: 2025-02-08

-- Create customer_enrichment_data table
CREATE TABLE IF NOT EXISTS customer_enrichment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Data type classification
  data_type TEXT NOT NULL CHECK (data_type IN ('person', 'business', 'social', 'property', 'combined')),
  
  -- Source provider
  source TEXT NOT NULL, -- e.g., 'clearbit', 'google_places', 'fullcontact', etc.
  
  -- Enrichment data (stored as JSONB for flexibility)
  enrichment_data JSONB NOT NULL,
  
  -- Quality metrics
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  
  -- Caching and expiration
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'failed', 'archived')),
  
  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_customer_enrichment_data_customer_id ON customer_enrichment_data(customer_id);
CREATE INDEX idx_customer_enrichment_data_data_type ON customer_enrichment_data(data_type);
CREATE INDEX idx_customer_enrichment_data_expires_at ON customer_enrichment_data(expires_at);
CREATE INDEX idx_customer_enrichment_data_status ON customer_enrichment_data(status);
CREATE INDEX idx_customer_enrichment_data_source ON customer_enrichment_data(source);

-- Composite index for common queries
CREATE INDEX idx_customer_enrichment_data_customer_type_status 
  ON customer_enrichment_data(customer_id, data_type, status);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_customer_enrichment_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_enrichment_data_updated_at
  BEFORE UPDATE ON customer_enrichment_data
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_enrichment_data_updated_at();

-- Add automatic status update trigger based on expiration
CREATE OR REPLACE FUNCTION update_enrichment_status_on_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at < NOW() AND NEW.status = 'active' THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrichment_status_before_update
  BEFORE UPDATE ON customer_enrichment_data
  FOR EACH ROW
  EXECUTE FUNCTION update_enrichment_status_on_expiration();

-- Create enrichment usage tracking table for billing/tier management
CREATE TABLE IF NOT EXISTS customer_enrichment_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Usage tracking
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  enrichments_count INTEGER NOT NULL DEFAULT 0,
  enrichments_limit INTEGER, -- NULL = unlimited (enterprise)
  
  -- Cost tracking (in cents)
  api_costs INTEGER DEFAULT 0,
  
  -- Tier information
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Ensure one row per company per month
  UNIQUE(company_id, month_year)
);

-- Add indexes for usage tracking
CREATE INDEX idx_enrichment_usage_company_id ON customer_enrichment_usage(company_id);
CREATE INDEX idx_enrichment_usage_month_year ON customer_enrichment_usage(month_year);

-- Add updated_at trigger for usage table
CREATE TRIGGER update_customer_enrichment_usage_updated_at
  BEFORE UPDATE ON customer_enrichment_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_enrichment_data_updated_at();

-- Function to increment enrichment usage
CREATE OR REPLACE FUNCTION increment_enrichment_usage(
  p_company_id UUID,
  p_api_cost INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
  v_month_year TEXT;
  v_current_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Get current month/year
  v_month_year := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get or create usage record
  INSERT INTO customer_enrichment_usage (company_id, month_year, enrichments_count, api_costs)
  VALUES (p_company_id, v_month_year, 1, p_api_cost)
  ON CONFLICT (company_id, month_year)
  DO UPDATE SET
    enrichments_count = customer_enrichment_usage.enrichments_count + 1,
    api_costs = customer_enrichment_usage.api_costs + p_api_cost,
    updated_at = NOW()
  RETURNING enrichments_count, enrichments_limit INTO v_current_count, v_limit;
  
  -- Check if limit exceeded (NULL limit means unlimited)
  IF v_limit IS NOT NULL AND v_current_count > v_limit THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if company can enrich more customers
CREATE OR REPLACE FUNCTION can_enrich_customer(p_company_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_month_year TEXT;
  v_current_count INTEGER;
  v_limit INTEGER;
BEGIN
  v_month_year := TO_CHAR(NOW(), 'YYYY-MM');
  
  SELECT enrichments_count, enrichments_limit
  INTO v_current_count, v_limit
  FROM customer_enrichment_usage
  WHERE company_id = p_company_id AND month_year = v_month_year;
  
  -- If no record exists, create one and allow
  IF NOT FOUND THEN
    INSERT INTO customer_enrichment_usage (company_id, month_year, enrichments_count)
    VALUES (p_company_id, v_month_year, 0);
    RETURN TRUE;
  END IF;
  
  -- NULL limit means unlimited (enterprise)
  IF v_limit IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if under limit
  RETURN v_current_count < v_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get enrichment statistics
CREATE OR REPLACE FUNCTION get_enrichment_stats(p_company_id UUID)
RETURNS TABLE(
  month_year TEXT,
  enrichments_count INTEGER,
  enrichments_limit INTEGER,
  api_costs INTEGER,
  tier TEXT,
  percentage_used NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.month_year,
    u.enrichments_count,
    u.enrichments_limit,
    u.api_costs,
    u.tier,
    CASE
      WHEN u.enrichments_limit IS NULL THEN 0 -- Unlimited
      WHEN u.enrichments_limit = 0 THEN 100 -- No limit but show 100%
      ELSE ROUND((u.enrichments_count::NUMERIC / u.enrichments_limit::NUMERIC) * 100, 2)
    END as percentage_used
  FROM customer_enrichment_usage u
  WHERE u.company_id = p_company_id
  ORDER BY u.month_year DESC
  LIMIT 12; -- Last 12 months
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on customer_enrichment_data
ALTER TABLE customer_enrichment_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view enrichment data for customers in their company
CREATE POLICY "Users can view enrichment data for their company's customers"
  ON customer_enrichment_data
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      INNER JOIN team_members tm ON tm.company_id = c.company_id
      WHERE c.id = customer_enrichment_data.customer_id
        AND tm.user_id = auth.uid()
    )
  );

-- Policy: Users can insert enrichment data for their company's customers
CREATE POLICY "Users can insert enrichment data for their company's customers"
  ON customer_enrichment_data
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      INNER JOIN team_members tm ON tm.company_id = c.company_id
      WHERE c.id = customer_enrichment_data.customer_id
        AND tm.user_id = auth.uid()
    )
  );

-- Policy: Users can update enrichment data for their company's customers
CREATE POLICY "Users can update enrichment data for their company's customers"
  ON customer_enrichment_data
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      INNER JOIN team_members tm ON tm.company_id = c.company_id
      WHERE c.id = customer_enrichment_data.customer_id
        AND tm.user_id = auth.uid()
    )
  );

-- Policy: Users can delete enrichment data for their company's customers
CREATE POLICY "Users can delete enrichment data for their company's customers"
  ON customer_enrichment_data
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      INNER JOIN team_members tm ON tm.company_id = c.company_id
      WHERE c.id = customer_enrichment_data.customer_id
        AND tm.user_id = auth.uid()
    )
  );

-- Enable RLS on customer_enrichment_usage
ALTER TABLE customer_enrichment_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view usage for their company
CREATE POLICY "Users can view enrichment usage for their company"
  ON customer_enrichment_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = customer_enrichment_usage.company_id
        AND tm.user_id = auth.uid()
    )
  );

-- Policy: Only admins can update usage (for tier changes)
CREATE POLICY "Admins can update enrichment usage for their company"
  ON customer_enrichment_usage
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = customer_enrichment_usage.company_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('owner', 'admin')
    )
  );

-- Add comments for documentation
COMMENT ON TABLE customer_enrichment_data IS 'Stores enriched customer data from external APIs with caching and expiration';
COMMENT ON TABLE customer_enrichment_usage IS 'Tracks enrichment API usage per company for billing and tier management';
COMMENT ON FUNCTION increment_enrichment_usage IS 'Increments enrichment usage counter and returns false if limit exceeded';
COMMENT ON FUNCTION can_enrich_customer IS 'Checks if company has remaining enrichment quota for current month';
COMMENT ON FUNCTION get_enrichment_stats IS 'Returns enrichment usage statistics for a company';

