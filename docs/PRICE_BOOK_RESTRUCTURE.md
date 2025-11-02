# Price Book Restructure - Industry Best Practices

## 🎯 Overview

The price book system has been completely restructured based on research of leading field service software platforms (ServiceTitan, Housecall Pro, Jobber) to follow industry best practices while maintaining our table layout approach.

## 📊 Research Findings

### Key Insights from Industry Leaders

**1. ServiceTitan's Approach (Market Leader)**
- Three distinct item types: Services, Materials, Equipment
- Hierarchical categories with subcategories
- Numerical ordering for consistency
- Mobile-first design with required category assignment

**2. Flat-Rate Pricing Standards**
- "Good, Better, Best" pricing tiers are industry standard
- Separate pricing for service types (repair, maintenance, installation)
- Predetermined flat rates for residential work
- Hourly + materials for commercial projects

**3. Organization Best Practices**
- Organize by business units (HVAC, Plumbing, Electrical)
- Use visual indicators (colors, icons)
- Show category hierarchy in table view
- Include images/thumbnails for quick identification
- Support multi-level filtering

## ✨ New Features Implemented

### 1. **Three Item Types** (ServiceTitan Pattern)
```typescript
export type PriceBookItemType = "service" | "material" | "equipment";
```

**Services**: Labor-based offerings with hourly rates
- Examples: Inspections, Installations, Repairs, Maintenance
- Includes labor hours tracking
- Supports flat-rate pricing

**Materials**: Parts and supplies used in jobs
- Examples: Pipes, Wires, Filters, Breakers
- Tracked by unit (each, foot, pound, etc.)
- Supplier integration ready

**Equipment**: Large items with serial numbers
- Examples: AC Units, Furnaces, Water Heaters, Panels
- Higher cost items requiring installation
- Warranty tracking capable

### 2. **Hierarchical Categories with Subcategories**
```typescript
category: "HVAC"
subcategory: "Heating › Furnaces"  // Multi-level hierarchy
```

**Display Pattern**: Category › Subcategory › Sub-subcategory

**Examples**:
- HVAC › Heating › Furnaces › Gas Furnaces
- Plumbing › Installation › Water Heaters
- Electrical › Repairs

**Benefits**:
- Clear visual hierarchy in table
- Easy filtering by category level
- Supports unlimited nesting
- Color-coded icons per category

### 3. **Pricing Tiers** (Good/Better/Best)
```typescript
export type PricingTier = "standard" | "good" | "better" | "best";
```

**Standard**: Base pricing (no badge shown)
**Good**: Entry-level premium tier (green badge)
**Better**: Mid-level premium tier (blue badge)
**Best**: Top-tier premium service (purple badge)

**Example Use Case**:
```
Furnace Tune-Up - Good:  $149 (1.0 hours)
Furnace Tune-Up - Better: $199 (1.5 hours + filter)
Furnace Tune-Up - Best:   $299 (2.0 hours + warranty)
```

### 4. **Visual Enhancements**

**Image Thumbnails** (Housecall Pro Pattern)
- 40x40px thumbnail column (leftmost)
- Fallback icon for items without images
- Quick visual identification

**Labor Hours Display** (Services Only)
- Shows estimated hours for services
- Format: "1.5 hrs"
- Hidden for materials and equipment

**Flat-Rate Indicator**
- Badge shows "Flat Rate" for predetermined pricing
- Distinguishes from hourly + materials pricing

**Category Icons with Colors**
- HVAC: Zap icon (blue)
- Plumbing: Wrench icon (green)
- Electrical: Zap icon (yellow)
- General: Package icon (gray)

### 5. **Enhanced Data Structure**
```typescript
export type PriceBookItem = {
  id: string;
  itemType: PriceBookItemType;
  name: string;
  description?: string;
  sku: string;

  // Hierarchical categories
  category: string;
  subcategory: string | null;

  // Pricing
  cost: number;
  price: number;
  priceTier?: PricingTier;
  markupPercent: number;

  // Service-specific
  laborHours?: number;

  // Display
  unit: string;
  imageUrl?: string | null;

  // Status
  isActive: boolean;
  isFlatRate: boolean;

  // Integration
  supplierName: string | null;
  supplierSku?: string | null;

  // Metadata
  tags?: string[];
  lastUpdated?: Date;
};
```

### 6. **Enhanced Search & Filtering**

**Searchable Fields**:
- Item name
- SKU (both internal and supplier)
- Category and subcategory
- Description
- Supplier name
- Tags

**Search Placeholder**: "Search by name, SKU, category, or tags..."

**Benefits**:
- Find items across all metadata
- Tag-based organization
- Supplier integration ready

## 📋 Table Column Layout

| Column | Width | Mobile | Description |
|--------|-------|--------|-------------|
| Image | 40px | Hidden | Thumbnail or fallback icon |
| Item Name | Flex | Visible | Name + SKU + Tier badge + Flat-rate indicator |
| Type | 112px | Hidden | Service/Material/Equipment badge |
| Category | 192px | Hidden | Category › Subcategory with icon |
| Labor | 80px | Hidden | Labor hours (services only) |
| Cost | 96px | Hidden | Internal cost |
| Price | 112px | Visible | Selling price + unit |
| Markup | 80px | Hidden | Markup percentage |
| Status | 96px | Hidden | Active/Inactive badge |
| Actions | 48px | Visible | Dropdown menu |

**Responsive Design**:
- Mobile: Shows Image, Name, Price, Actions
- Desktop: Shows all columns
- Priority columns never hidden

## 🎨 Visual Design Patterns

### Badge System

**Item Types**:
- Service: Blue badge
- Material: Purple badge
- Equipment: Orange badge

**Pricing Tiers**:
- Good: Green badge
- Better: Blue badge
- Best: Purple badge

**Status**:
- Active: Green badge with green background
- Inactive: Gray badge

**Category Badges**:
- Shows full hierarchy: "HVAC › Heating › Furnaces"
- Color-coded icon based on category
- Truncates if too long

### Color Coding

| Category | Color | Icon |
|----------|-------|------|
| HVAC | Blue | Zap |
| Plumbing | Green | Wrench |
| Electrical | Yellow | Zap |
| General | Gray | Package |

## 📈 Sample Data Structure

### Service Example (with Pricing Tiers)
```typescript
{
  id: "2",
  itemType: "service",
  name: "Furnace Tune-Up - Good",
  description: "Basic furnace maintenance and cleaning",
  sku: "SVC-HVAC-002",
  category: "HVAC",
  subcategory: "Heating › Furnaces",
  cost: 9000,        // $90.00
  price: 14900,      // $149.00
  priceTier: "good",
  markupPercent: 66,
  laborHours: 1.0,
  unit: "each",
  isActive: true,
  isFlatRate: true,
  supplierName: null,
  tags: ["furnace", "tune-up", "good"],
}
```

### Material Example
```typescript
{
  id: "10",
  itemType: "material",
  name: "HVAC Air Filter 20x25x1 (MERV 11)",
  description: "High-efficiency air filter",
  sku: "MAT-HVAC-001",
  category: "HVAC",
  subcategory: "Filters",
  cost: 1500,       // $15.00
  price: 2500,      // $25.00
  markupPercent: 67,
  unit: "each",
  isActive: true,
  isFlatRate: false,
  supplierName: "Ferguson",
  supplierSku: "FRG-AF2025",
  tags: ["filter", "hvac", "merv11"],
}
```

### Equipment Example
```typescript
{
  id: "17",
  itemType: "equipment",
  name: "Carrier 3-Ton AC Unit (16 SEER)",
  description: "High-efficiency 3-ton air conditioning unit",
  sku: "EQP-HVAC-001",
  category: "HVAC",
  subcategory: "Cooling › Air Conditioning",
  cost: 180000,     // $1,800.00
  price: 300000,    // $3,000.00
  markupPercent: 67,
  unit: "each",
  isActive: true,
  isFlatRate: false,
  supplierName: "Ferguson",
  supplierSku: "CAR-AC3T16",
  tags: ["carrier", "ac-unit", "3-ton", "16seer"],
}
```

## 🚀 Implementation Details

### Files Modified

1. **`/src/components/work/price-book-table.tsx`**
   - Added equipment item type
   - Implemented pricing tiers
   - Added image thumbnail column
   - Enhanced category display with hierarchy
   - Added labor hours column
   - Improved search across all fields

2. **`/src/app/(dashboard)/dashboard/work/pricebook/page.tsx`**
   - Updated mock data with 20 realistic items
   - Added all three item types
   - Implemented Good/Better/Best examples
   - Added hierarchical categories
   - Updated stats to show Equipment count

### Statistics Updated

**Before**:
- Total Items
- Services (+ Packages)
- Materials
- Avg. Markup

**After**:
- Total Items
- Services
- Materials
- Equipment

## ✅ Benefits of Restructure

### For Business Owners
- **Industry Standard**: Follows proven patterns from market leaders
- **Clear Pricing Tiers**: Easy to offer Good/Better/Best options
- **Visual Organization**: Quick scanning with colors and icons
- **Professional Appearance**: Matches expectations from other software
- **Scalable Structure**: Supports unlimited category depth

### For Technicians
- **Quick Item Lookup**: Visual thumbnails and clear categories
- **Labor Estimation**: Shows expected hours for services
- **Flat-Rate Clarity**: Clear indicator for predetermined pricing
- **Mobile-Friendly**: Priority columns always visible

### For Administrators
- **Supplier Integration Ready**: SKU and supplier fields prepared
- **Tag-Based Organization**: Flexible categorization beyond hierarchy
- **Bulk Operations Ready**: Type and category filtering for bulk actions
- **Analytics Ready**: Labor hours, markup, and tier tracking

## 📊 Statistics from Mock Data

**20 Total Items**:
- 9 Services (45%)
- 7 Materials (35%)
- 4 Equipment (20%)

**Pricing Tiers**:
- 1 Standard
- 1 Good
- 1 Better
- 1 Best
- 16 No tier (materials/equipment)

**Categories**:
- HVAC: 9 items
- Plumbing: 5 items
- Electrical: 6 items

**Subcategories**:
- Heating › Furnaces: 4 items
- Cooling › Air Conditioning: 2 items
- Installation › Water Heaters: 2 items
- Pipes › Copper: 1 item
- Pipes › PVC: 1 item
- And more...

## 🔜 Next Steps

### Phase 6: Supplier API Integration
- Connect to Ferguson, Johnstone Supply, SPS APIs
- Real-time pricing updates
- Automatic SKU matching
- Inventory sync

### Phase 7: Bulk Operations
- Mass price increase by percentage
- Category reassignment
- Bulk import from CSV/Excel
- Bulk export with filters

### Phase 8: Package Builder & Analytics
- Create service packages
- Include materials in packages
- Revenue analytics by category
- Profitability by item type
- Popular items dashboard

## 📚 Related Documentation

- [Price Book Categories System](./PRICE_BOOK_CATEGORIES.md) - Infinite nested categories
- Database Schema: `/src/lib/db/schema.ts`
- Migration: `/supabase/migrations/20250131000000_price_book_categories.sql`
- UI Component: `/src/components/work/category-tree-navigator.tsx`

## 🤝 Industry References

- ServiceTitan Pricebook: https://help.servicetitan.com/how-to/pricebook-category-setup
- Flat-Rate Pricing Best Practices: https://www.servicetitan.com/blog/hvac-flat-rate-pricing
- Field Service Software Patterns: Enterprise Data Table Design

---

**Last Updated**: 2025-01-31
**Version**: 2.0 (Industry Standards Implementation)
