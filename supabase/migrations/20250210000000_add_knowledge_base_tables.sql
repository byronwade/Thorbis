-- ============================================================================
-- KNOWLEDGE BASE TABLES
-- ============================================================================
-- This migration creates tables for the SEO-first knowledge base:
-- - kb_categories: Hierarchical category structure
-- - kb_tags: Tag system for cross-categorization
-- - kb_articles: Article content with metadata
-- - kb_article_tags: Many-to-many relationship between articles and tags
-- - kb_article_related: Related articles relationships
-- - kb_feedback: User feedback (helpful/not helpful, comments)
-- ============================================================================

-- ============================================================================
-- SECTION 1: CREATE TABLES
-- ============================================================================

-- Knowledge Base Categories
CREATE TABLE IF NOT EXISTS kb_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  parent_id UUID REFERENCES kb_categories(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge Base Tags
CREATE TABLE IF NOT EXISTS kb_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge Base Articles
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT, -- Brief description for SEO and previews
  content TEXT NOT NULL, -- Markdown content
  html_content TEXT, -- Rendered HTML (cached)
  category_id UUID NOT NULL REFERENCES kb_categories(id) ON DELETE CASCADE,
  featured_image TEXT, -- URL to featured image
  author TEXT, -- Author name
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  not_helpful_count INTEGER NOT NULL DEFAULT 0,
  -- SEO metadata
  meta_title TEXT, -- Custom SEO title
  meta_description TEXT, -- Custom SEO description
  keywords JSONB, -- Array of keywords
  -- Full-text search vector
  search_vector tsvector, -- tsvector for full-text search
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Unique constraint: slug must be unique within a category
  UNIQUE(slug, category_id)
);

-- Knowledge Base Article Tags (Many-to-many)
CREATE TABLE IF NOT EXISTS kb_article_tags (
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES kb_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, tag_id)
);

-- Knowledge Base Related Articles
CREATE TABLE IF NOT EXISTS kb_article_related (
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  related_article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (article_id, related_article_id),
  CHECK (article_id != related_article_id) -- Prevent self-reference
);

-- Knowledge Base Feedback
CREATE TABLE IF NOT EXISTS kb_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  helpful BOOLEAN, -- true = helpful, false = not helpful, null = comment only
  comment TEXT,
  user_email TEXT, -- Optional user email
  user_agent TEXT, -- Browser user agent
  ip_address TEXT, -- IP address (for analytics)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: CREATE INDEXES
-- ============================================================================

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_kb_categories_parent_id ON kb_categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kb_categories_slug ON kb_categories(slug);
CREATE INDEX IF NOT EXISTS idx_kb_categories_active ON kb_categories(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_kb_categories_order ON kb_categories("order");

-- Tag indexes
CREATE INDEX IF NOT EXISTS idx_kb_tags_slug ON kb_tags(slug);

-- Article indexes
CREATE INDEX IF NOT EXISTS idx_kb_articles_category_id ON kb_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_slug ON kb_articles(slug);
CREATE INDEX IF NOT EXISTS idx_kb_articles_published ON kb_articles(published, published_at DESC) WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_kb_articles_featured ON kb_articles(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_kb_articles_views ON kb_articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_kb_articles_updated ON kb_articles(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_kb_articles_category_published ON kb_articles(category_id, published, published_at DESC) WHERE published = TRUE;

-- Full-text search index (GIN)
CREATE INDEX IF NOT EXISTS idx_kb_articles_search ON kb_articles USING gin(search_vector);

-- Article tags indexes
CREATE INDEX IF NOT EXISTS idx_kb_article_tags_article_id ON kb_article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_kb_article_tags_tag_id ON kb_article_tags(tag_id);

-- Related articles indexes
CREATE INDEX IF NOT EXISTS idx_kb_article_related_article_id ON kb_article_related(article_id);
CREATE INDEX IF NOT EXISTS idx_kb_article_related_related_id ON kb_article_related(related_article_id);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_kb_feedback_article_id ON kb_feedback(article_id);
CREATE INDEX IF NOT EXISTS idx_kb_feedback_helpful ON kb_feedback(article_id, helpful) WHERE helpful IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_kb_feedback_created ON kb_feedback(created_at DESC);

-- ============================================================================
-- SECTION 3: CREATE FULL-TEXT SEARCH FUNCTION AND TRIGGER
-- ============================================================================

-- Function to update search vector for articles
CREATE OR REPLACE FUNCTION kb_articles_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.meta_title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.meta_description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector
CREATE TRIGGER tsvector_update_kb_articles
  BEFORE INSERT OR UPDATE ON kb_articles
  FOR EACH ROW EXECUTE FUNCTION kb_articles_search_trigger();

-- ============================================================================
-- SECTION 4: CREATE UPDATED_AT TRIGGER
-- ============================================================================

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_kb_categories_updated_at
  BEFORE UPDATE ON kb_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 5: ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all KB tables
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_article_related ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_feedback ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 6: CREATE RLS POLICIES (PUBLIC READ ACCESS)
-- ============================================================================

-- Categories: Public read access
CREATE POLICY "Public can view active categories"
  ON kb_categories FOR SELECT
  USING (is_active = TRUE);

-- Tags: Public read access
CREATE POLICY "Public can view tags"
  ON kb_tags FOR SELECT
  USING (TRUE);

-- Articles: Public read access for published articles
CREATE POLICY "Public can view published articles"
  ON kb_articles FOR SELECT
  USING (published = TRUE);

-- Article tags: Public read access
CREATE POLICY "Public can view article tags"
  ON kb_article_tags FOR SELECT
  USING (TRUE);

-- Related articles: Public read access
CREATE POLICY "Public can view related articles"
  ON kb_article_related FOR SELECT
  USING (TRUE);

-- Feedback: Public can insert (submit feedback), but not read (privacy)
CREATE POLICY "Public can submit feedback"
  ON kb_feedback FOR INSERT
  WITH CHECK (TRUE);

-- ============================================================================
-- SECTION 7: ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE kb_categories IS 'Hierarchical category structure for knowledge base articles';
COMMENT ON TABLE kb_tags IS 'Tag system for cross-categorization of articles';
COMMENT ON TABLE kb_articles IS 'Knowledge base articles with markdown content and SEO metadata';
COMMENT ON TABLE kb_article_tags IS 'Many-to-many relationship between articles and tags';
COMMENT ON TABLE kb_article_related IS 'Related articles relationships for content discovery';
COMMENT ON TABLE kb_feedback IS 'User feedback on articles (helpful/not helpful, comments)';

COMMENT ON COLUMN kb_articles.search_vector IS 'Full-text search vector (tsvector) for PostgreSQL search';
COMMENT ON COLUMN kb_articles.html_content IS 'Cached rendered HTML from markdown content';
COMMENT ON COLUMN kb_articles.meta_title IS 'Custom SEO title (overrides default title)';
COMMENT ON COLUMN kb_articles.meta_description IS 'Custom SEO description (overrides default excerpt)';
COMMENT ON COLUMN kb_articles.keywords IS 'Array of SEO keywords in JSONB format';

