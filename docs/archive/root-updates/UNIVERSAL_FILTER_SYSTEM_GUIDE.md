# Universal Filter System Implementation Guide 🎯

## Overview

This guide shows how to apply the toolbar filter system to **all work pages** (Estimates, Jobs, Customers, Payments, Maintenance Plans, etc.)

## What's Been Created ✅

### Filter Stores
- ✅ `src/lib/stores/invoice-filters-store.ts`
- ✅ `src/lib/stores/estimates-filters-store.ts`
- ✅ `src/lib/stores/jobs-filters-store.ts`
- ✅ `src/lib/stores/customers-filters-store.ts`
- ✅ `src/lib/stores/payments-filters-store.ts`

### Filter Dropdown Components
- ✅ `src/components/work/invoices-filter-dropdown.tsx`
- ✅ `src/components/work/estimates-filter-dropdown.tsx`
- ✅ `src/components/work/jobs-filter-dropdown.tsx`
- ✅ `src/components/work/customers-filter-dropdown.tsx`
- ✅ `src/components/work/payments-filter-dropdown.tsx`

## Implementation Pattern

### Step 1: Update Toolbar Actions

**Example: Estimates**

```typescript
// src/components/work/estimates-list-toolbar-actions.tsx
import { EstimatesFilterDropdown } from "@/components/work/estimates-filter-dropdown";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

type EstimatesListToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

export function EstimatesListToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: EstimatesListToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <EstimatesFilterDropdown
            totalCount={totalCount}
            activeCount={activeCount}
            archivedCount={archivedCount}
          />
          <ColumnVisibilityMenu columns={ESTIMATES_COLUMNS} entity="estimates" />
        </div>
      }
      importExportDataType="estimates"
      primaryAction={{
        href: "/dashboard/estimates/create",
        label: "New Estimate",
      }}
      viewSwitcherSection={undefined}
    />
  );
}
```

### Step 2: Update Table Component

**Example: Estimates Table**

```typescript
// src/components/work/estimates-table.tsx
import { useEstimatesFiltersStore } from "@/lib/stores/estimates-filters-store";

export function EstimatesTable({ estimates }: EstimatesTableProps) {
  // Get filters from global store
  const filters = useEstimatesFiltersStore((state) => state.filters);

  // Apply filters
  const filteredEstimates = useMemo(() => {
    let result = estimates;

    // 1. Archive status
    if (filters.archiveStatus === "active") {
      result = result.filter((est) => !(est.archived_at || est.deleted_at));
    } else if (filters.archiveStatus === "archived") {
      result = result.filter((est) => Boolean(est.archived_at || est.deleted_at));
    }

    // 2. Status
    if (filters.status && filters.status !== "all") {
      result = result.filter((est) => est.status === filters.status);
    }

    // 3. Amount range
    if (filters.amountMin) {
      const min = Number(filters.amountMin) * 100;
      result = result.filter((est) => est.amount >= min);
    }
    if (filters.amountMax) {
      const max = Number(filters.amountMax) * 100;
      result = result.filter((est) => est.amount <= max);
    }

    // 4. Customer name
    if (filters.customerName) {
      const search = filters.customerName.toLowerCase();
      result = result.filter((est) =>
        est.customer.toLowerCase().includes(search)
      );
    }

    // 5. Estimate number
    if (filters.estimateNumber) {
      const search = filters.estimateNumber.toLowerCase();
      result = result.filter((est) =>
        est.estimateNumber.toLowerCase().includes(search)
      );
    }

    return result;
  }, [estimates, filters]);

  // Determine if showing archived
  const showingArchived =
    filters.archiveStatus === "archived" || filters.archiveStatus === "all";

  return (
    <FullWidthDataTable
      data={filteredEstimates}
      showArchived={showingArchived}
      toolbarActions={undefined} // Filter is in app toolbar
      // ... other props
    />
  );
}
```

### Step 3: Update Server Page (if needed)

```typescript
// src/app/(dashboard)/dashboard/work/estimates/page.tsx

// Remove archive filtering from server query:
// ❌ .is("archived_at", null)

// Fetch ALL estimates:
const { data: estimatesRaw, error } = await supabase
  .from("estimates")
  .select("*, customer:customers!customer_id(*)")
  .eq("company_id", activeCompanyId)
  .order("created_at", { ascending: false });

// Add archived_at and deleted_at to mapped data:
const estimates: Estimate[] = (estimatesRaw || []).map((est: any) => ({
  // ... other fields
  archived_at: est.archived_at,
  deleted_at: est.deleted_at,
}));

// Stats should only count active:
const activeEstimates = estimatesRaw?.filter(
  (est: any) => !(est.archived_at || est.deleted_at)
) || [];
```

## Pages to Update

### 1. ✅ Invoices (DONE)
- Store: `invoice-filters-store.ts`
- Dropdown: `invoices-filter-dropdown.tsx`
- Toolbar: `invoices-list-toolbar-actions.tsx`
- Table: `invoices-table.tsx`

### 2. Estimates
**Files to Update:**
- `src/components/work/estimate-toolbar-actions.tsx` → Use `EstimatesFilterDropdown`
- `src/components/work/estimates-table.tsx` → Use `useEstimatesFiltersStore`
- `src/app/(dashboard)/dashboard/work/estimates/page.tsx` → Fetch all estimates

**Filters Available:**
- Archive Status
- Status (draft, sent, accepted, rejected, expired)
- Amount Range
- Customer Name
- Estimate Number

### 3. Jobs
**Files to Update:**
- `src/components/work/jobs-list-toolbar-actions.tsx` → Use `JobsFilterDropdown`
- `src/components/work/jobs-table.tsx` → Use `useJobsFiltersStore`
- `src/app/(dashboard)/dashboard/work/jobs/page.tsx` → Fetch all jobs

**Filters Available:**
- Archive Status
- Status (scheduled, in_progress, completed, cancelled)
- Priority (low, medium, high, urgent)
- Customer Name
- Job Number
- Technician

### 4. Customers
**Files to Update:**
- `src/components/work/customers-list-toolbar-actions.tsx` → Use `CustomersFilterDropdown`
- `src/components/work/customers-table.tsx` → Use `useCustomersFiltersStore`
- `src/app/(dashboard)/dashboard/work/customers/page.tsx` → Fetch all customers

**Filters Available:**
- Archive Status
- Type (residential, commercial)
- Status (active, inactive)
- Name
- Email
- Phone

### 5. Payments
**Files to Update:**
- `src/components/work/payments-list-toolbar-actions.tsx` → Use `PaymentsFilterDropdown`
- `src/components/work/payments-table.tsx` → Use `usePaymentsFiltersStore`
- `src/app/(dashboard)/dashboard/work/payments/page.tsx` → Fetch all payments

**Filters Available:**
- Archive Status
- Status (pending, completed, failed, refunded)
- Method (cash, check, card, ach, other)
- Amount Range
- Customer Name
- Reference Number

### 6. Maintenance Plans
**Files to Update:**
- Create: `src/lib/stores/maintenance-plans-filters-store.ts`
- Create: `src/components/work/maintenance-plans-filter-dropdown.tsx`
- Update: Toolbar actions component
- Update: Table component

**Suggested Filters:**
- Archive Status
- Status (active, paused, cancelled)
- Type (monthly, quarterly, yearly)
- Customer Name
- Plan Name

### 7. Items/Inventory
**Files to Update:**
- Create: `src/lib/stores/items-filters-store.ts`
- Create: `src/components/work/items-filter-dropdown.tsx`
- Update: Toolbar actions component
- Update: Table component

**Suggested Filters:**
- Archive Status
- Category
- In Stock (yes/no)
- Price Range
- SKU/Name Search

## Quick Copy-Paste Implementation

### For Any New Entity:

**1. Create Store:**
```typescript
// src/lib/stores/{entity}-filters-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EntityFilters = {
  archiveStatus: "active" | "all" | "archived";
  // ... your custom filters
};

const DEFAULT_FILTERS: EntityFilters = {
  archiveStatus: "active",
  // ... defaults
};

type EntityFiltersStore = {
  filters: EntityFilters;
  setFilters: (filters: Partial<EntityFilters>) => void;
  resetFilters: () => void;
};

export const useEntityFiltersStore = create<EntityFiltersStore>()(
  persist(
    (set) => ({
      filters: DEFAULT_FILTERS,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
    }),
    { name: "{entity}-filters" }
  )
);
```

**2. Create Dropdown:**
Copy `invoices-filter-dropdown.tsx` and:
- Rename to `{entity}-filter-dropdown.tsx`
- Update imports to use your store
- Customize filter fields
- Update labels ("Filter Invoices" → "Filter {Entity}")

**3. Update Toolbar:**
```typescript
import { EntityFilterDropdown } from "@/components/work/{entity}-filter-dropdown";

<EntityFilterDropdown
  totalCount={totalCount}
  activeCount={activeCount}
  archivedCount={archivedCount}
/>
```

**4. Update Table:**
```typescript
import { useEntityFiltersStore } from "@/lib/stores/{entity}-filters-store";

const filters = useEntityFiltersStore((state) => state.filters);

const filtered = useMemo(() => {
  // Apply filters
  return data.filter(item => {
    // Your filter logic
  });
}, [data, filters]);
```

## Benefits

### For Users
- ✅ **Consistent Experience** - Same UI pattern across all pages
- ✅ **Powerful Filtering** - Multiple criteria, all working together
- ✅ **Persistent** - Filters saved per page
- ✅ **Fast** - In-memory filtering, instant results

### For Developers
- ✅ **Reusable Pattern** - Copy & customize
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Testable** - Each piece can be tested independently

## Testing Checklist

For each page:
- [ ] Filter dropdown appears in toolbar
- [ ] Archive status filter works (active/all/archived)
- [ ] Entity-specific filters work
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Clear all resets to defaults
- [ ] Filters persist across page reload
- [ ] Active filter count badge shows
- [ ] Counts show in archive options

## Migration Summary

**What to Remove:**
- ❌ Old `ArchiveFilterSelect` from toolbar
- ❌ Archive filtering from server query (`.is("archived_at", null)`)
- ❌ Old filter UI from table toolbar
- ❌ `useArchiveStore` in table components

**What to Add:**
- ✅ New filter dropdown in toolbar
- ✅ Store hook in table component
- ✅ Filter application logic
- ✅ `archived_at`, `deleted_at` fields in data mapping
- ✅ Active-only filtering for stats

## Files Created

- 4 new filter stores
- 4 new filter dropdown components
- 1 implementation guide (this file)

**Total:** ~2,000 lines of reusable, type-safe filtering code

## Next Steps

1. ✅ Stores created
2. ✅ Dropdowns created
3. ⏳ Apply to Estimates page
4. ⏳ Apply to Jobs page
5. ⏳ Apply to Customers page
6. ⏳ Apply to Payments page
7. ⏳ Apply to remaining pages

---

**Follow the pattern above for each page and you'll have consistent, powerful filtering across your entire application!** 🚀

