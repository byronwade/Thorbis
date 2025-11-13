# Enhanced Table Filter System

## Overview
Replaced the simple "show all/active/archived" toggle with a comprehensive dropdown filter system that allows users to filter tables by status, archive state, and other attributes.

## What Changed

### Before
- Simple toggle between "all", "active", and "archived" items
- Stored in Zustand archive store
- Limited filtering options

### After
- **Multi-select dropdown filter** with grouped options
- Filter by **Status** (draft, sent, paid, overdue, etc.)
- Filter by **Archive** (active only, all, archived only)
- **Badge showing active filter count**
- **"Clear Filters" button** to reset all filters
- Local component state (no global store needed)
- Shows item counts for each filter option
- Easily extensible for additional filter types

## Components

### 1. `TableFilters` Component
**Location:** `src/components/ui/table-filters.tsx`

Reusable filter dropdown that displays grouped filter options with checkboxes and item counts.

```typescript
<TableFilters
  activeFilters={activeFilters}
  filters={filterGroups}
  onFilterChange={handleFilterChange}
/>
```

### 2. `ClearFiltersButton` Component
**Location:** `src/components/ui/table-filters.tsx`

Automatically shows/hides based on active filter count.

```typescript
<ClearFiltersButton
  count={activeFilterCount}
  onClear={handleClearFilters}
/>
```

## Implementation Pattern

### Step 1: Setup Filter State

```typescript
// Filter state
const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
  Status: "all",        // Default to show all statuses
  Archive: "active",    // Default to show only active items
});
```

### Step 2: Count Items by Status

```typescript
// Count items by status (memoized for performance)
const statusCounts = useMemo(() => {
  const counts = {
    all: items.length,
    status1: 0,
    status2: 0,
    // ... more statuses
  };
  
  for (const item of items) {
    if (item.status === "status1") counts.status1++;
    else if (item.status === "status2") counts.status2++;
    // ... more conditions
  }
  
  return counts;
}, [items]);
```

### Step 3: Count Archive Status

```typescript
// Count by archive status
const archiveCounts = useMemo(() => {
  let active = 0;
  let archived = 0;
  
  for (const item of items) {
    const isArchived = Boolean(item.archived_at || item.deleted_at);
    if (isArchived) archived++;
    else active++;
  }
  
  return { all: items.length, active, archived };
}, [items]);
```

### Step 4: Define Filter Groups

```typescript
const filterGroups: FilterGroup[] = [
  {
    label: "Status",
    options: [
      { label: "All Statuses", value: "all", count: statusCounts.all },
      { label: "Draft", value: "draft", count: statusCounts.draft },
      { label: "Sent", value: "sent", count: statusCounts.sent },
      // ... more status options
    ],
  },
  {
    label: "Archive",
    options: [
      { label: "Active Only", value: "active", count: archiveCounts.active },
      { label: "All Items", value: "all", count: archiveCounts.all },
      { label: "Archived Only", value: "archived", count: archiveCounts.archived },
    ],
  },
  // Add more filter groups here (e.g., Priority, Type, Category)
];
```

### Step 5: Apply Filters

```typescript
// Filter items based on active filters
const filteredItems = useMemo(() => {
  return items.filter((item) => {
    // Filter by status
    const statusFilter = activeFilters.Status;
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    // Filter by archive status
    const archiveFilter = activeFilters.Archive;
    const isArchived = Boolean(item.archived_at || item.deleted_at);
    if (archiveFilter === "active" && isArchived) return false;
    if (archiveFilter === "archived" && !isArchived) return false;

    return true;
  });
}, [items, activeFilters]);
```

### Step 6: Filter Handlers

```typescript
// Handle filter changes
const handleFilterChange = (filterGroup: string, value: string) => {
  setActiveFilters((prev) => ({ ...prev, [filterGroup]: value }));
};

// Clear all filters
const handleClearFilters = () => {
  setActiveFilters({
    Status: "all",
    Archive: "active",
  });
};

// Count active filters (excluding defaults)
const activeFilterCount =
  (activeFilters.Status !== "all" ? 1 : 0) +
  (activeFilters.Archive !== "active" ? 1 : 0);
```

### Step 7: Add to Table Toolbar

```typescript
<FullWidthDataTable
  // ... other props
  toolbarActions={
    <>
      <TableFilters
        activeFilters={activeFilters}
        filters={filterGroups}
        onFilterChange={handleFilterChange}
      />
      <ClearFiltersButton
        count={activeFilterCount}
        onClear={handleClearFilters}
      />
    </>
  }
/>
```

## Implemented Tables

### ✅ Invoices Table
**Location:** `src/components/work/invoices-table.tsx`

**Filters:**
- Status: All, Draft, Pending, Paid, Overdue
- Archive: Active Only, All Invoices, Archived Only

### ✅ Estimates Table
**Location:** `src/components/work/estimates-table.tsx`

**Filters:**
- Status: All, Draft, Sent, Accepted, Rejected, Expired
- Archive: Active Only, All Estimates, Archived Only

## Tables Pending Implementation

### ⏳ Jobs Table
**Location:** `src/components/work/jobs-table.tsx`

**Suggested Filters:**
- Status: All, Scheduled, In Progress, Completed, On Hold, Cancelled
- Priority: All, Low, Normal, High, Urgent
- Archive: Active Only, All Jobs, Archived Only

### ⏳ Customers Table
**Location:** `src/components/customers/customers-table.tsx`

**Suggested Filters:**
- Type: All, Residential, Commercial, Industrial
- Status: All, Active, Inactive
- Archive: Active Only, All Customers, Archived Only

### ⏳ Payments Table
**Location:** `src/components/work/payments-table.tsx`

**Suggested Filters:**
- Status: All, Pending, Processing, Completed, Failed, Refunded
- Method: All, Cash, Check, Credit Card, ACH, Other
- Archive: Active Only, All Payments, Archived Only

### ⏳ Contracts Table
**Location:** `src/components/work/contracts-table.tsx`

**Suggested Filters:**
- Status: All, Draft, Active, Expired, Terminated
- Archive: Active Only, All Contracts, Archived Only

### ⏳ Maintenance Plans Table
**Suggested Filters:**
- Status: All, Draft, Active, Paused, Cancelled, Expired
- Frequency: All, Monthly, Quarterly, Semi-Annually, Annually
- Archive: Active Only, All Plans, Archived Only

### ⏳ Equipment Table
**Suggested Filters:**
- Type: All, HVAC, Plumbing, Electrical, etc.
- Status: All, Active, Inactive, Retired
- Condition: All, Excellent, Good, Fair, Poor, Needs Replacement
- Archive: Active Only, All Equipment, Archived Only

## Adding Custom Filter Groups

You can easily add more filter groups beyond Status and Archive:

```typescript
const filterGroups: FilterGroup[] = [
  {
    label: "Status",
    options: [/* status options */],
  },
  {
    label: "Priority",
    options: [
      { label: "All Priorities", value: "all", count: priorityCounts.all },
      { label: "Low", value: "low", count: priorityCounts.low },
      { label: "Normal", value: "normal", count: priorityCounts.normal },
      { label: "High", value: "high", count: priorityCounts.high },
      { label: "Urgent", value: "urgent", count: priorityCounts.urgent },
    ],
  },
  {
    label: "Type",
    options: [
      { label: "All Types", value: "all", count: typeCounts.all },
      { label: "Type A", value: "typeA", count: typeCounts.typeA },
      { label: "Type B", value: "typeB", count: typeCounts.typeB },
    ],
  },
  {
    label: "Archive",
    options: [/* archive options */],
  },
];
```

## Benefits

### User Experience
- ✅ **One-click filtering** - No need to navigate to settings
- ✅ **Visual feedback** - Badge shows active filter count
- ✅ **Item counts** - See how many items match each filter
- ✅ **Quick reset** - Clear Filters button restores defaults
- ✅ **Persistent within session** - Filters stay active while browsing

### Developer Experience
- ✅ **Reusable components** - Same pattern across all tables
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Performance** - useMemo prevents unnecessary recalculations
- ✅ **Extensible** - Easy to add new filter groups
- ✅ **Maintainable** - Consistent pattern everywhere

### Performance
- ✅ **Memoized counts** - Only recalculates when data changes
- ✅ **Efficient filtering** - Single pass through data
- ✅ **No global state** - Reduces re-renders

## Migration Guide

To migrate an existing table to use the new filter system:

1. **Remove old imports:**
   ```typescript
   - import { useArchiveStore } from "@/lib/stores/archive-store";
   ```

2. **Add new imports:**
   ```typescript
   + import { useMemo, useState } from "react";
   + import {
   +   ClearFiltersButton,
   +   TableFilters,
   +   type FilterGroup,
   + } from "@/components/ui/table-filters";
   ```

3. **Replace filter state:**
   ```typescript
   - const archiveFilter = useArchiveStore((state) => state.filters.tableName);
   
   + const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
   +   Status: "all",
   +   Archive: "active",
   + });
   ```

4. **Add count calculations** (see Step 2 & 3 above)

5. **Define filter groups** (see Step 4 above)

6. **Update filtering logic** (see Step 5 above)

7. **Add filter handlers** (see Step 6 above)

8. **Add toolbar actions** (see Step 7 above)

9. **Update showArchived prop:**
   ```typescript
   - showArchived={archiveFilter !== "active"}
   + showArchived={activeFilters.Archive !== "active"}
   ```

## Best Practices

1. **Always provide counts** - Users want to see how many items match each filter
2. **Default to "Active Only"** - Most users want to see only active items
3. **Use memoization** - Prevent unnecessary recalculations
4. **Keep filter groups simple** - 4-6 options per group is ideal
5. **Order logically** - Most common filters first
6. **Consistent naming** - Use the same labels across tables (e.g., "Active Only", not "Show Active")

## Related Files

- `src/components/ui/table-filters.tsx` - Filter components
- `src/components/work/invoices-table.tsx` - Example implementation
- `src/components/work/estimates-table.tsx` - Example implementation
- `src/components/ui/full-width-datatable.tsx` - Base data table

