-- ============================================================================
-- MINIMAL SEED FILE - Works with existing schema
-- ============================================================================
-- This seed assumes companies and user_companies tables already exist
-- It only seeds the essential data tables defined in migrations
-- ============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_company_id UUID;
  v_user_email TEXT;
BEGIN

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Starting Minimal Seed';
  RAISE NOTICE '========================================';

  -- Get your user from auth
  SELECT id, email
  INTO v_user_id, v_user_email
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please sign up first!';
  END IF;

  RAISE NOTICE 'User: % (ID: %)', v_user_email, v_user_id;

  -- Get or create company
  SELECT id INTO v_company_id
  FROM companies
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_company_id IS NULL THEN
    INSERT INTO companies (name, slug)
    VALUES ('Thorbis HVAC Services', 'thorbis-hvac-services')
    RETURNING id INTO v_company_id;
    RAISE NOTICE 'Created company (ID: %)', v_company_id;
  ELSE
    RAISE NOTICE 'Using existing company (ID: %)', v_company_id;
  END IF;

  -- Store for use in seed files
  PERFORM set_config('app.current_user_id', v_user_id::text, false);
  PERFORM set_config('app.current_company_id', v_company_id::text, false);

END $$;

-- Import seed files that match the production schema
\ir seeds/02_price_book_categories.sql
\ir seeds/03_price_book_items.sql
\ir seeds/04_tags.sql
\ir seeds/05_customers.sql
\ir seeds/06_properties.sql
\ir seeds/07_equipment.sql
\ir seeds/08_service_plans.sql
\ir seeds/09_jobs.sql
\ir seeds/10_estimates.sql
\ir seeds/11_invoices.sql
\ir seeds/12_payments.sql
\ir seeds/13_schedules.sql
\ir seeds/14_communications.sql
\ir seeds/15_inventory.sql

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed Complete! 🎉';
  RAISE NOTICE '========================================';
END $$;
