-- ============================================================================
-- ADD PAYMENT METHOD PERSISTENCE TO COMPANIES TABLE
-- ============================================================================
-- Created: 2025-12-01
-- Purpose: Store payment method details for display in billing UI
--
-- Features:
-- 1. Display "Card ending in XXXX" in billing settings
-- 2. Track payment method type (card, bank account)
-- 3. Store expiration for proactive notifications
-- 4. Enable "Update Payment Method" flows
-- ============================================================================

-- ============================================================================
-- 1. ADD PAYMENT METHOD COLUMNS
-- ============================================================================

-- Stripe payment method ID
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS stripe_payment_method_id TEXT;

-- Payment method display info
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS payment_method_brand TEXT;
-- e.g., "visa", "mastercard", "amex", "discover", "bank_account"

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS payment_method_last4 TEXT;
-- Last 4 digits of card or bank account

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS payment_method_type TEXT DEFAULT 'card';
-- "card" or "us_bank_account"

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS payment_method_exp_month INTEGER;
-- Card expiration month (1-12)

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS payment_method_exp_year INTEGER;
-- Card expiration year (2025, 2026, etc.)

-- Subscription billing period tracking
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ;

ALTER TABLE companies
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

-- ============================================================================
-- 2. ADD INDEX FOR PAYMENT METHOD LOOKUPS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_companies_payment_method
ON companies(stripe_payment_method_id)
WHERE stripe_payment_method_id IS NOT NULL;

-- Index for finding companies with expiring cards
CREATE INDEX IF NOT EXISTS idx_companies_card_expiration
ON companies(payment_method_exp_year, payment_method_exp_month)
WHERE payment_method_type = 'card';

-- ============================================================================
-- 3. FUNCTION TO FIND COMPANIES WITH EXPIRING CARDS
-- ============================================================================

CREATE OR REPLACE FUNCTION find_expiring_payment_methods(
  p_months_ahead INTEGER DEFAULT 1
)
RETURNS TABLE(
  company_id UUID,
  company_name TEXT,
  owner_id UUID,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  months_until_expiry INTEGER
) AS $$
DECLARE
  v_current_month INTEGER;
  v_current_year INTEGER;
  v_target_month INTEGER;
  v_target_year INTEGER;
BEGIN
  v_current_month := EXTRACT(MONTH FROM NOW())::INTEGER;
  v_current_year := EXTRACT(YEAR FROM NOW())::INTEGER;

  -- Calculate target month/year
  v_target_month := v_current_month + p_months_ahead;
  v_target_year := v_current_year;
  IF v_target_month > 12 THEN
    v_target_month := v_target_month - 12;
    v_target_year := v_target_year + 1;
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.owner_id,
    c.payment_method_brand,
    c.payment_method_last4,
    c.payment_method_exp_month,
    c.payment_method_exp_year,
    ((c.payment_method_exp_year - v_current_year) * 12 + c.payment_method_exp_month - v_current_month)::INTEGER
  FROM companies c
  WHERE c.deleted_at IS NULL
    AND c.payment_method_type = 'card'
    AND c.payment_method_exp_year IS NOT NULL
    AND c.payment_method_exp_month IS NOT NULL
    AND (
      -- Card expires in current month or earlier
      (c.payment_method_exp_year = v_current_year AND c.payment_method_exp_month <= v_target_month)
      OR
      -- Card expires in target year and month
      (c.payment_method_exp_year = v_target_year AND c.payment_method_exp_month <= v_target_month)
      OR
      -- Card already expired
      (c.payment_method_exp_year < v_current_year)
      OR
      (c.payment_method_exp_year = v_current_year AND c.payment_method_exp_month < v_current_month)
    )
  ORDER BY c.payment_method_exp_year, c.payment_method_exp_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION find_expiring_payment_methods IS
'Finds companies with credit cards expiring within X months. Used for proactive notifications.';

-- ============================================================================
-- 4. ADD COMMENTS
-- ============================================================================

COMMENT ON COLUMN companies.stripe_payment_method_id IS 'Stripe PaymentMethod ID (pm_xxxx)';
COMMENT ON COLUMN companies.payment_method_brand IS 'Card brand (visa, mastercard, etc.) or bank_account';
COMMENT ON COLUMN companies.payment_method_last4 IS 'Last 4 digits for display';
COMMENT ON COLUMN companies.payment_method_type IS 'Payment method type: card or us_bank_account';
COMMENT ON COLUMN companies.payment_method_exp_month IS 'Card expiration month (1-12)';
COMMENT ON COLUMN companies.payment_method_exp_year IS 'Card expiration year (e.g., 2025)';
COMMENT ON COLUMN companies.subscription_current_period_start IS 'Start of current billing period';
COMMENT ON COLUMN companies.subscription_current_period_end IS 'End of current billing period (grace period starts after this)';
