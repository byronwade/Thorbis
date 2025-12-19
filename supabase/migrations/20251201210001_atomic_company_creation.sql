-- ============================================================================
-- ATOMIC COMPANY CREATION WITH OWNER MEMBERSHIP
-- ============================================================================
-- Created: 2025-12-01
-- Purpose: Ensure company creation and owner membership happen atomically
--
-- This RPC function creates:
-- 1. Company record with owner_id
-- 2. team_members record with 'owner' role (handled by trigger)
-- 3. company_memberships record with HR data
--
-- All in a single transaction to prevent orphaned companies.
-- ============================================================================

-- ============================================================================
-- 1. CREATE RPC FUNCTION FOR ATOMIC COMPANY + MEMBERSHIP CREATION
-- ============================================================================

CREATE OR REPLACE FUNCTION create_company_with_owner(
  p_user_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_industry TEXT DEFAULT NULL,
  p_company_size TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_zip_code TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL,
  p_tax_id TEXT DEFAULT NULL,
  p_lat DOUBLE PRECISION DEFAULT NULL,
  p_lon DOUBLE PRECISION DEFAULT NULL
)
RETURNS TABLE(
  company_id UUID,
  team_member_id UUID,
  company_membership_id UUID
) AS $$
DECLARE
  v_company_id UUID;
  v_team_member_id UUID;
  v_company_membership_id UUID;
BEGIN
  -- Validate user ID
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;

  -- Validate company name
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Company name is required';
  END IF;

  -- Validate slug
  IF p_slug IS NULL OR LENGTH(TRIM(p_slug)) = 0 THEN
    RAISE EXCEPTION 'Company slug is required';
  END IF;

  -- Create the company (this triggers handle_new_company_owner which creates team_members)
  INSERT INTO companies (
    name,
    slug,
    industry,
    company_size,
    phone,
    address,
    city,
    state,
    zip_code,
    website,
    tax_id,
    lat,
    lon,
    created_by,
    owner_id,
    stripe_subscription_status
  ) VALUES (
    TRIM(p_name),
    TRIM(p_slug),
    p_industry,
    p_company_size,
    p_phone,
    p_address,
    p_city,
    p_state,
    p_zip_code,
    p_website,
    p_tax_id,
    p_lat,
    p_lon,
    p_user_id,
    p_user_id,
    'incomplete'
  )
  RETURNING id INTO v_company_id;

  -- Get the team_member_id created by the trigger
  SELECT id INTO v_team_member_id
  FROM team_members
  WHERE user_id = p_user_id AND company_id = v_company_id;

  -- If trigger didn't create team_member, create it now
  IF v_team_member_id IS NULL THEN
    INSERT INTO team_members (user_id, company_id, status, role, job_title, joined_at)
    VALUES (p_user_id, v_company_id, 'active', 'owner'::user_role, 'Owner', NOW())
    ON CONFLICT (user_id, company_id) DO UPDATE SET
      role = 'owner'::user_role,
      status = 'active'
    RETURNING id INTO v_team_member_id;
  END IF;

  -- Create company_memberships record for HR data
  INSERT INTO company_memberships (
    company_id,
    user_id,
    role,
    status,
    accepted_at,
    created_at,
    updated_at
  ) VALUES (
    v_company_id,
    p_user_id,
    'owner',
    'active',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT ON CONSTRAINT company_memberships_company_id_user_id_key DO UPDATE SET
    role = 'owner',
    status = 'active',
    updated_at = NOW()
  RETURNING id INTO v_company_membership_id;

  RETURN QUERY SELECT v_company_id, v_team_member_id, v_company_membership_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION create_company_with_owner TO authenticated;

-- Add comment
COMMENT ON FUNCTION create_company_with_owner IS
'Atomically creates a company with owner team_member and company_membership records.
All operations happen in a single transaction to prevent orphaned data.';

-- ============================================================================
-- 2. ADD UNIQUE CONSTRAINT ON company_memberships IF MISSING
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'company_memberships_company_id_user_id_key'
  ) THEN
    ALTER TABLE company_memberships
    ADD CONSTRAINT company_memberships_company_id_user_id_key
    UNIQUE (company_id, user_id);
  END IF;
END $$;

-- ============================================================================
-- 3. CLEANUP FUNCTION FOR INCOMPLETE ONBOARDING
-- ============================================================================

-- Function to mark orphaned/incomplete companies for cleanup
CREATE OR REPLACE FUNCTION mark_incomplete_companies_for_cleanup(
  p_days_old INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Mark companies that:
  -- 1. Have no subscription (incomplete status) for more than X days
  -- 2. Haven't completed onboarding
  UPDATE companies
  SET
    deleted_at = NOW(),
    deleted_by = NULL
  WHERE id IN (
    SELECT c.id
    FROM companies c
    WHERE c.deleted_at IS NULL
      AND c.stripe_subscription_status = 'incomplete'
      AND c.created_at < NOW() - (p_days_old || ' days')::INTERVAL
      AND NOT EXISTS (
        -- Don't delete if they have any real data
        SELECT 1 FROM jobs WHERE company_id = c.id AND deleted_at IS NULL LIMIT 1
      )
      AND NOT EXISTS (
        SELECT 1 FROM customers WHERE company_id = c.id AND deleted_at IS NULL LIMIT 1
      )
  );

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_incomplete_companies_for_cleanup IS
'Marks incomplete companies older than X days for soft deletion. Does not delete companies with customer/job data.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- To test the function:
-- SELECT * FROM create_company_with_owner(
--   'user-uuid',
--   'Test Company',
--   'test-company'
-- );
