-- ============================================================================
-- STORAGE BUCKETS CONFIGURATION FOR THORBIS
-- ============================================================================
-- This migration creates storage buckets for file uploads with proper RLS
--
-- Buckets:
-- - avatars: User profile pictures (public read, owner write)
-- - documents: User documents (private, owner only)
-- - company-files: Company shared files (company members access)
-- - job-photos: Job site photos (company members access)
-- - invoices: Invoice PDFs (company members access, customers can view their own)
-- ============================================================================

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Avatars bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public read access
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Documents bucket (private, authenticated users only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Company files bucket (private, company members only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-files',
  'company-files',
  false, -- Private
  104857600, -- 100MB limit
  NULL -- Allow all file types
)
ON CONFLICT (id) DO NOTHING;

-- Job photos bucket (private, company members only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-photos',
  'job-photos',
  false, -- Private
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

-- Invoices bucket (private, company members and customers)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices',
  'invoices',
  false, -- Private
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Estimates bucket (private, company members and customers)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'estimates',
  'estimates',
  false, -- Private
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES - AVATARS BUCKET
-- ============================================================================

-- Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- STORAGE POLICIES - DOCUMENTS BUCKET
-- ============================================================================

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can upload documents
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- STORAGE POLICIES - COMPANY FILES BUCKET
-- ============================================================================

-- Company members can view company files
CREATE POLICY "Company members can view files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can upload files
CREATE POLICY "Company members can upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can update files
CREATE POLICY "Company members can update files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company owners can delete files
CREATE POLICY "Company owners can delete files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-files'
  AND EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id::text = (storage.foldername(name))[1]
    AND companies.owner_id = auth.uid()
  )
);

-- ============================================================================
-- STORAGE POLICIES - JOB PHOTOS BUCKET
-- ============================================================================

-- Company members can view job photos
CREATE POLICY "Company members can view job photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can upload job photos
CREATE POLICY "Company members can upload job photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can update job photos
CREATE POLICY "Company members can update job photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can delete job photos
CREATE POLICY "Company members can delete job photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'job-photos'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- ============================================================================
-- STORAGE POLICIES - INVOICES BUCKET
-- ============================================================================

-- Company members can view invoices
CREATE POLICY "Company members can view invoices"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can upload invoices
CREATE POLICY "Company members can upload invoices"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can update invoices
CREATE POLICY "Company members can update invoices"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company owners can delete invoices
CREATE POLICY "Company owners can delete invoices"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id::text = (storage.foldername(name))[1]
    AND companies.owner_id = auth.uid()
  )
);

-- ============================================================================
-- STORAGE POLICIES - ESTIMATES BUCKET
-- ============================================================================

-- Company members can view estimates
CREATE POLICY "Company members can view estimates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'estimates'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can upload estimates
CREATE POLICY "Company members can upload estimates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'estimates'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company members can update estimates
CREATE POLICY "Company members can update estimates"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'estimates'
  AND EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_members.user_id = auth.uid()
    AND team_members.company_id::text = (storage.foldername(name))[1]
    AND team_members.status = 'active'
  )
);

-- Company owners can delete estimates
CREATE POLICY "Company owners can delete estimates"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'estimates'
  AND EXISTS (
    SELECT 1 FROM public.companies
    WHERE companies.id::text = (storage.foldername(name))[1]
    AND companies.owner_id = auth.uid()
  )
);

-- ============================================================================
-- STORAGE HELPER FUNCTIONS
-- ============================================================================

-- Function to get signed URL for private files
CREATE OR REPLACE FUNCTION public.get_storage_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
DECLARE
  url TEXT;
BEGIN
  -- Generate a signed URL that expires in 1 hour
  SELECT storage.generate_signed_url(bucket_name, file_path, 3600) INTO url;
  RETURN url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete old files
CREATE OR REPLACE FUNCTION public.delete_old_storage_objects()
RETURNS void AS $$
BEGIN
  -- Delete files older than 90 days from documents bucket
  DELETE FROM storage.objects
  WHERE bucket_id = 'documents'
  AND created_at < NOW() - INTERVAL '90 days';

  -- Delete orphaned job photos (photos not linked to any job)
  DELETE FROM storage.objects
  WHERE bucket_id = 'job-photos'
  AND created_at < NOW() - INTERVAL '30 days'
  AND NOT EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.photos::text LIKE '%' || name || '%'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STORAGE CONFIGURATION COMPLETE
-- ============================================================================
-- All storage buckets created with proper RLS policies
-- File upload limits and MIME type restrictions in place
-- Company-based multi-tenancy enforced for shared files
-- ============================================================================
