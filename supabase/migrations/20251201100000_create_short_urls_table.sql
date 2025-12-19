-- Create short_urls table for URL shortening service
-- Used for SMS messages and marketing links

CREATE TABLE IF NOT EXISTS public.short_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ,
    track_clicks BOOLEAN DEFAULT TRUE,
    click_count INTEGER DEFAULT 0,
    last_clicked_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT short_urls_code_length CHECK (char_length(code) >= 4 AND char_length(code) <= 12)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON public.short_urls(code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_short_urls_company_id ON public.short_urls(company_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_short_urls_original_url ON public.short_urls(original_url, company_id) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE public.short_urls ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access short URLs for their company
CREATE POLICY "short_urls_select_own_company" ON public.short_urls
    FOR SELECT
    USING (company_id IN (
        SELECT company_id FROM public.company_memberships
        WHERE user_id = auth.uid()
        AND status = 'active'
    ));

CREATE POLICY "short_urls_insert_own_company" ON public.short_urls
    FOR INSERT
    WITH CHECK (company_id IN (
        SELECT company_id FROM public.company_memberships
        WHERE user_id = auth.uid()
        AND status = 'active'
    ));

CREATE POLICY "short_urls_update_own_company" ON public.short_urls
    FOR UPDATE
    USING (company_id IN (
        SELECT company_id FROM public.company_memberships
        WHERE user_id = auth.uid()
        AND status = 'active'
    ));

CREATE POLICY "short_urls_delete_own_company" ON public.short_urls
    FOR DELETE
    USING (company_id IN (
        SELECT company_id FROM public.company_memberships
        WHERE user_id = auth.uid()
        AND status = 'active'
    ));

-- Allow anonymous access for redirect resolution (needed for /s/[code] route)
CREATE POLICY "short_urls_public_read_for_redirect" ON public.short_urls
    FOR SELECT
    TO anon
    USING (deleted_at IS NULL);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_short_urls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_short_urls_updated_at ON public.short_urls;
CREATE TRIGGER trigger_short_urls_updated_at
    BEFORE UPDATE ON public.short_urls
    FOR EACH ROW
    EXECUTE FUNCTION update_short_urls_updated_at();

-- Add comment
COMMENT ON TABLE public.short_urls IS 'URL shortening service for SMS and marketing links';
