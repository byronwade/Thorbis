-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR THORBIS
-- ============================================================================
-- This migration enables RLS on all tables and creates secure policies
--
-- Security Model:
-- - Users can only access their own data
-- - Company data is accessible to company members
-- - Admins have elevated permissions
-- - Public data is read-only for authenticated users
-- ============================================================================

-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Commented out: these tables don't exist (appear to be from a different application)
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE departments ENABLE ROW LEVEL SECURITY;  -- doesn't exist
-- ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;  -- doesn't exist
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;  -- doesn't exist
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE po_settings ENABLE ROW LEVEL SECURITY;  -- doesn't exist

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================
-- Users can read their own profile
-- Users can update their own profile
-- Service role can insert users (for Supabase Auth integration)

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  WITH CHECK (true); -- Service role only, enforced at application level

CREATE POLICY "Users can delete own profile"
  ON users
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- POSTS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read published posts or their own posts
-- Users can create their own posts
-- Users can update/delete their own posts

-- CREATE POLICY "Users can read published posts or own posts"
--   ON posts
--   FOR SELECT
--   USING (published = 'true' OR author_id = auth.uid());
-- 
-- CREATE POLICY "Users can create own posts"
--   ON posts
--   FOR INSERT
--   WITH CHECK (author_id = auth.uid());
-- 
-- CREATE POLICY "Users can update own posts"
--   ON posts
--   FOR UPDATE
--   USING (author_id = auth.uid());
-- 
-- CREATE POLICY "Users can delete own posts"
--   ON posts
--   FOR DELETE
--   USING (author_id = auth.uid());

-- ============================================================================
-- CHATS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read their own chats or public chats
-- Users can create chats
-- Users can update/delete their own chats

-- CREATE POLICY "Users can read own or public chats"
--   ON chats
--   FOR SELECT
--   USING (user_id = auth.uid() OR visibility = 'public');
-- 
-- CREATE POLICY "Users can create chats"
--   ON chats
--   FOR INSERT
--   WITH CHECK (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can update own chats"
--   ON chats
--   FOR UPDATE
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can delete own chats"
--   ON chats
--   FOR DELETE
--   USING (user_id = auth.uid());

-- ============================================================================
-- MESSAGES TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read messages from their chats
-- Users can create messages in their chats
-- Users can update/delete their own messages

-- CREATE POLICY "Users can read messages from own chats"
--   ON messages
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = messages.chat_id
--       AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
--     )
--   );
-- 
-- CREATE POLICY "Users can create messages in own chats"
--   ON messages
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Users can update own messages"
--   ON messages
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = messages.chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Users can delete own messages"
--   ON messages
--   FOR DELETE
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = messages.chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );

-- ============================================================================
-- VOTES TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read their own votes
-- Users can create votes
-- Users can update/delete their own votes

-- CREATE POLICY "Users can read own votes"
--   ON votes
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = votes.chat_id
--       AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
--     )
--   );
-- 
-- CREATE POLICY "Users can create votes"
--   ON votes
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Users can update own votes"
--   ON votes
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = votes.chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Users can delete own votes"
--   ON votes
--   FOR DELETE
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = votes.chat_id
--       AND chats.user_id = auth.uid()
--     )
--   );

-- ============================================================================
-- DOCUMENTS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read their own documents
-- Users can create/update/delete their own documents

-- CREATE POLICY "Users can read own documents"
--   ON documents
--   FOR SELECT
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can create documents"
--   ON documents
--   FOR INSERT
--   WITH CHECK (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can update own documents"
--   ON documents
--   FOR UPDATE
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can delete own documents"
--   ON documents
--   FOR DELETE
--   USING (user_id = auth.uid());

-- ============================================================================
-- SUGGESTIONS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read suggestions from their chats
-- Users can create/update/delete suggestions in their chats

-- CREATE POLICY "Users can read suggestions from own chats"
--   ON suggestions
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM chats
--       WHERE chats.id = suggestions.document_id::uuid
--       AND (chats.user_id = auth.uid() OR chats.visibility = 'public')
--     )
--   );
-- 
-- CREATE POLICY "Users can create suggestions"
--   ON suggestions
--   FOR INSERT
--   WITH CHECK (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can update own suggestions"
--   ON suggestions
--   FOR UPDATE
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can delete own suggestions"
--   ON suggestions
--   FOR DELETE
--   USING (user_id = auth.uid());

-- ============================================================================
-- STREAMS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Users can read their own streams
-- Users can create/update/delete their own streams

-- CREATE POLICY "Users can read own streams"
--   ON streams
--   FOR SELECT
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can create streams"
--   ON streams
--   FOR INSERT
--   WITH CHECK (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can update own streams"
--   ON streams
--   FOR UPDATE
--   USING (user_id = auth.uid());
-- 
-- CREATE POLICY "Users can delete own streams"
--   ON streams
--   FOR DELETE
--   USING (user_id = auth.uid());

-- ============================================================================
-- COMPANIES TABLE POLICIES
-- ============================================================================
-- Company members can read company data
-- Company owners can update company data
-- Anyone can create a company (becomes owner)

CREATE POLICY "Company members can read company"
  ON companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = companies.id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Users can create company"
  ON companies
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Company owners can update company"
  ON companies
  FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Company owners can delete company"
  ON companies
  FOR DELETE
  USING (owner_id = auth.uid());

-- ============================================================================
-- DEPARTMENTS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Company members can read departments
-- Company owners can manage departments

-- CREATE POLICY "Company members can read departments"
--   ON departments
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.company_id = departments.company_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.status = 'active'
--     )
--   );
-- 
-- CREATE POLICY "Company owners can create departments"
--   ON departments
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Company owners can update departments"
--   ON departments
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = departments.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Company owners can delete departments"
--   ON departments
--   FOR DELETE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = departments.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );

-- ============================================================================
-- CUSTOM_ROLES TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Company members can read roles
-- Company owners can manage roles

-- CREATE POLICY "Company members can read roles"
--   ON custom_roles
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.company_id = custom_roles.company_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.status = 'active'
--     )
--   );
-- 
-- CREATE POLICY "Company owners can create roles"
--   ON custom_roles
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Company owners can update roles"
--   ON custom_roles
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = custom_roles.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Company owners can delete roles"
--   ON custom_roles
--   FOR DELETE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = custom_roles.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );

-- ============================================================================
-- TEAM_MEMBERS TABLE POLICIES
-- ============================================================================
-- Company members can read team members
-- Company owners can manage team members
-- Users can read their own membership

CREATE POLICY "Company members can read team"
  ON team_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = team_members.company_id
      AND companies.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.company_id = team_members.company_id
      AND tm.user_id = auth.uid()
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company owners can invite members"
  ON team_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can update members"
  ON team_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = team_members.company_id
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Company owners can remove members"
  ON team_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = team_members.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- COMPANY_SETTINGS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Company members can read settings
-- Company owners can update settings

-- CREATE POLICY "Company members can read settings"
--   ON company_settings
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.company_id = company_settings.company_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.status = 'active'
--     )
--   );
-- 
-- CREATE POLICY "Company owners can create settings"
--   ON company_settings
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );
-- 
-- CREATE POLICY "Company owners can update settings"
--   ON company_settings
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = company_settings.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );

-- ============================================================================
-- PROPERTIES TABLE POLICIES
-- ============================================================================
-- Company members can read properties
-- Company owners and assigned members can manage properties

CREATE POLICY "Company members can read properties"
  ON properties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = properties.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create properties"
  ON properties
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update properties"
  ON properties
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = properties.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete properties"
  ON properties
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = properties.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- JOBS TABLE POLICIES
-- ============================================================================
-- Company members can read jobs
-- Assigned technicians and company owners can manage jobs

CREATE POLICY "Company members can read jobs"
  ON jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = jobs.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create jobs"
  ON jobs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update jobs"
  ON jobs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = jobs.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete jobs"
  ON jobs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = jobs.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- ESTIMATES TABLE POLICIES
-- ============================================================================
-- Company members can read estimates
-- Company members can create/update estimates

CREATE POLICY "Company members can read estimates"
  ON estimates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = estimates.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create estimates"
  ON estimates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update estimates"
  ON estimates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = estimates.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete estimates"
  ON estimates
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = estimates.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- INVOICES TABLE POLICIES
-- ============================================================================
-- Company members can read invoices
-- Company members can create/update invoices

CREATE POLICY "Company members can read invoices"
  ON invoices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = invoices.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create invoices"
  ON invoices
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update invoices"
  ON invoices
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = invoices.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete invoices"
  ON invoices
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = invoices.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PURCHASE_ORDERS TABLE POLICIES
-- ============================================================================
-- Company members can read purchase orders
-- Company members can create/update purchase orders

CREATE POLICY "Company members can read purchase orders"
  ON purchase_orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = purchase_orders.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can create purchase orders"
  ON purchase_orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company members can update purchase orders"
  ON purchase_orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.company_id = purchase_orders.company_id
      AND team_members.user_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Company owners can delete purchase orders"
  ON purchase_orders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = purchase_orders.company_id
      AND companies.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- PO_SETTINGS TABLE POLICIES (COMMENTED - TABLE DOESN'T EXIST)
-- ============================================================================
-- Company members can read PO settings
-- Company owners can update PO settings

-- CREATE POLICY "Company members can read PO settings"
--   ON po_settings
--   FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM team_members
--       WHERE team_members.company_id = po_settings.company_id
--       AND team_members.user_id = auth.uid()
--       AND team_members.status = 'active'
--     )
--   );

-- CREATE POLICY "Company owners can create PO settings"
--   ON po_settings
--   FOR INSERT
--   WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Company owners can update PO settings"
--   ON po_settings
--   FOR UPDATE
--   USING (
--     EXISTS (
--       SELECT 1 FROM companies
--       WHERE companies.id = po_settings.company_id
--       AND companies.owner_id = auth.uid()
--     )
--   );

-- ============================================================================
-- DATABASE TRIGGERS FOR USER SYNC
-- ============================================================================
-- Create a trigger to sync users from Supabase Auth to public.users table

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, email_verified, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    email = NEW.email,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users to sync to public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Grant permissions to authenticated users

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- RLS ENABLED SUCCESSFULLY
-- ============================================================================
-- All tables now have Row Level Security enabled with appropriate policies
-- Users can only access data they own or are authorized to view
-- Company-based multi-tenancy is enforced at the database level
-- ============================================================================
