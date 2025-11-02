-- Price Book Categories Migration
-- Materialized Path pattern for infinite nested categories

-- Create price_book_categories table
CREATE TABLE IF NOT EXISTS price_book_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Hierarchy fields (Materialized Path pattern)
  parent_id UUID REFERENCES price_book_categories(id) ON DELETE CASCADE,
  path TEXT NOT NULL, -- e.g., "1.3.5" - dot-separated IDs from root to this node
  level INTEGER NOT NULL DEFAULT 0, -- 0 = root, 1 = first level, etc.

  -- Ordering
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- UI/Display
  icon TEXT,
  color TEXT,

  -- Counts (denormalized for performance)
  item_count INTEGER NOT NULL DEFAULT 0, -- Direct items in this category
  descendant_item_count INTEGER NOT NULL DEFAULT 0, -- Items in this + all descendants

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(company_id, slug),
  UNIQUE(company_id, path)
);

-- Add category_id to price_book_items
ALTER TABLE price_book_items
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES price_book_categories(id) ON DELETE RESTRICT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON price_book_categories(company_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON price_book_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_path ON price_book_categories USING GIST (path gist_trgm_ops); -- For LIKE queries
CREATE INDEX IF NOT EXISTS idx_categories_level ON price_book_categories(level);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON price_book_categories(company_id, level, sort_order);
CREATE INDEX IF NOT EXISTS idx_price_book_items_category_id ON price_book_items(category_id);

-- Enable RLS
ALTER TABLE price_book_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for price_book_categories
CREATE POLICY "Users can view their company's categories"
  ON price_book_categories
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert categories in their company"
  ON price_book_categories
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Users can update their company's categories"
  ON price_book_categories
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
    )
  );

CREATE POLICY "Users can delete their company's categories"
  ON price_book_categories
  FOR DELETE
  USING (
    company_id IN (
      SELECT company_id FROM user_companies
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Function to update item counts when items are added/removed
CREATE OR REPLACE FUNCTION update_category_item_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update item_count for direct parent
  IF TG_OP = 'INSERT' THEN
    UPDATE price_book_categories
    SET item_count = item_count + 1
    WHERE id = NEW.category_id;

    -- Update descendant_item_count for all ancestors
    UPDATE price_book_categories
    SET descendant_item_count = descendant_item_count + 1
    WHERE NEW.category_id = id
       OR (SELECT path FROM price_book_categories WHERE id = NEW.category_id) LIKE path || '.%';

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE price_book_categories
    SET item_count = item_count - 1
    WHERE id = OLD.category_id;

    -- Update descendant_item_count for all ancestors
    UPDATE price_book_categories
    SET descendant_item_count = descendant_item_count - 1
    WHERE OLD.category_id = id
       OR (SELECT path FROM price_book_categories WHERE id = OLD.category_id) LIKE path || '.%';

  ELSIF TG_OP = 'UPDATE' AND NEW.category_id != OLD.category_id THEN
    -- Item moved to different category
    UPDATE price_book_categories
    SET item_count = item_count - 1
    WHERE id = OLD.category_id;

    UPDATE price_book_categories
    SET item_count = item_count + 1
    WHERE id = NEW.category_id;

    -- Update descendant counts
    UPDATE price_book_categories
    SET descendant_item_count = descendant_item_count - 1
    WHERE OLD.category_id = id
       OR (SELECT path FROM price_book_categories WHERE id = OLD.category_id) LIKE path || '.%';

    UPDATE price_book_categories
    SET descendant_item_count = descendant_item_count + 1
    WHERE NEW.category_id = id
       OR (SELECT path FROM price_book_categories WHERE id = NEW.category_id) LIKE path || '.%';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update counts
CREATE TRIGGER update_category_counts
AFTER INSERT OR UPDATE OR DELETE ON price_book_items
FOR EACH ROW
EXECUTE FUNCTION update_category_item_counts();

-- Seed default categories for existing companies
DO $$
DECLARE
  company RECORD;
  hvac_id UUID;
  heating_id UUID;
  cooling_id UUID;
  plumbing_id UUID;
  electrical_id UUID;
BEGIN
  FOR company IN SELECT id FROM companies LOOP
    -- HVAC (root level)
    INSERT INTO price_book_categories (company_id, name, slug, path, level, sort_order, icon, color)
    VALUES (company.id, 'HVAC', 'hvac', '1', 0, 1, 'Wind', '#3b82f6')
    RETURNING id INTO hvac_id;

    -- HVAC > Heating
    INSERT INTO price_book_categories (company_id, name, slug, parent_id, path, level, sort_order, icon)
    VALUES (company.id, 'Heating', 'heating', hvac_id, '1.1', 1, 1, 'Flame');

    -- HVAC > Cooling
    INSERT INTO price_book_categories (company_id, name, slug, parent_id, path, level, sort_order, icon)
    VALUES (company.id, 'Cooling', 'cooling', hvac_id, '1.2', 1, 2, 'Snowflake');

    -- Plumbing (root level)
    INSERT INTO price_book_categories (company_id, name, slug, path, level, sort_order, icon, color)
    VALUES (company.id, 'Plumbing', 'plumbing', '2', 0, 2, 'Droplet', '#10b981')
    RETURNING id INTO plumbing_id;

    -- Electrical (root level)
    INSERT INTO price_book_categories (company_id, name, slug, path, level, sort_order, icon, color)
    VALUES (company.id, 'Electrical', 'electrical', '3', 0, 3, 'Zap', '#f59e0b')
    RETURNING id INTO electrical_id;

    -- General (root level)
    INSERT INTO price_book_categories (company_id, name, slug, path, level, sort_order, icon, color)
    VALUES (company.id, 'General', 'general', '4', 0, 4, 'Wrench', '#6b7280');
  END LOOP;
END $$;

-- Update existing price_book_items to use categories
-- This is a one-time migration - map old text categories to new category IDs
UPDATE price_book_items
SET category_id = (
  SELECT id FROM price_book_categories
  WHERE price_book_items.company_id = price_book_categories.company_id
  AND LOWER(price_book_categories.name) = LOWER(price_book_items.category)
  LIMIT 1
)
WHERE category_id IS NULL AND category IS NOT NULL;

-- Set default category for items without a category
UPDATE price_book_items
SET category_id = (
  SELECT id FROM price_book_categories
  WHERE price_book_items.company_id = price_book_categories.company_id
  AND slug = 'general'
  LIMIT 1
)
WHERE category_id IS NULL;

-- Now make category_id NOT NULL (after migration)
ALTER TABLE price_book_items
  ALTER COLUMN category_id SET NOT NULL;

COMMENT ON TABLE price_book_categories IS 'Infinite nested categories for price book items using Materialized Path pattern';
COMMENT ON COLUMN price_book_categories.path IS 'Dot-separated path from root (e.g., "1.3.5"). Used for querying all descendants with LIKE queries';
COMMENT ON COLUMN price_book_categories.level IS 'Depth in tree: 0 = root, 1 = first level child, etc.';
COMMENT ON COLUMN price_book_categories.item_count IS 'Count of items directly in this category (not including descendants)';
COMMENT ON COLUMN price_book_categories.descendant_item_count IS 'Count of items in this category AND all descendant categories';
