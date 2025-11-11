-- ============================================================================
-- RLS POLICIES FOR ALL TABLES - To be applied via Supabase SQL Editor
-- ============================================================================
-- Copy and paste this entire file into Supabase SQL Editor and execute
-- Or run in chunks if needed
-- ============================================================================

-- COMPANIES
CREATE POLICY "Users can view companies they belong to"
  ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company owners can update their company"
  ON companies FOR UPDATE
  USING (owner_id = auth.uid());

-- USERS
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE USING (id = auth.uid());

-- TEAM_MEMBERS
CREATE POLICY "Team members can view colleagues"
  ON team_members FOR SELECT
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company owners can manage team"
  ON team_members FOR ALL
  USING (EXISTS (SELECT 1 FROM companies WHERE id = company_id AND owner_id = auth.uid()));

-- CUSTOMERS
CREATE POLICY "Company members can read customers"
  ON customers FOR SELECT
  USING (deleted_at IS NULL AND EXISTS (
    SELECT 1 FROM team_members WHERE team_members.company_id = customers.company_id
    AND team_members.user_id = auth.uid() AND team_members.status = 'active'));

CREATE POLICY "Company members can create customers"
  ON customers FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM team_members WHERE team_members.company_id = company_id
    AND team_members.user_id = auth.uid() AND team_members.status = 'active'));

CREATE POLICY "Company members can update customers"
  ON customers FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM team_members WHERE team_members.company_id = customers.company_id
    AND team_members.user_id = auth.uid() AND team_members.status = 'active'));

-- JOBS
CREATE POLICY "Company members can view jobs"
  ON jobs FOR SELECT
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can update jobs"
  ON jobs FOR UPDATE
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Assigned tech can view jobs"
  ON jobs FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Assigned tech can update jobs"
  ON jobs FOR UPDATE USING (assigned_to = auth.uid());

-- Apply same pattern for other tables
-- SCHEDULES
CREATE POLICY "Company members can manage schedules"
  ON schedules FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- ESTIMATES
CREATE POLICY "Company members can manage estimates"
  ON estimates FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- INVOICES
CREATE POLICY "Company members can manage invoices"
  ON invoices FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- PAYMENTS
CREATE POLICY "Company members can view payments"
  ON payments FOR SELECT
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can create payments"
  ON payments FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- COMMUNICATIONS
CREATE POLICY "Company members can view communications"
  ON communications FOR SELECT
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can create communications"
  ON communications FOR INSERT
  WITH CHECK (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- Continue for all other tables...
-- EQUIPMENT, INVENTORY, SERVICE_PLANS, etc.
CREATE POLICY "Company members can manage equipment"
  ON equipment FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage inventory"
  ON inventory FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage service_plans"
  ON service_plans FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage price_book_items"
  ON price_book_items FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage price_book_categories"
  ON price_book_categories FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage tags"
  ON tags FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can manage attachments"
  ON attachments FOR ALL
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

CREATE POLICY "Company members can view activities"
  ON activities FOR SELECT
  USING (company_id IN (SELECT company_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'));

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
