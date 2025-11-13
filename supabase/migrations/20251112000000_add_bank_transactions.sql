-- ============================================================================
-- BANK TRANSACTIONS AND STATEMENTS
-- ============================================================================
-- Add tables for storing bank transaction history and statements from Plaid
-- integration. Enables comprehensive financial tracking and reconciliation.
--
-- Tables:
-- - finance_bank_transactions: Transaction history from linked bank accounts
-- - finance_bank_statements: PDF statements and historical data
-- ============================================================================

-- ============================================================================
-- 1. BANK TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES finance_bank_accounts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Plaid identifiers
    plaid_transaction_id VARCHAR(255) UNIQUE,
    
    -- Transaction details
    date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    merchant_name VARCHAR(255),
    category_id VARCHAR(100),
    category_name VARCHAR(255),
    
    -- Additional metadata
    pending BOOLEAN DEFAULT false,
    iso_currency_code VARCHAR(3) DEFAULT 'USD',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_bank_account ON finance_bank_transactions(bank_account_id);
CREATE INDEX idx_transactions_company ON finance_bank_transactions(company_id);
CREATE INDEX idx_transactions_date ON finance_bank_transactions(date DESC);
CREATE INDEX idx_transactions_plaid_id ON finance_bank_transactions(plaid_transaction_id) WHERE plaid_transaction_id IS NOT NULL;

-- Updated at trigger
CREATE TRIGGER update_finance_bank_transactions_updated_at
    BEFORE UPDATE ON finance_bank_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. BANK STATEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS finance_bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID NOT NULL REFERENCES finance_bank_accounts(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    statement_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    
    -- Storage
    file_url TEXT,
    file_size_bytes INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(bank_account_id, statement_date)
);

-- Indexes for performance
CREATE INDEX idx_statements_bank_account ON finance_bank_statements(bank_account_id);
CREATE INDEX idx_statements_company ON finance_bank_statements(company_id);
CREATE INDEX idx_statements_date ON finance_bank_statements(statement_date DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE finance_bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_bank_statements ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view transactions for their company"
    ON finance_bank_transactions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_transactions.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
        )
    );

CREATE POLICY "Users can insert transactions for their company"
    ON finance_bank_transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_transactions.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can update transactions for their company"
    ON finance_bank_transactions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_transactions.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete transactions for their company"
    ON finance_bank_transactions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_transactions.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

-- Statements policies
CREATE POLICY "Users can view statements for their company"
    ON finance_bank_statements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_statements.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
        )
    );

CREATE POLICY "Users can insert statements for their company"
    ON finance_bank_statements FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_statements.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can update statements for their company"
    ON finance_bank_statements FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_statements.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete statements for their company"
    ON finance_bank_statements FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.company_id = finance_bank_statements.company_id
            AND team_members.user_id = auth.uid()
            AND team_members.status = 'active'
            AND team_members.role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- 4. COMMENTS
-- ============================================================================

COMMENT ON TABLE finance_bank_transactions IS 'Transaction history from Plaid-linked bank accounts';
COMMENT ON TABLE finance_bank_statements IS 'Bank statements for historical reference and reconciliation';
COMMENT ON COLUMN finance_bank_transactions.plaid_transaction_id IS 'Unique transaction ID from Plaid API';
COMMENT ON COLUMN finance_bank_transactions.pending IS 'Whether the transaction is still pending settlement';
COMMENT ON COLUMN finance_bank_statements.file_url IS 'Supabase storage URL for PDF statement';

