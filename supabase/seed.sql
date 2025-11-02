-- ============================================================================
-- MAIN SEED FILE - Single User Development Seeding
-- ============================================================================
-- Description: Seeds the database with realistic data for YOUR user only
-- Usage: pnpm supabase db reset (runs migrations + this seed file)
--
-- This seed file:
-- 1. Auto-detects your Supabase Auth user
-- 2. Creates your company
-- 3. Links you as the owner
-- 4. Seeds all data belonging to your company
-- 5. All jobs, customers, etc. are assigned to/created by YOU
--
-- Author: Claude Code (AI Assistant)
-- Date: 2025-01-31
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
  v_user_email TEXT;
  v_user_name TEXT;
BEGIN

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Starting Thorbis Single-User Seed';
  RAISE NOTICE '========================================';

  -- ============================================================================
  -- STEP 1: AUTO-DETECT YOUR USER FROM SUPABASE AUTH
  -- ============================================================================

  RAISE NOTICE 'Step 1: Detecting your Supabase user...';

  -- Get the first (and likely only) user from Supabase Auth
  SELECT
    id,
    email,
    COALESCE(
      raw_user_meta_data->>'name',
      raw_user_meta_data->>'full_name',
      split_part(email, '@', 1)
    ) as name
  INTO v_user_id, v_user_email, v_user_name
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;

  -- Verify user was found
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found in auth.users table. Please sign up first!';
  END IF;

  RAISE NOTICE '   Found user: % (ID: %)', v_user_email, v_user_id;

  -- Store user info for other seed files
  PERFORM set_config('app.current_user_id', v_user_id::text, false);
  PERFORM set_config('app.current_user_email', v_user_email, false);
  PERFORM set_config('app.current_user_name', v_user_name, false);

  -- ============================================================================
  -- STEP 2: ENSURE USER EXISTS IN USERS TABLE
  -- ============================================================================

  RAISE NOTICE 'Step 2: Setting up user profile...';

  -- Insert or update user in users table
  INSERT INTO users (
    id,
    name,
    email,
    email_verified,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    v_user_name,
    v_user_email,
    true,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    email_verified = true,
    is_active = true,
    updated_at = NOW();

  RAISE NOTICE '   User profile created/updated';

  -- ============================================================================
  -- STEP 3: CREATE YOUR COMPANY
  -- ============================================================================

  RAISE NOTICE 'Step 3: Creating your company...';

  -- Check if company already exists for this user
  SELECT c.id INTO v_company_id
  FROM companies c
  INNER JOIN team_members tm ON tm.company_id = c.id
  WHERE tm.user_id = v_user_id
  LIMIT 1;

  IF v_company_id IS NULL THEN
    -- Create new company (simplified columns)
    INSERT INTO companies (
      name,
      slug,
      created_at,
      updated_at
    )
    VALUES (
      'Thorbis HVAC & Plumbing Services',
      'thorbis-hvac-plumbing-services',
      NOW(),
      NOW()
    )
    RETURNING id INTO v_company_id;

    RAISE NOTICE '   Company created: Thorbis HVAC & Plumbing Services (ID: %)', v_company_id;
  ELSE
    RAISE NOTICE '   Using existing company (ID: %)', v_company_id;
  END IF;

  -- Store company ID for other seed files
  PERFORM set_config('app.current_company_id', v_company_id::text, false);

  -- ============================================================================
  -- STEP 4: CREATE TEAM MEMBER (LINK YOU AS OWNER)
  -- ============================================================================

  RAISE NOTICE 'Step 4: Linking you as company owner...';

  INSERT INTO team_members (
    company_id,
    user_id,
    role,
    title,
    department,
    is_active,
    can_see_revenue,
    can_see_costs,
    hourly_rate,
    created_at,
    updated_at
  )
  VALUES (
    v_company_id,
    v_user_id,
    'owner',
    'Owner / CEO',
    'management',
    true,
    true,
    true,
    15000, -- $150/hr in cents
    NOW(),
    NOW()
  )
  ON CONFLICT (company_id, user_id)
  DO UPDATE SET
    role = 'owner',
    title = 'Owner / CEO',
    is_active = true,
    updated_at = NOW();

  RAISE NOTICE '   You are now the company owner';

  -- ============================================================================
  -- STEP 5: RUN ALL SEED FILES IN ORDER
  -- ============================================================================

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Running Seed Files...';
  RAISE NOTICE '========================================';

END $$;

-- ============================================================================
-- IMPORT ALL SEED FILES IN ORDER
-- ============================================================================

-- Foundation Data
\ir seeds/02_price_book_categories.sql
\ir seeds/03_price_book_items.sql
\ir seeds/04_tags.sql

-- Customer Data
\ir seeds/05_customers.sql
\ir seeds/06_properties.sql
\ir seeds/07_equipment.sql
\ir seeds/08_service_plans.sql

-- Work & Financial Data
\ir seeds/09_jobs.sql
\ir seeds/10_estimates.sql
\ir seeds/11_invoices.sql
\ir seeds/12_payments.sql

-- Operations Data
\ir seeds/13_schedules.sql
\ir seeds/14_communications.sql
\ir seeds/15_inventory.sql

-- ============================================================================
-- COMPLETION
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed Complete! <�';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Your Thorbis database is ready to use';
  RAISE NOTICE 'Company: Thorbis HVAC & Plumbing Services';
  RAISE NOTICE 'User: %', current_setting('app.current_user_email', true);
  RAISE NOTICE '========================================';
END $$;
