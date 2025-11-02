-- ============================================================================
-- FINANCE SETTINGS MIGRATION
-- Created: 2025-11-02
-- Purpose: Add comprehensive finance settings tables for Thorbis platform
-- ============================================================================

-- ============================================================================
-- 1. ACCOUNTING INTEGRATION SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_accounting_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Integration Provider
    provider VARCHAR(50) CHECK (provider IN ('quickbooks', 'xero', 'sage', 'freshbooks', 'manual', 'none')),
    provider_enabled BOOLEAN DEFAULT false,

    -- API Credentials (encrypted)
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    refresh_token_encrypted TEXT,

    -- Sync Settings
    auto_sync_enabled BOOLEAN DEFAULT false,
    sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
    last_sync_at TIMESTAMPTZ,

    -- Chart of Accounts Mapping
    income_account VARCHAR(100),
    expense_account VARCHAR(100),
    asset_account VARCHAR(100),
    liability_account VARCHAR(100),

    -- Sync Options
    sync_invoices BOOLEAN DEFAULT true,
    sync_payments BOOLEAN DEFAULT true,
    sync_expenses BOOLEAN DEFAULT true,
    sync_customers BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. BOOKKEEPING SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_bookkeeping_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Automation Rules
    auto_categorize_transactions BOOLEAN DEFAULT true,
    auto_reconcile_payments BOOLEAN DEFAULT false,
    auto_generate_reports BOOLEAN DEFAULT false,

    -- Default Categories
    default_income_category VARCHAR(100) DEFAULT 'Service Revenue',
    default_expense_category VARCHAR(100) DEFAULT 'Operating Expenses',
    default_tax_category VARCHAR(100) DEFAULT 'Sales Tax',

    -- Report Settings
    report_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (report_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    email_reports BOOLEAN DEFAULT false,
    report_recipients TEXT[], -- Array of email addresses

    -- Fiscal Year
    fiscal_year_start_month INTEGER DEFAULT 1 CHECK (fiscal_year_start_month BETWEEN 1 AND 12),
    fiscal_year_start_day INTEGER DEFAULT 1 CHECK (fiscal_year_start_day BETWEEN 1 AND 31),

    -- Settings
    require_receipt_attachment BOOLEAN DEFAULT false,
    allow_manual_journal_entries BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. BANK ACCOUNT SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Bank Details
    account_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings', 'business_checking', 'credit_card')),

    -- Account Information
    account_number_last4 VARCHAR(4), -- Only store last 4 digits
    routing_number_encrypted TEXT,

    -- Balance
    current_balance DECIMAL(15, 2) DEFAULT 0,
    available_balance DECIMAL(15, 2) DEFAULT 0,

    -- Integration
    plaid_access_token_encrypted TEXT,
    plaid_item_id VARCHAR(255),
    plaid_account_id VARCHAR(255),

    -- Sync Settings
    auto_import_transactions BOOLEAN DEFAULT false,
    last_synced_at TIMESTAMPTZ,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false, -- Primary account for payments

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, account_name)
);

-- ============================================================================
-- 4. BUSINESS FINANCING SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_business_financing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Financing Options
    enable_business_loans BOOLEAN DEFAULT false,
    enable_line_of_credit BOOLEAN DEFAULT false,
    enable_equipment_financing BOOLEAN DEFAULT false,

    -- Provider Integration
    financing_provider VARCHAR(100), -- e.g., 'kabbage', 'fundbox', 'lendio'
    provider_api_key_encrypted TEXT,

    -- Application Settings
    auto_calculate_eligibility BOOLEAN DEFAULT false,
    show_offers_in_dashboard BOOLEAN DEFAULT true,

    -- Business Information
    annual_revenue DECIMAL(15, 2),
    years_in_business INTEGER,
    business_credit_score INTEGER CHECK (business_credit_score BETWEEN 300 AND 850),

    -- Preferences
    preferred_loan_amount DECIMAL(15, 2),
    preferred_term_months INTEGER,
    max_acceptable_apr DECIMAL(5, 2),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. CONSUMER FINANCING SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_consumer_financing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Consumer Financing
    financing_enabled BOOLEAN DEFAULT false,

    -- Provider Settings
    provider VARCHAR(100) CHECK (provider IN ('affirm', 'wisetack', 'greensky', 'servicefinance', 'other')),
    provider_api_key_encrypted TEXT,
    provider_merchant_id VARCHAR(255),

    -- Financing Options
    min_amount DECIMAL(10, 2) DEFAULT 500.00,
    max_amount DECIMAL(10, 2) DEFAULT 25000.00,
    available_terms INTEGER[] DEFAULT ARRAY[6, 12, 24, 36, 48, 60], -- Months

    -- Display Settings
    show_in_estimates BOOLEAN DEFAULT true,
    show_in_invoices BOOLEAN DEFAULT true,
    show_monthly_payment BOOLEAN DEFAULT true,
    promote_financing BOOLEAN DEFAULT true,

    -- Application Settings
    allow_instant_approval BOOLEAN DEFAULT true,
    require_credit_check BOOLEAN DEFAULT true,
    collect_ssn BOOLEAN DEFAULT false,

    -- Marketing
    marketing_message TEXT DEFAULT 'Finance your service with flexible payment plans',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. DEBIT CARD SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_debit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,

    -- Card Details
    card_name VARCHAR(255) NOT NULL, -- e.g., "John's Company Card"
    card_number_last4 VARCHAR(4) NOT NULL,
    card_provider VARCHAR(50) DEFAULT 'stripe' CHECK (card_provider IN ('stripe', 'brex', 'ramp', 'divvy', 'other')),

    -- Limits
    daily_limit DECIMAL(10, 2) DEFAULT 1000.00,
    monthly_limit DECIMAL(10, 2) DEFAULT 10000.00,
    transaction_limit DECIMAL(10, 2) DEFAULT 500.00,

    -- Current Usage
    daily_spent DECIMAL(10, 2) DEFAULT 0,
    monthly_spent DECIMAL(10, 2) DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,

    -- Restrictions
    allowed_categories TEXT[], -- e.g., ['gas', 'supplies', 'equipment']
    blocked_categories TEXT[],
    allowed_merchants TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_virtual BOOLEAN DEFAULT false,

    -- Expiration
    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. GAS CARD SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_gas_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    vehicle_id UUID, -- Reference to vehicles table if exists

    -- Card Details
    card_number_last4 VARCHAR(4) NOT NULL,
    card_provider VARCHAR(50) DEFAULT 'fleet' CHECK (card_provider IN ('fleet', 'fuelman', 'wex', 'shell', 'bp', 'other')),
    card_name VARCHAR(255) NOT NULL,

    -- Limits
    daily_gallon_limit INTEGER DEFAULT 50,
    daily_amount_limit DECIMAL(10, 2) DEFAULT 200.00,
    monthly_amount_limit DECIMAL(10, 2) DEFAULT 2000.00,

    -- Current Usage
    monthly_spent DECIMAL(10, 2) DEFAULT 0,
    monthly_gallons INTEGER DEFAULT 0,

    -- Restrictions
    allowed_fuel_types TEXT[] DEFAULT ARRAY['regular', 'premium', 'diesel'],
    allowed_locations TEXT[], -- Specific stations or regions
    purchase_restrictions TEXT[] DEFAULT ARRAY['fuel_only'], -- 'fuel_only', 'car_wash', 'convenience_store'

    -- Odometer Tracking
    require_odometer BOOLEAN DEFAULT true,
    last_odometer_reading INTEGER,

    -- Status
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. GIFT CARD SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_gift_card_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Program Settings
    gift_cards_enabled BOOLEAN DEFAULT false,
    program_name VARCHAR(100) DEFAULT 'Gift Cards',

    -- Denominations
    fixed_denominations BOOLEAN DEFAULT true,
    available_amounts DECIMAL(10, 2)[] DEFAULT ARRAY[25, 50, 100, 250, 500],
    min_custom_amount DECIMAL(10, 2) DEFAULT 10.00,
    max_custom_amount DECIMAL(10, 2) DEFAULT 1000.00,

    -- Purchase Settings
    allow_online_purchase BOOLEAN DEFAULT true,
    allow_in_person_purchase BOOLEAN DEFAULT true,
    require_recipient_email BOOLEAN DEFAULT false,

    -- Expiration
    cards_expire BOOLEAN DEFAULT false,
    expiration_months INTEGER DEFAULT 24,
    send_expiration_reminder BOOLEAN DEFAULT true,
    reminder_days_before INTEGER DEFAULT 30,

    -- Redemption
    allow_partial_redemption BOOLEAN DEFAULT true,
    allow_multiple_cards_per_transaction BOOLEAN DEFAULT true,
    combine_with_other_discounts BOOLEAN DEFAULT false,

    -- Design
    default_design_url TEXT,
    allow_custom_message BOOLEAN DEFAULT true,
    max_message_length INTEGER DEFAULT 200,

    -- Reporting
    track_redemption_analytics BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift Card Transactions Table
CREATE TABLE IF NOT EXISTS finance_gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Card Information
    card_code VARCHAR(50) NOT NULL UNIQUE,
    card_pin VARCHAR(10),

    -- Amounts
    initial_amount DECIMAL(10, 2) NOT NULL,
    current_balance DECIMAL(10, 2) NOT NULL,

    -- Recipient
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    purchaser_name VARCHAR(255),
    purchaser_email VARCHAR(255),

    -- Custom Message
    custom_message TEXT,
    design_url TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'void')),

    -- Dates
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. VIRTUAL BUCKET SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_virtual_bucket_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE UNIQUE,

    -- Bucket System
    virtual_buckets_enabled BOOLEAN DEFAULT false,

    -- Automation
    auto_allocate_funds BOOLEAN DEFAULT false,
    allocation_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (allocation_frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),

    -- Default Buckets (percentages should add up to 100)
    operating_expenses_percentage DECIMAL(5, 2) DEFAULT 50.00,
    tax_reserve_percentage DECIMAL(5, 2) DEFAULT 25.00,
    profit_percentage DECIMAL(5, 2) DEFAULT 15.00,
    emergency_fund_percentage DECIMAL(5, 2) DEFAULT 10.00,

    -- Rules
    min_operating_balance DECIMAL(15, 2) DEFAULT 5000.00,
    emergency_fund_target DECIMAL(15, 2) DEFAULT 10000.00,

    -- Notifications
    notify_low_balance BOOLEAN DEFAULT true,
    low_balance_threshold DECIMAL(15, 2) DEFAULT 1000.00,
    notify_bucket_goals_met BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Virtual Buckets Table
CREATE TABLE IF NOT EXISTS finance_virtual_buckets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

    -- Bucket Information
    bucket_name VARCHAR(100) NOT NULL,
    bucket_type VARCHAR(50) CHECK (bucket_type IN ('operating', 'tax_reserve', 'profit', 'emergency', 'savings', 'custom')),
    description TEXT,

    -- Balance
    current_balance DECIMAL(15, 2) DEFAULT 0,
    target_balance DECIMAL(15, 2),

    -- Allocation Rules
    allocation_percentage DECIMAL(5, 2) DEFAULT 0,
    auto_transfer_enabled BOOLEAN DEFAULT false,

    -- Limits
    min_balance DECIMAL(15, 2) DEFAULT 0,
    max_balance DECIMAL(15, 2),

    -- Display
    display_order INTEGER DEFAULT 0,
    color VARCHAR(7) DEFAULT '#3b82f6',
    icon VARCHAR(50),

    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(company_id, bucket_name)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all finance tables
ALTER TABLE finance_accounting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_bookkeeping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_business_financing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_consumer_financing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_debit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_gas_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_gift_card_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_virtual_bucket_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_virtual_buckets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company-scoped tables
DO $$
DECLARE
  table_name TEXT;
  finance_tables TEXT[] := ARRAY[
    'finance_accounting_settings',
    'finance_bookkeeping_settings',
    'finance_bank_accounts',
    'finance_business_financing_settings',
    'finance_consumer_financing_settings',
    'finance_debit_cards',
    'finance_gas_cards',
    'finance_gift_card_settings',
    'finance_gift_cards',
    'finance_virtual_bucket_settings',
    'finance_virtual_buckets'
  ];
BEGIN
  FOREACH table_name IN ARRAY finance_tables
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

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_fin_accounting_company ON finance_accounting_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_bookkeeping_company ON finance_bookkeeping_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_bank_accounts_company ON finance_bank_accounts(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_bank_accounts_active ON finance_bank_accounts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_fin_bus_financing_company ON finance_business_financing_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_consumer_financing_company ON finance_consumer_financing_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_debit_cards_company ON finance_debit_cards(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_debit_cards_team ON finance_debit_cards(team_member_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_fin_gas_cards_company ON finance_gas_cards(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_gas_cards_team ON finance_gas_cards(team_member_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_fin_gift_card_settings_company ON finance_gift_card_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_gift_cards_company ON finance_gift_cards(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_gift_cards_code ON finance_gift_cards(card_code);
CREATE INDEX IF NOT EXISTS idx_fin_gift_cards_status ON finance_gift_cards(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_fin_vb_settings_company ON finance_virtual_bucket_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_virtual_buckets_company ON finance_virtual_buckets(company_id);
CREATE INDEX IF NOT EXISTS idx_fin_virtual_buckets_type ON finance_virtual_buckets(bucket_type) WHERE is_active = true;

-- ============================================================================
-- TRIGGER FOR updated_at TIMESTAMPS
-- ============================================================================

-- Apply trigger to all finance tables
DO $$
DECLARE
  table_name TEXT;
  all_tables TEXT[] := ARRAY[
    'finance_accounting_settings',
    'finance_bookkeeping_settings',
    'finance_bank_accounts',
    'finance_business_financing_settings',
    'finance_consumer_financing_settings',
    'finance_debit_cards',
    'finance_gas_cards',
    'finance_gift_card_settings',
    'finance_gift_cards',
    'finance_virtual_bucket_settings',
    'finance_virtual_buckets'
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

COMMENT ON TABLE finance_accounting_settings IS 'Accounting software integration and sync configuration';
COMMENT ON TABLE finance_bookkeeping_settings IS 'Automated bookkeeping rules and report generation';
COMMENT ON TABLE finance_bank_accounts IS 'Connected business bank accounts with Plaid integration';
COMMENT ON TABLE finance_business_financing_settings IS 'Business loan and line of credit options';
COMMENT ON TABLE finance_consumer_financing_settings IS 'Customer financing options for services';
COMMENT ON TABLE finance_debit_cards IS 'Company debit cards with spending limits and restrictions';
COMMENT ON TABLE finance_gas_cards IS 'Fleet gas cards with usage tracking and limits';
COMMENT ON TABLE finance_gift_card_settings IS 'Gift card program configuration';
COMMENT ON TABLE finance_gift_cards IS 'Individual gift card transactions and balances';
COMMENT ON TABLE finance_virtual_bucket_settings IS 'Virtual bucket accounting system configuration';
COMMENT ON TABLE finance_virtual_buckets IS 'Individual virtual buckets for fund allocation';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
