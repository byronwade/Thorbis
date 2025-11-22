-- ============================================================================
-- ADD MISSING UPDATE POLICY FOR COMMUNICATIONS TABLE
-- ============================================================================
-- The communications table has RLS enabled but was missing an UPDATE policy,
-- which prevented marking emails/SMS as read. This migration adds the policy.
-- ============================================================================

-- Check if the function exists, if not create a simple version
DO $$
BEGIN
  -- Try to use get_user_company_ids() if it exists
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_user_company_ids') THEN
    -- Drop existing policy if it exists
    DROP POLICY IF EXISTS "Company members can update communications" ON communications;
    
    -- Create UPDATE policy using get_user_company_ids()
    CREATE POLICY "Company members can update communications"
    ON communications FOR UPDATE
    USING (
      company_id = ANY(get_user_company_ids())
    )
    WITH CHECK (
      company_id = ANY(get_user_company_ids())
    );
  ELSE
    -- Fallback: Use company_memberships table directly
    DROP POLICY IF EXISTS "Company members can update communications" ON communications;
    
    CREATE POLICY "Company members can update communications"
    ON communications FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.company_memberships
        WHERE company_memberships.user_id = auth.uid()
        AND company_memberships.company_id = communications.company_id
        AND company_memberships.status = 'active'
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.company_memberships
        WHERE company_memberships.user_id = auth.uid()
        AND company_memberships.company_id = communications.company_id
        AND company_memberships.status = 'active'
      )
    );
  END IF;
END $$;

