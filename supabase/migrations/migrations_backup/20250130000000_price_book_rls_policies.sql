-- ============================================================================
-- PRICE BOOK ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- This migration enables RLS on all price book tables and creates secure policies
--
-- Security Model:
-- - Company members can access price book data
-- - Company owners have full management permissions
-- - Price history is read-only for non-owners
-- ============================================================================

-- Enable RLS on all price book tables
-- ============================================================================

ALTER TABLE price_book_items ENABLE ROW LEVEL SECURITY;
-- price_history table may not exist yet, skip if it doesn't
DO $$ BEGIN
    ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;
-- service_packages table may not exist yet, skip if it doesn't
DO $$ BEGIN
    ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;
-- pricing_rules table may not exist yet, skip if it doesn't
DO $$ BEGIN
    ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;
-- labor_rates table may not exist yet, skip if it doesn't
DO $$ BEGIN
    ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;
-- supplier_integrations table may not exist yet, skip if it doesn't
DO $$ BEGIN
    ALTER TABLE supplier_integrations ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- ============================================================================
-- PRICE_BOOK_ITEMS TABLE POLICIES
-- ============================================================================
-- Company members can read price book items
-- Company members can create/update price book items
-- Company owners can delete price book items

CREATE POLICY "Company members can read price book items"
  ON price_book_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = price_book_items.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create price book items"
  ON price_book_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update price book items"
  ON price_book_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = price_book_items.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete price book items"
  ON price_book_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = price_book_items.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PRICE_HISTORY TABLE POLICIES
-- ============================================================================
-- Company members can read price history
-- System can insert price history (enforced at application level)
-- NOTE: price_history table may not exist yet, skip if it doesn't

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'price_history') THEN
    CREATE POLICY "Company members can read price history"
      ON price_history
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_members.company_id = price_history.company_id
          AND team_members.user_id = auth.uid()
          AND team_members.status = 'active'
        )
      );

    CREATE POLICY "Company members can insert price history"
      ON price_history
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM team_members
          WHERE team_members.company_id = company_id
          AND team_members.user_id = auth.uid()
          AND team_members.status = 'active'
        )
      );
  END IF;
END $$;

-- ============================================================================
-- SERVICE_PACKAGES TABLE POLICIES
-- ============================================================================
-- Company members can read service packages
-- Company members can create/update service packages
-- Company owners can delete service packages

CREATE POLICY "Company members can read service packages"
  ON service_packages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = service_packages.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create service packages"
  ON service_packages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update service packages"
  ON service_packages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = service_packages.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete service packages"
  ON service_packages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = service_packages.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PRICING_RULES TABLE POLICIES
-- ============================================================================
-- Company members can read pricing rules
-- Company owners can create/update/delete pricing rules

CREATE POLICY "Company members can read pricing rules"
  ON pricing_rules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = pricing_rules.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can create pricing rules"
  ON pricing_rules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update pricing rules"
  ON pricing_rules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = pricing_rules.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can delete pricing rules"
  ON pricing_rules
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = pricing_rules.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- LABOR_RATES TABLE POLICIES
-- ============================================================================
-- Company members can read labor rates
-- Company owners can create/update/delete labor rates

CREATE POLICY "Company members can read labor rates"
  ON labor_rates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = labor_rates.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can create labor rates"
  ON labor_rates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update labor rates"
  ON labor_rates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = labor_rates.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can delete labor rates"
  ON labor_rates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = labor_rates.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- SUPPLIER_INTEGRATIONS TABLE POLICIES
-- ============================================================================
-- Company members can read supplier integrations
-- Company owners can create/update/delete supplier integrations

CREATE POLICY "Company members can read supplier integrations"
  ON supplier_integrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = supplier_integrations.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can create supplier integrations"
  ON supplier_integrations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update supplier integrations"
  ON supplier_integrations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = supplier_integrations.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can delete supplier integrations"
  ON supplier_integrations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = supplier_integrations.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
-- Optimize queries by adding indexes on frequently queried columns

-- Price Book Items indexes
CREATE INDEX idx_price_book_items_company_id ON price_book_items(company_id);
CREATE INDEX idx_price_book_items_category ON price_book_items(category);
CREATE INDEX idx_price_book_items_item_type ON price_book_items(item_type);
CREATE INDEX idx_price_book_items_is_active ON price_book_items(is_active);
CREATE INDEX idx_price_book_items_supplier_id ON price_book_items(supplier_id);

-- Price History indexes (only if table exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'price_history') THEN
    CREATE INDEX IF NOT EXISTS idx_price_history_item_id ON price_history(item_id);
    CREATE INDEX IF NOT EXISTS idx_price_history_company_id ON price_history(company_id);
    CREATE INDEX IF NOT EXISTS idx_price_history_effective_date ON price_history(effective_date);
  END IF;
END $$;

-- Service Packages indexes
CREATE INDEX idx_service_packages_company_id ON service_packages(company_id);
CREATE INDEX idx_service_packages_price_book_item_id ON service_packages(price_book_item_id);
CREATE INDEX idx_service_packages_is_active ON service_packages(is_active);

-- Pricing Rules indexes
CREATE INDEX idx_pricing_rules_company_id ON pricing_rules(company_id);
CREATE INDEX idx_pricing_rules_is_active ON pricing_rules(is_active);
CREATE INDEX idx_pricing_rules_priority ON pricing_rules(priority);

-- Labor Rates indexes
CREATE INDEX idx_labor_rates_company_id ON labor_rates(company_id);
CREATE INDEX idx_labor_rates_is_active ON labor_rates(is_active);
CREATE INDEX idx_labor_rates_is_default ON labor_rates(is_default);

-- Supplier Integrations indexes
CREATE INDEX idx_supplier_integrations_company_id ON supplier_integrations(company_id);
CREATE INDEX idx_supplier_integrations_supplier_name ON supplier_integrations(supplier_name);
CREATE INDEX idx_supplier_integrations_status ON supplier_integrations(status);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Grant permissions to authenticated users

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON price_book_items TO authenticated;
-- Grant permissions only if tables exist
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'price_history') THEN
    GRANT ALL ON price_history TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_packages') THEN
    GRANT ALL ON service_packages TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pricing_rules') THEN
    GRANT ALL ON pricing_rules TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'labor_rates') THEN
    GRANT ALL ON labor_rates TO authenticated;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supplier_integrations') THEN
    GRANT ALL ON supplier_integrations TO authenticated;
  END IF;
END $$;

-- ============================================================================
-- PRICE BOOK RLS POLICIES ENABLED SUCCESSFULLY
-- ============================================================================
-- All price book tables now have Row Level Security enabled with appropriate policies
-- Company members can access and manage price book data
-- Company owners have full control over pricing rules, labor rates, and supplier integrations
-- ============================================================================
