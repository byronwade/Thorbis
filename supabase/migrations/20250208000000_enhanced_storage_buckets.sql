-- ============================================================================
-- ENHANCED STORAGE BUCKETS CONFIGURATION
-- ============================================================================
-- This migration enhances existing storage buckets and adds new ones
-- with comprehensive file type support and security measures
--
-- New Buckets:
-- - customer-documents: Customer-specific files (contracts, forms, etc.)
-- - contracts: Legal contracts and agreements
-- - quarantine: Temporary storage for suspicious files during virus scanning
--
-- Updated Buckets:
-- - company-files: Increased to 250MB limit with broader file type support
-- ============================================================================

-- ============================================================================
-- UPDATE EXISTING BUCKETS
-- ============================================================================

-- Update company-files bucket with higher limit
UPDATE storage.buckets
SET 
  file_size_limit = 262144000, -- 250MB
  allowed_mime_types = NULL -- Allow all types (we'll use blocklist in app logic)
WHERE id = 'company-files';

-- Update documents bucket with higher limit
UPDATE storage.buckets
SET file_size_limit = 104857600 -- 100MB (up from 50MB)
WHERE id = 'documents';

-- Update job-photos bucket to support more formats
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/tiff'
]
WHERE id = 'job-photos';

-- ============================================================================
-- CREATE NEW BUCKETS
-- ============================================================================

-- Customer documents bucket (private, company members only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'customer-documents',
  'customer-documents',
  false, -- Private
  104857600, -- 100MB limit
  NULL -- Allow all types (blocklist enforced in app)
)
ON CONFLICT (id) DO UPDATE
SET 
  file_size_limit = 104857600,
  allowed_mime_types = NULL;

-- Contracts bucket (private, owner/admin only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contracts',
  'contracts',
  false, -- Private
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
  ];

-- Quarantine bucket (private, system only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'quarantine',
  'quarantine',
  false, -- Private
  262144000, -- 250MB limit
  NULL -- Accept any file type for quarantine
)
ON CONFLICT (id) DO UPDATE
SET 
  file_size_limit = 262144000,
  allowed_mime_types = NULL;

-- ============================================================================
-- STORAGE POLICIES - CUSTOMER DOCUMENTS BUCKET
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Company members can view customer documents" ON storage.objects;
DROP POLICY IF EXISTS "Company members can upload customer documents" ON storage.objects;
DROP POLICY IF EXISTS "Company members can update customer documents" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can delete customer documents" ON storage.objects;

-- Company members can view customer documents
CREATE POLICY "Company members can view customer documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can upload customer documents
CREATE POLICY "Company members can upload customer documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can update customer documents
CREATE POLICY "Company members can update customer documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company owners can delete customer documents
CREATE POLICY "Company owners can delete customer documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'customer-documents'
  AND EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id::text = (storage.foldername(name))[1]
    AND companies.owner_id = auth.uid()
  )
);

-- ============================================================================
-- STORAGE POLICIES - CONTRACTS BUCKET
-- ============================================================================

DROP POLICY IF EXISTS "Company owners can view contracts" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can upload contracts" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can update contracts" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can delete contracts" ON storage.objects;

-- Company owners and admins can view contracts
CREATE POLICY "Company owners can view contracts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contracts'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
    AND team_members.role IN ('owner', 'admin')
  )
);

-- Company owners and admins can upload contracts
CREATE POLICY "Company owners can upload contracts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contracts'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
    AND team_members.role IN ('owner', 'admin')
  )
);

-- Company owners and admins can update contracts
CREATE POLICY "Company owners can update contracts"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'contracts'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
    AND team_members.role IN ('owner', 'admin')
  )
);

-- Company owners can delete contracts
CREATE POLICY "Company owners can delete contracts"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'contracts'
  AND EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id::text = (storage.foldername(name))[1]
    AND companies.owner_id = auth.uid()
  )
);

-- ============================================================================
-- STORAGE POLICIES - QUARANTINE BUCKET
-- ============================================================================

DROP POLICY IF EXISTS "Service role can manage quarantine" ON storage.objects;

-- Only service role can access quarantine bucket
CREATE POLICY "Service role can manage quarantine"
ON storage.objects FOR ALL
USING (
  bucket_id = 'quarantine'
  AND auth.jwt()->>'role' = 'service_role'
);

-- ============================================================================
-- STORAGE CONFIGURATION COMPLETE
-- ============================================================================
-- Enhanced buckets with higher limits and comprehensive file type support
-- New customer-documents, contracts, and quarantine buckets
-- Proper RLS policies for multi-tenant security
-- ============================================================================

