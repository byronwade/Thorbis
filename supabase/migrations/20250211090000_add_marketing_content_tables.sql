-- ============================================================================
-- BLOG & RESOURCE CONTENT TABLES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'content_status'
  ) THEN
    CREATE TYPE content_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'resource_type'
  ) THEN
    CREATE TYPE resource_type AS ENUM ('case_study', 'webinar', 'template', 'guide', 'community', 'status_update');
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'published'
     AND NEW.published_at IS NULL THEN
    NEW.published_at = TIMEZONE('utc', NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  hero_image_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  reading_time INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  search_vector TSVECTOR NOT NULL DEFAULT ''::tsvector,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.content_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS public.resource_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  hero_image_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  type resource_type NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  event_start_at TIMESTAMPTZ,
  event_end_at TIMESTAMPTZ,
  registration_url TEXT,
  download_url TEXT,
  cta_label TEXT,
  cta_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  search_vector TSVECTOR NOT NULL DEFAULT ''::tsvector,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE IF NOT EXISTS public.resource_item_tags (
  resource_item_id UUID NOT NULL REFERENCES public.resource_items(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.content_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_item_id, tag_id)
);

CREATE OR REPLACE FUNCTION public.blog_posts_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.seo_keywords, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.resource_items_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.type::text, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_authors_set_updated_at
BEFORE UPDATE ON public.blog_authors
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER blog_categories_set_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER blog_posts_set_published_at
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_published_at();

CREATE TRIGGER blog_posts_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.blog_posts_search_vector_update();

CREATE TRIGGER resource_items_set_updated_at
BEFORE UPDATE ON public.resource_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER resource_items_set_published_at
BEFORE INSERT OR UPDATE ON public.resource_items
FOR EACH ROW
EXECUTE FUNCTION public.set_published_at();

CREATE TRIGGER resource_items_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.resource_items
FOR EACH ROW
EXECUTE FUNCTION public.resource_items_search_vector_update();

CREATE INDEX IF NOT EXISTS blog_authors_slug_idx ON public.blog_authors (slug);
CREATE INDEX IF NOT EXISTS blog_categories_slug_idx ON public.blog_categories (slug);
CREATE INDEX IF NOT EXISTS content_tags_slug_idx ON public.content_tags (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON public.blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_search_vector_idx ON public.blog_posts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS resource_items_status_idx ON public.resource_items (status, type, published_at DESC);
CREATE INDEX IF NOT EXISTS resource_items_search_vector_idx ON public.resource_items USING GIN (search_vector);

ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_item_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read blog authors"
ON public.blog_authors
FOR SELECT
USING (true);

CREATE POLICY "Authenticated manage blog authors"
ON public.blog_authors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read blog categories"
ON public.blog_categories
FOR SELECT
USING (true);

CREATE POLICY "Authenticated manage blog categories"
ON public.blog_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read content tags"
ON public.content_tags
FOR SELECT
USING (true);

CREATE POLICY "Authenticated manage content tags"
ON public.content_tags
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read published blog posts"
ON public.blog_posts
FOR SELECT
USING (
  status = 'published'
  AND (published_at IS NULL OR published_at <= TIMEZONE('utc', NOW()))
);

CREATE POLICY "Authenticated manage blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read blog post tags"
ON public.blog_post_tags
FOR SELECT
USING (true);

CREATE POLICY "Authenticated manage blog post tags"
ON public.blog_post_tags
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read published resource items"
ON public.resource_items
FOR SELECT
USING (
  status = 'published'
  AND (published_at IS NULL OR published_at <= TIMEZONE('utc', NOW()))
);

CREATE POLICY "Authenticated manage resource items"
ON public.resource_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Public read resource item tags"
ON public.resource_item_tags
FOR SELECT
USING (true);

CREATE POLICY "Authenticated manage resource item tags"
ON public.resource_item_tags
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

