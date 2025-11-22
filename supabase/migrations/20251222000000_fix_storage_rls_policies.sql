-- ============================================================================
-- FIX STORAGE RLS POLICIES - Update team_members to company_memberships
-- ============================================================================
-- The storage policies reference team_members but the actual table is
-- company_memberships. This migration fixes all storage bucket policies.
-- ============================================================================

-- ============================================================================
-- FIX CUSTOMER-DOCUMENTS BUCKET POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Company members can view customer documents" ON storage.objects;
DROP POLICY IF EXISTS "Company members can upload customer documents" ON storage.objects;
DROP POLICY IF EXISTS "Company members can update customer documents" ON storage.objects;

-- Recreate with correct table name
CREATE POLICY "Company members can view customer documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

CREATE POLICY "Company members can upload customer documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

CREATE POLICY "Company members can update customer documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

-- ============================================================================
-- FIX COMPANY-FILES BUCKET POLICIES
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Company members can view files" ON storage.objects;
DROP POLICY IF EXISTS "Company members can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Company members can update files" ON storage.objects;

-- Recreate with correct table name
CREATE POLICY "Company members can view files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

CREATE POLICY "Company members can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

CREATE POLICY "Company members can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.company_memberships
    WHERE company_memberships.user_id = auth.uid()
    AND company_memberships.company_id::text = (storage.foldername(name))[1]
    AND company_memberships.status = 'active'
  )
);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

