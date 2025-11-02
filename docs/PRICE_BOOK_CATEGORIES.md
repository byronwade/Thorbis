# Price Book - Infinite Nested Categories System

## 🎯 Overview

The price book now supports **infinite nested categories** using the **Materialized Path pattern** - allowing business owners to organize items exactly how they want, with unlimited subcategory depth.

## 📊 Database Architecture

### Materialized Path Pattern

**Why this pattern?**
- ✅ Simple to understand and implement
- ✅ Fast queries for all descendants
- ✅ Easy breadcrumb navigation
- ✅ Good balance between read/write performance
- ✅ PostgreSQL and SQLite compatible

### Schema: `price_book_categories`

```sql
CREATE TABLE price_book_categories (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies(id),

  -- Core fields
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Hierarchy (Materialized Path)
  parent_id UUID REFERENCES price_book_categories(id),
  path TEXT NOT NULL,  -- e.g., "1.3.5"
  level INTEGER NOT NULL DEFAULT 0,  -- 0 = root, 1 = child, etc.

  -- Ordering
  sort_order INTEGER DEFAULT 0,

  -- UI/Display
  icon TEXT,  -- Lucide icon name
  color TEXT,  -- Hex color

  -- Performance (denormalized)
  item_count INTEGER DEFAULT 0,  -- Direct items
  descendant_item_count INTEGER DEFAULT 0,  -- All items in tree

  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Example Tree Structure

```
HVAC (path: "1", level: 0)
  └─ Heating (path: "1.1", level: 1)
     ├─ Furnaces (path: "1.1.1", level: 2)
     │  ├─ Gas Furnaces (path: "1.1.1.1", level: 3)
     │  └─ Electric Furnaces (path: "1.1.1.2", level: 3)
     └─ Boilers (path: "1.1.2", level: 2)
  └─ Cooling (path: "1.2", level: 1)
     ├─ Air Conditioning (path: "1.2.1", level: 2)
     └─ Heat Pumps (path: "1.2.2", level: 2)

Plumbing (path: "2", level: 0)
  └─ Residential (path: "2.1", level: 1)
     ├─ Water Heaters (path: "2.1.1", level: 2)
     └─ Fixtures (path: "2.1.2", level: 2)
  └─ Commercial (path: "2.2", level: 1)
```

## 🔍 Key Queries

### Get All Descendants

```sql
-- Get all categories under "HVAC > Heating"
SELECT * FROM price_book_categories
WHERE path LIKE '1.1.%'
ORDER BY path;
```

### Get Breadcrumb Path

```sql
-- Get full path from root to category
WITH RECURSIVE breadcrumb AS (
  SELECT * FROM price_book_categories WHERE id = :category_id
  UNION ALL
  SELECT c.* FROM price_book_categories c
  JOIN breadcrumb b ON c.id = b.parent_id
)
SELECT * FROM breadcrumb ORDER BY level;
```

### Get Direct Children

```sql
-- Get immediate children only
SELECT * FROM price_book_categories
WHERE parent_id = :category_id
ORDER BY sort_order;
```

### Get Items in Category (including descendants)

```sql
-- Get all items in this category and all subcategories
SELECT i.* FROM price_book_items i
JOIN price_book_categories c ON i.category_id = c.id
WHERE c.path LIKE (
  SELECT path || '%' FROM price_book_categories WHERE id = :category_id
);
```

## 🎨 UI/UX Patterns

### 1. **Collapsible Tree View** (Primary Navigation)

```
▼ HVAC (45 items)
  ▼ Heating (20 items)
    ▼ Furnaces (12 items)
      - Gas Furnaces (7 items)
      - Electric Furnaces (5 items)
    ▶ Boilers (8 items)
  ▶ Cooling (25 items)
▶ Plumbing (30 items)
```

**Features:**
- Click to expand/collapse
- Shows item counts (direct + descendants)
- Color-coded icons per category
- Hover menu for quick actions
- Drag & drop to reorganize (future)

### 2. **Breadcrumb Navigation** (Current Path)

```
All Categories > HVAC > Heating > Furnaces > Gas Furnaces
```

**Benefits:**
- Shows where you are
- Click any level to navigate back
- Always visible at top

### 3. **Smart Search** (Find Across All Categories)

```
Search: "gas"
Results:
  └─ HVAC > Heating > Furnaces > Gas Furnaces (7 items)
  └─ HVAC > Heating > Boilers > Gas Boilers (3 items)
  └─ Plumbing > Water Heaters > Gas Water Heaters (5 items)
```

## 📦 Rich Line Item Data

Each `price_book_items` entry can have extensive data:

### Core Fields
- `category_id` - Links to category
- `name`, `description`, `sku`
- `cost`, `price`, `markup_percent`
- `item_type` - service, material, package

### Rich Media
- `image_url` - Primary image
- `images` - Array of additional images
- `documents` - PDFs, specs, manuals

### Extended Data
- `tags` - Flexible tagging (JSON array)
- `metadata` - Custom fields (JSON object)
- `notes` - Internal notes

### Relationships
- `supplier_id` - Link to supplier
- `labor_hours` - Time estimates
- `components` - For packages (materials included)

### Example Extended Metadata

```json
{
  "warranty_years": 10,
  "brand": "Carrier",
  "model_number": "59TN6A060V21",
  "efficiency_rating": "96% AFUE",
  "btu_capacity": 60000,
  "weight_lbs": 180,
  "dimensions": {
    "height": 54,
    "width": 22,
    "depth": 32
  },
  "certifications": ["ENERGY STAR", "AHRI"],
  "installation_difficulty": "professional_required",
  "estimated_install_time_hours": 6
}
```

## 🚀 Usage Examples

### Component Integration

```tsx
import { CategoryTreeNavigator } from "@/components/work/category-tree-navigator";

function PriceBookPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <div className="flex h-full">
      {/* Left Sidebar: Category Tree */}
      <div className="w-80 border-r">
        <CategoryTreeNavigator
          categories={categories}
          selectedCategoryId={selectedCategory?.id}
          onCategorySelect={setSelectedCategory}
          onCategoryCreate={handleCategoryCreate}
          onCategoryEdit={handleCategoryEdit}
          onCategoryDelete={handleCategoryDelete}
        />
      </div>

      {/* Right Content: Items in Selected Category */}
      <div className="flex-1">
        {selectedCategory ? (
          <PriceBookTable
            categoryId={selectedCategory.id}
            includeDescendants={true}
          />
        ) : (
          <PriceBookTable />  {/* All items */}
        )}
      </div>
    </div>
  );
}
```

### Query Helpers

```ts
// Get category with full path info
async function getCategoryWithPath(categoryId: string) {
  const category = await db.query.priceBookCategories.findFirst({
    where: eq(priceBookCategories.id, categoryId),
  });

  // Get breadcrumb path
  const ancestors = await db.query.priceBookCategories.findMany({
    where: sql`${category.path} LIKE ${priceBookCategories.path} || '.%'`,
    orderBy: [priceBookCategories.level],
  });

  return { category, ancestors };
}

// Move category to new parent
async function moveCategory(categoryId: string, newParentId: string | null) {
  const category = await db.query.priceBookCategories.findFirst({
    where: eq(priceBookCategories.id, categoryId),
  });

  const newParent = newParentId
    ? await db.query.priceBookCategories.findFirst({
        where: eq(priceBookCategories.id, newParentId),
      })
    : null;

  // Calculate new path
  const newPath = newParent
    ? `${newParent.path}.${categoryId}`
    : categoryId;

  // Update category and all descendants
  await db.update(priceBookCategories)
    .set({
      parentId: newParentId,
      path: newPath,
      level: newParent ? newParent.level + 1 : 0,
    })
    .where(eq(priceBookCategories.id, categoryId));

  // Update all descendant paths
  // (This is more complex - need to update all children's paths)
}
```

## 🔧 Migration Guide

### From Old Schema (text categories)

```sql
-- Old schema
category: "HVAC"
subcategory: "Heating"

-- New schema
category_id: "uuid-of-hvac-heating-category"
```

**Migration is handled automatically** by the migration file:
1. Seeds default categories for all companies
2. Maps old text categories to new category IDs
3. Sets `category_id` for all existing items

### Adding Custom Categories

```ts
// Create new category
await db.insert(priceBookCategories).values({
  companyId: "...",
  name: "Emergency Services",
  slug: "emergency-services",
  parentId: null,  // Root level
  path: "5",  // Next root path
  level: 0,
  sortOrder: 5,
  icon: "AlertTriangle",
  color: "#ef4444",
});

// Create subcategory
await db.insert(priceBookCategories).values({
  companyId: "...",
  name: "After Hours",
  slug: "after-hours",
  parentId: parentCategoryId,
  path: "5.1",  // Under parent's path
  level: 1,
  sortOrder: 1,
});
```

## 📈 Performance Considerations

### Indexes

```sql
-- Essential indexes for performance
CREATE INDEX idx_categories_path ON price_book_categories USING GIST (path gist_trgm_ops);
CREATE INDEX idx_categories_parent_id ON price_book_categories(parent_id);
CREATE INDEX idx_categories_company_level ON price_book_categories(company_id, level);
CREATE INDEX idx_items_category_id ON price_book_items(category_id);
```

### Denormalized Counts

The `item_count` and `descendant_item_count` fields are **automatically maintained** via database triggers:

```sql
CREATE TRIGGER update_category_counts
AFTER INSERT OR UPDATE OR DELETE ON price_book_items
FOR EACH ROW
EXECUTE FUNCTION update_category_item_counts();
```

This means:
- ✅ Category counts always accurate
- ✅ No need to COUNT() on every query
- ✅ Instant UI updates
- ⚠️ Slight overhead on item INSERT/UPDATE/DELETE (negligible)

## 🎯 Best Practices

### Category Organization

1. **Start Broad, Go Specific**
   ```
   ✅ HVAC > Residential > Heating > Furnaces > Gas
   ❌ Gas Furnaces (too specific at root level)
   ```

2. **Use Consistent Naming**
   ```
   ✅ Commercial, Residential
   ❌ Commercial, House/Home
   ```

3. **Limit Root Categories (3-7)**
   ```
   ✅ HVAC, Plumbing, Electrical, General
   ❌ 20+ root categories (overwhelming)
   ```

4. **Use Icons & Colors**
   - Makes scanning faster
   - Visual hierarchy
   - Brand consistency

### Search & Filtering

- **Always offer "All Categories" view** (null category filter)
- **Search across all levels** (don't just search category names)
- **Highlight breadcrumb path** in search results
- **Auto-expand parent categories** when navigating to deep item

## 🔮 Future Enhancements

- [ ] Drag & drop to reorganize categories
- [ ] Bulk move items between categories
- [ ] Category templates (duplicate structure to new company)
- [ ] Category-level pricing rules (auto-markup by category)
- [ ] Smart category suggestions (AI-based)
- [ ] Category analytics (which categories drive most revenue)
- [ ] Custom category fields (different fields per category type)

## 🤝 Contributing

When adding features to the category system:

1. **Preserve the path** - Don't break the materialized path
2. **Update counts** - Ensure triggers maintain counts
3. **Test deep nesting** - Test with 5+ levels
4. **Check performance** - Test with 1000+ categories
5. **Mobile UI** - Ensure tree works on mobile

---

**Questions?** See the implementation in:
- Schema: `/src/lib/db/schema.ts`
- Migration: `/supabase/migrations/20250131000000_price_book_categories.sql`
- UI Component: `/src/components/work/category-tree-navigator.tsx`
