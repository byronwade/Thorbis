# Price Book Drill-Down Navigation System

## 🎯 Overview

Implemented an intuitive drill-down navigation system for the price book that makes it easy to filter and explore items by category hierarchy and item type, with real-time table filtering.

## ✨ Key Features

### 1. **Interactive Sidebar Navigation**
- **Collapsible category tree** with visual hierarchy
- **Item type quick filters** (All Items, Services, Materials, Equipment)
- **Visual selection states** - clear indication of active filters
- **Auto-expand categories** when drilling down
- **Quick actions** - Add Item, Labor Calculator, Mass Price Update

### 2. **Real-Time Table Filtering**
- **Instant filtering** - table updates immediately when sidebar selections change
- **Filter summary banner** - shows active filters and item count
- **Empty state handling** - contextual messages based on filters
- **Combined search** - sidebar filters work with table search

### 3. **State Management with Zustand**
- **Centralized filter state** - shared between sidebar and table
- **No provider wrapper** - direct imports for better performance
- **Persisted filters** - remembers your selections
- **Shallow selectors** - prevents unnecessary re-renders

## 📊 User Experience Flow

```
1. User opens price book
   ↓
2. Sees full list of 20 items in table
   ↓
3. Clicks "Services" in sidebar
   ↓
4. Table filters to show only 9 service items
   ↓
5. Clicks "HVAC" category
   ↓
6. Table filters to 5 HVAC service items
   ↓
7. Clicks "Heating" subcategory
   ↓
8. Table filters to 4 HVAC › Heating service items
   ↓
9. Clicks "Clear" to reset all filters
   ↓
10. Back to full list of 20 items
```

## 🗂️ Files Created/Modified

### New Files

**1. `/src/lib/stores/pricebook-store.ts`** (Enhanced)
- Added drill-down filter types
- Added `itemTypeFilter` and `categoryFilter` state
- Added filter management methods
- Added `getFilterSummary()` for display

**2. `/src/components/pricebook/pricebook-filters-sidebar.tsx`**
- Complete custom sidebar for price book
- Collapsible category tree
- Item type filters
- Quick actions section
- Visual selection states

### Modified Files

**3. `/src/components/layout/app-sidebar.tsx`**
- Added custom sidebar support for pricebook
- Returns `PriceBookFiltersSidebar` for pricebook routes
- Maintains standard sidebar for all other routes

**4. `/src/components/work/price-book-table.tsx`**
- Connected to Zustand store for filtering
- Applies filters before rendering table
- Shows filter summary banner
- Contextual empty states

## 🏗️ Architecture

### State Flow

```
┌─────────────────────────────────────────────┐
│          usePriceBookStore (Zustand)        │
│                                             │
│  State:                                     │
│  - itemTypeFilter: "all" | "service" | ... │
│  - categoryFilter: { category, subcategory }│
│                                             │
│  Actions:                                   │
│  - setItemTypeFilter()                      │
│  - setCategoryFilter()                      │
│  - clearAllFilters()                        │
│  - getFilterSummary()                       │
└─────────────┬───────────────────┬───────────┘
              │                   │
      ┌───────▼────────┐  ┌──────▼─────────┐
      │  Sidebar       │  │  Table         │
      │  (Filter UI)   │  │  (Display)     │
      │                │  │                │
      │  - Categories  │  │  - Filters     │
      │  - Item Types  │  │  - Shows Count │
      │  - Clear Btn   │  │  - Empty State │
      └────────────────┘  └────────────────┘
```

### Component Hierarchy

```
AppSidebar (detects pricebook route)
  └─ PriceBookFiltersSidebar
      ├─ Back Button
      ├─ Active Filters Summary
      ├─ Item Type Filters
      │   ├─ All Items
      │   ├─ Services
      │   ├─ Materials
      │   └─ Equipment
      ├─ Category Tree
      │   ├─ HVAC (expandable)
      │   │   ├─ Inspection
      │   │   ├─ Heating
      │   │   ├─ Cooling
      │   │   ├─ Filters
      │   │   └─ Refrigerants
      │   ├─ Plumbing (expandable)
      │   │   ├─ Repairs
      │   │   ├─ Installation
      │   │   ├─ Water Heaters
      │   │   └─ Pipes
      │   ├─ Electrical (expandable)
      │   │   ├─ Upgrades
      │   │   ├─ Repairs
      │   │   ├─ Wire
      │   │   ├─ Breakers
      │   │   ├─ Outlets
      │   │   └─ Panels
      │   └─ General
      ├─ Quick Actions
      │   ├─ Add Item
      │   ├─ Labor Calculator
      │   └─ Mass Price Update
      └─ Settings Link
```

## 🎨 Visual Design

### Sidebar UI Elements

**Item Type Badges**:
- All Items: Default (no color)
- Services: Blue
- Materials: Purple
- Equipment: Orange

**Category Icons**:
- HVAC: Zap icon (blue)
- Plumbing: Wrench icon (green)
- Electrical: Zap icon (yellow)
- General: Package icon (gray)

**Selection States**:
- Unselected: Default background
- Selected: Accent background + font-medium
- Hover: Accent background + chevron visible

**Expandable Categories**:
- Collapsed: ChevronRight icon
- Expanded: ChevronDown icon
- Shows subcategories indented with border-left

### Table UI Elements

**Filter Summary Banner** (only shown when filters active):
```
┌────────────────────────────────────────────┐
│ Showing: [service] • [HVAC › Heating] (4)  │
└────────────────────────────────────────────┘
```

**Empty States**:
- No filters: "No price book items found"
- With filters: "No items found for: service • HVAC › Heating"

## 📝 Code Examples

### Using the Store in Components

```typescript
import { usePriceBookStore } from "@/lib/stores/pricebook-store";

export function MyComponent() {
  // Get state (component re-renders only when these values change)
  const itemTypeFilter = usePriceBookStore((state) => state.itemTypeFilter);
  const categoryFilter = usePriceBookStore((state) => state.categoryFilter);

  // Get actions (stable references, don't cause re-renders)
  const setItemTypeFilter = usePriceBookStore((state) => state.setItemTypeFilter);
  const setCategoryFilter = usePriceBookStore((state) => state.setCategoryFilter);

  return (
    <div>
      <button onClick={() => setItemTypeFilter("service")}>
        Show Services
      </button>
      <button onClick={() => setCategoryFilter("HVAC")}>
        Show HVAC
      </button>
    </div>
  );
}
```

### Filtering Items

```typescript
// In price-book-table.tsx
const filteredItems = items.filter((item) => {
  // Item type filter
  if (itemTypeFilter !== "all" && item.itemType !== itemTypeFilter) {
    return false;
  }

  // Category filter
  if (categoryFilter.category) {
    if (item.category !== categoryFilter.category) {
      return false;
    }

    // Subcategory filter (if specified)
    if (categoryFilter.subcategory) {
      if (!item.subcategory?.includes(categoryFilter.subcategory)) {
        return false;
      }
    }
  }

  return true;
});
```

## 🔧 Implementation Details

### Store State Structure

```typescript
type PriceBookStore = {
  // Drill-down Filters
  itemTypeFilter: "all" | "service" | "material" | "equipment";
  categoryFilter: {
    category: string | null;      // e.g., "HVAC"
    subcategory: string | null;   // e.g., "Heating"
  };

  // Actions
  setItemTypeFilter: (type) => void;
  setCategoryFilter: (category, subcategory?) => void;
  clearAllFilters: () => void;
  hasActiveFilters: () => boolean;
  getFilterSummary: () => string;
};
```

### Filter Summary Examples

| Filters Applied | Summary Display |
|----------------|----------------|
| None | "All Items" |
| Service | "service" |
| HVAC | "HVAC" |
| HVAC › Heating | "HVAC › Heating" |
| Service + HVAC | "service • HVAC" |
| Service + HVAC › Heating | "service • HVAC › Heating" |
| Material + Plumbing + Search "pipe" | "material • Plumbing • \"pipe\"" |

### Category Matching Logic

**Category Match**: Exact match on `item.category === filter.category`

**Subcategory Match**: Uses `.includes()` for flexibility
- Filter: "Heating" matches "Heating", "Heating › Furnaces"
- Filter: "Pipes" matches "Pipes", "Pipes › Copper", "Pipes › PVC"

This allows for flexible subcategory hierarchies.

## 📊 Filter Combinations

### Example 1: Services in HVAC

```
Sidebar State:
- Item Type: "service"
- Category: "HVAC"
- Subcategory: null

Results: 5 items
- Complete HVAC System Inspection
- Furnace Tune-Up - Good
- Furnace Tune-Up - Better
- Furnace Tune-Up - Best
- AC Installation (3-Ton)
```

### Example 2: Materials with "Pipe" in name

```
Sidebar State:
- Item Type: "material"
- Category: "Plumbing"
- Subcategory: "Pipes"

Results: 2 items
- Copper Pipe Type L 3/4"
- PVC Schedule 40 Pipe 2"
```

### Example 3: Equipment for HVAC

```
Sidebar State:
- Item Type: "equipment"
- Category: "HVAC"
- Subcategory: null

Results: 2 items
- Carrier 3-Ton AC Unit (16 SEER)
- Rheem Gas Furnace 80k BTU (96% AFUE)
```

## ✅ Benefits

### For Users
- **Faster Navigation**: Click category to instantly filter
- **Clear Visual Feedback**: Always know what filters are active
- **Easy Reset**: One-click clear all filters
- **Progressive Disclosure**: Start broad, drill down as needed
- **No Page Reloads**: Instant client-side filtering

### For Business
- **Better Organization**: Clear category hierarchy
- **Easier Training**: Intuitive navigation pattern
- **Reduced Clicks**: Direct access to specific items
- **Professional Feel**: Matches industry-leading software patterns

### For Developers
- **Centralized State**: Single source of truth for filters
- **Type Safety**: Full TypeScript support
- **Easy to Extend**: Add more filter types easily
- **Performance**: Selective re-renders with Zustand
- **Maintainable**: Clear separation of concerns

## 🚀 Future Enhancements

### Potential Improvements
1. **Save Filter Presets**: Save common filter combinations
2. **Recent Filters**: Show recently used filter combinations
3. **Filter History**: Undo/redo filter changes
4. **Bulk Operations on Filtered**: Act on visible items only
5. **Export Filtered**: Export current filtered view
6. **Smart Suggestions**: Suggest filters based on usage
7. **Keyboard Shortcuts**: Navigate categories with keyboard
8. **Mobile Optimizations**: Bottom sheet for filters on mobile

### Analytics Opportunities
- Track most-used categories
- Track most-used filter combinations
- Track average drill-down depth
- Track search vs. filter usage ratio

## 🔍 Testing Checklist

- [ ] Click item type filters - table updates
- [ ] Click category - table filters to category
- [ ] Click subcategory - table filters to subcategory
- [ ] Expand/collapse categories - state persists
- [ ] Clear filters - resets to "All Items"
- [ ] Multiple filters - combines correctly
- [ ] Empty state - shows contextual message
- [ ] Filter summary - shows correct text
- [ ] Filter summary - shows correct count
- [ ] Back button - navigates to work page
- [ ] Search + filters - works together
- [ ] Pagination - maintains filters
- [ ] URL changes - maintains filters (future)

## 📚 Related Documentation

- [Price Book Restructure](./PRICE_BOOK_RESTRUCTURE.md) - Industry best practices
- [Price Book Categories](./PRICE_BOOK_CATEGORIES.md) - Infinite nested categories system
- Database Schema: `/src/lib/db/schema.ts`
- Zustand Store: `/src/lib/stores/pricebook-store.ts`
- Sidebar Component: `/src/components/pricebook/pricebook-filters-sidebar.tsx`
- Table Component: `/src/components/work/price-book-table.tsx`

---

**Last Updated**: 2025-01-31
**Version**: 1.0 (Drill-Down Navigation Implementation)
