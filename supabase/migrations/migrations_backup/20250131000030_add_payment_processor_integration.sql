-- ============================================================================
-- PAYMENT PROCESSOR INTEGRATION MIGRATION
-- ============================================================================
-- Migration: 20250131000030_add_payment_processor_integration
-- Description: Adds support for multiple payment processors (Adyen, Plaid, etc.)
--              for high-value contractor payments without Stripe limitations
-- Date: 2025-01-31
-- ============================================================================

-- ============================================================================
-- 1. PAYMENT PROCESSOR TYPES
-- ============================================================================

CREATE TYPE payment_processor_type AS ENUM (
  'stripe',           -- For platform billing (subscriptions)
  'adyen',            -- For high-value contractor payments (card-present, ACH)
  'plaid',            -- For bank account linking and ACH
  'profitstars',      -- For ACH/check processing (Jack Henry)
  'manual'            -- Manual payment recording
);

CREATE TYPE payment_processor_status AS ENUM (
  'pending',          -- Onboarding in progress
  'active',           -- Fully configured and active
  'suspended',        -- Temporarily suspended
  'inactive'          -- Deactivated
);

CREATE TYPE payment_channel AS ENUM (
  'online',           -- Web/mobile payments
  'card_present',     -- In-field card readers
  'tap_to_pay',       -- Tap-to-Pay on iPhone/Android
  'ach',              -- ACH bank transfers
  'wire',             -- Wire transfers
  'check'             -- Check processing
);

-- ============================================================================
-- 2. COMPANY PAYMENT PROCESSOR CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS company_payment_processors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Processor Selection
  processor_type payment_processor_type NOT NULL,
  status payment_processor_status NOT NULL DEFAULT 'pending',
  
  -- Adyen Configuration (for Platforms)
  adyen_account_id TEXT,                    -- Adyen account ID
  adyen_api_key_encrypted TEXT,             -- Encrypted API key
  adyen_merchant_account TEXT,              -- Merchant account ID
  adyen_webhook_username TEXT,
  adyen_webhook_password_encrypted TEXT,
  adyen_live_mode BOOLEAN DEFAULT false,
  
  -- Plaid Configuration (for ACH)
  plaid_client_id TEXT,
  plaid_secret_encrypted TEXT,
  plaid_environment VARCHAR(20) DEFAULT 'sandbox', -- 'sandbox' | 'development' | 'production'
  
  -- ProfitStars/Jack Henry Configuration
  profitstars_merchant_id TEXT,
  profitstars_api_key_encrypted TEXT,
  profitstars_routing_number TEXT,
  
  -- Trust & Risk Settings
  trust_score DECIMAL(5,2) DEFAULT 50.00,   -- 0-100 trust score
  max_payment_amount INTEGER DEFAULT 100000, -- Max single payment in cents ($1,000 default)
  max_daily_volume INTEGER DEFAULT 1000000,  -- Max daily volume in cents ($10,000 default)
  requires_approval_above INTEGER DEFAULT 50000, -- Require approval above this amount (cents)
  
  -- KYC/Onboarding Status
  kyc_status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'in_review' | 'approved' | 'rejected'
  kyc_submitted_at TIMESTAMPTZ,
  kyc_approved_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  
  -- Device Configuration (for card-present)
  supports_card_readers BOOLEAN DEFAULT false,
  supports_tap_to_pay BOOLEAN DEFAULT false,
  device_ids TEXT[],                         -- Array of device IDs
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(company_id, processor_type)
);

-- ============================================================================
-- 3. PAYMENT PROCESSOR TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_processor_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Processor Information
  processor_type payment_processor_type NOT NULL,
  processor_transaction_id TEXT NOT NULL,    -- External transaction ID
  processor_reference TEXT,                  -- Additional reference
  
  -- Transaction Details
  channel payment_channel NOT NULL,
  amount INTEGER NOT NULL,                   -- In cents
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Risk & Trust
  risk_score DECIMAL(5,2),                   -- Processor's risk score
  trust_level VARCHAR(20),                   -- 'low' | 'medium' | 'high' | 'trusted'
  flagged_for_review BOOLEAN DEFAULT false,
  review_reason TEXT,
  
  -- Processing Details
  status VARCHAR(50) NOT NULL,               -- 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
  failure_code TEXT,
  failure_message TEXT,
  
  -- Fees
  processor_fee INTEGER DEFAULT 0,            -- In cents
  net_amount INTEGER,                       -- Amount after fees
  
  -- Metadata from processor
  processor_metadata JSONB DEFAULT '{}'::jsonb,
  processor_response JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Indexes
  UNIQUE(processor_type, processor_transaction_id)
);

-- ============================================================================
-- 4. PAYMENT TRUST SCORES
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_trust_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Trust Metrics
  overall_score DECIMAL(5,2) NOT NULL DEFAULT 50.00, -- 0-100
  
  -- Payment History Metrics
  total_payments_count INTEGER DEFAULT 0,
  total_payments_volume INTEGER DEFAULT 0,  -- In cents
  successful_payments_count INTEGER DEFAULT 0,
  failed_payments_count INTEGER DEFAULT 0,
  refund_rate DECIMAL(5,2) DEFAULT 0.00,   -- Percentage
  
  -- Time-based Metrics
  account_age_days INTEGER DEFAULT 0,
  days_since_last_payment INTEGER,
  average_payment_amount INTEGER DEFAULT 0,  -- In cents
  largest_payment_amount INTEGER DEFAULT 0,   -- In cents
  
  -- Risk Indicators
  chargeback_count INTEGER DEFAULT 0,
  dispute_count INTEGER DEFAULT 0,
  flagged_transactions_count INTEGER DEFAULT 0,
  
  -- Business Verification
  business_verified BOOLEAN DEFAULT false,
  bank_account_verified BOOLEAN DEFAULT false,
  identity_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(company_id)
);

-- ============================================================================
-- 5. PAYMENT PROCESSOR WEBHOOKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_processor_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Webhook Details
  processor_type payment_processor_type NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_id TEXT NOT NULL,                   -- External event ID
  
  -- Payload
  payload JSONB NOT NULL,
  signature TEXT,                            -- Webhook signature for verification
  
  -- Processing Status
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamps
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(processor_type, event_id)
);

-- ============================================================================
-- 6. INDEXES
-- ============================================================================

CREATE INDEX idx_company_payment_processors_company_id ON company_payment_processors(company_id);
CREATE INDEX idx_company_payment_processors_type ON company_payment_processors(processor_type);
CREATE INDEX idx_company_payment_processors_status ON company_payment_processors(status);

CREATE INDEX idx_payment_processor_transactions_payment_id ON payment_processor_transactions(payment_id);
CREATE INDEX idx_payment_processor_transactions_company_id ON payment_processor_transactions(company_id);
CREATE INDEX idx_payment_processor_transactions_processor ON payment_processor_transactions(processor_type, processor_transaction_id);
CREATE INDEX idx_payment_processor_transactions_status ON payment_processor_transactions(status);
CREATE INDEX idx_payment_processor_transactions_flagged ON payment_processor_transactions(flagged_for_review) WHERE flagged_for_review = true;

CREATE INDEX idx_payment_trust_scores_company_id ON payment_trust_scores(company_id);
CREATE INDEX idx_payment_trust_scores_score ON payment_trust_scores(overall_score);

CREATE INDEX idx_payment_processor_webhooks_company_id ON payment_processor_webhooks(company_id);
CREATE INDEX idx_payment_processor_webhooks_processor ON payment_processor_webhooks(processor_type, event_type);
CREATE INDEX idx_payment_processor_webhooks_processed ON payment_processor_webhooks(processed) WHERE processed = false;

-- ============================================================================
-- 7. RLS POLICIES
-- ============================================================================

-- Company Payment Processors
ALTER TABLE company_payment_processors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's payment processors"
  ON company_payment_processors FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their company's payment processors"
  ON company_payment_processors FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM team_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin', 'finance_manager')
    )
  );

-- Payment Processor Transactions
ALTER TABLE payment_processor_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's processor transactions"
  ON payment_processor_transactions FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Payment Trust Scores
ALTER TABLE payment_trust_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's trust scores"
  ON payment_trust_scores FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Payment Processor Webhooks
ALTER TABLE payment_processor_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage webhooks"
  ON payment_processor_webhooks FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_processor_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_company_payment_processors_updated_at
  BEFORE UPDATE ON company_payment_processors
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_processor_updated_at();

CREATE TRIGGER update_payment_processor_transactions_updated_at
  BEFORE UPDATE ON payment_processor_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_processor_updated_at();

CREATE TRIGGER update_payment_trust_scores_updated_at
  BEFORE UPDATE ON payment_trust_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_processor_updated_at();

-- ============================================================================
-- 9. INITIAL TRUST SCORE FOR EXISTING COMPANIES
-- ============================================================================

-- Create trust scores for existing companies
INSERT INTO payment_trust_scores (company_id, overall_score, created_at, updated_at)
SELECT 
  id,
  50.00, -- Default starting score
  NOW(),
  NOW()
FROM companies
WHERE id NOT IN (SELECT company_id FROM payment_trust_scores);


