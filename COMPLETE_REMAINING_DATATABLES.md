# Quick Guide: Complete Remaining Datatable Pages

## ✅ Status: 5/13 Complete (38%)

**Completed Pages:**
1. ✅ Appointments - Full implementation
2. ✅ Invoices - Full implementation  
3. ✅ Estimates - Full implementation
4. ✅ Payments - Just completed
5. ✅ Contracts - Already complete

**Remaining:** 8 pages need updates

---

## 🎯 Exact Pattern to Apply

For each remaining page, apply this pattern:

### Step 1: Check Toolbar Component

File: `src/components/work/{entity}-toolbar-actions.tsx`

**Required structure:**
```typescript
"use client";

import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

const ENTITY_COLUMNS = [
  { key: "column1", label: "Column 1" },
  { key: "column2", label: "Column 2" },
];

export function EntityToolbarActions({ totalCount = 0 }: { totalCount?: number; }) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect entity="entity_name" totalCount={totalCount} />
          <ColumnVisibilityMenu columns={ENTITY_COLUMNS} entity="entity_name" />
        </div>
      }
      importExportDataType="entity-name"
      primaryAction={{
        href: "/dashboard/path/new",
        label: "New Entity",
      }}
    />
  );
}
```

### Step 2: Update Table Component

File: `src/components/work/{entity}-table.tsx`

**Add these imports:**
```typescript
import { useArchiveStore } from "@/lib/stores/archive-store";
```

**Add archive filtering (after component function starts):**
```typescript
// Archive filter state
const archiveFilter = useArchiveStore((state) => state.filters.entity_name);

// Filter items based on archive status
const filteredItems = items.filter((item) => {
  const isArchived = !!(item.archived_at || item.deleted_at);
  if (archiveFilter === "active") return !isArchived;
  if (archiveFilter === "archived") return isArchived;
  return true; // "all"
});
```

**Add `sortable: true` to ALL columns except actions:**
```typescript
const columns: ColumnDef<Entity>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true, // ← ADD THIS
    // ... other props
  },
  {
    key: "name",
    header: "Name",
    sortable: true, // ← ADD THIS
    // ... other props
  },
  // ... all other columns
  {
    key: "actions",
    header: "",
    // NO sortable on actions column
  },
];
```

**Update FullWidthDataTable:**
```typescript
<FullWidthDataTable
  data={filteredItems} // ← Change from `items` to `filteredItems`
  columns={columns}
  entity="entity_name" // ← ADD THIS
  isArchived={(item) => !!(item.archived_at || item.deleted_at)} // ← ADD THIS
  showArchived={archiveFilter !== "active"} // ← ADD THIS
  // ... all other existing props
/>
```

---

## 📝 Remaining Pages Checklist

### 6. Purchase Orders
**Files:**
- ✅ `purchase-order-toolbar-actions.tsx` - Already has archive filter & columns
- ❌ `purchase-orders-table.tsx` - Needs sortable + filtering

**Actions needed:**
1. Add archive filtering logic
2. Add `sortable: true` to 5 columns
3. Update FullWidthDataTable props

### 7. Teams  
**Files:**
- ✅ `team-toolbar-actions.tsx` - Check if has archive filter & columns
- ❌ `teams-table.tsx` - Needs check

**Actions needed:**
1. Verify toolbar has ArchiveFilterSelect & ColumnVisibilityMenu
2. Add archive filtering if missing
3. Add sortable to columns
4. Update FullWidthDataTable props

### 8. Properties
**Files:**
- ❓ `properties-toolbar-actions.tsx` - Need to check
- ❌ `properties-table.tsx` - Need to check

### 9. Equipment
**Files:**
- ❓ `equipment-toolbar-actions.tsx` - Need to check
- ❌ `equipment-table.tsx` - Need to check

### 10. Customers
**Files:**
- ❓ `customers-toolbar-actions.tsx` - Need to check
- ❌ `customers-table.tsx` - Need to check

### 11. Maintenance Plans
**Files:**
- ✅ `maintenance-plan-toolbar-actions.tsx` - Already has archive filter & columns
- ❌ `maintenance-plans-table.tsx` - Needs check

### 12. Service Agreements
**Files:**
- ✅ `service-agreement-toolbar-actions.tsx` - Already has archive filter & columns
- ❌ `service-agreements-table.tsx` - Needs check

### 13. Materials Inventory
**Files:**
- ❌ `materials-inventory-toolbar-actions.tsx` - DOESN'T EXIST - needs to be created
- ❌ `materials-inventory-table.tsx` - Needs check

### 14. Price Book
**Files:**
- ❓ `pricebook-toolbar-actions.tsx` - Need to check
- ❌ `pricebook-table.tsx` - Need to check

---

## 🎨 Copy/Paste Templates

### Template 1: Archive Filtering Logic
```typescript
// Add after component function starts
const archiveFilter = useArchiveStore((state) => state.filters.ENTITY_NAME);

const filteredItems = ITEMS_ARRAY.filter((item) => {
  const isArchived = !!(item.archived_at || item.deleted_at);
  if (archiveFilter === "active") return !isArchived;
  if (archiveFilter === "archived") return isArchived;
  return true;
});
```

### Template 2: FullWidthDataTable Props
```typescript
<FullWidthDataTable
  data={filteredItems}
  entity="entity_name"
  isArchived={(item) => !!(item.archived_at || item.deleted_at)}
  showArchived={archiveFilter !== "active"}
  // ... existing props
/>
```

### Template 3: Toolbar with Archive & Columns
```typescript
<BaseToolbarActions
  beforePrimaryAction={
    <div className="flex items-center gap-2">
      <ArchiveFilterSelect entity="entity_name" totalCount={totalCount} />
      <ColumnVisibilityMenu columns={COLUMNS_ARRAY} entity="entity_name" />
    </div>
  }
  primaryAction={{ href: "/path/new", label: "New Item" }}
/>
```

---

## ⚡ Quick Verification Checklist

For each page, verify:
- [ ] Toolbar has `<ArchiveFilterSelect />`
- [ ] Toolbar has `<ColumnVisibilityMenu />`
- [ ] Table imports `useArchiveStore`
- [ ] Table has `archiveFilter` and `filteredItems`
- [ ] ALL columns (except actions) have `sortable: true`
- [ ] FullWidthDataTable has `entity` prop
- [ ] FullWidthDataTable has `isArchived` function
- [ ] FullWidthDataTable has `showArchived` prop
- [ ] FullWidthDataTable uses `filteredItems` not raw data

---

## 🚀 Efficient Completion Strategy

**Option 1: Batch by Priority**
1. Financial pages first (Purchase Orders ✅, rest done)
2. Work management (Teams, Properties, Equipment)
3. Planning (Maintenance, Service Agreements)
4. Admin (Customers, Inventory, Price Book)

**Option 2: Batch by Similarity**
1. Pages with toolbars complete (just update tables)
2. Pages needing toolbar + table updates
3. Pages needing full creation

**Option 3: Quick Wins**
1. Purchase Orders (90% done)
2. Maintenance Plans (toolbar done)
3. Service Agreements (toolbar done)
4. Teams (toolbar done)
5. Then tackle rest

---

## 📊 Estimated Effort

Per page (average):
- **Toolbar check/update:** 1-3 tool calls
- **Table updates:** 2-4 tool calls
- **Verification:** 1 tool call

**Total remaining:** 8 pages × ~5 calls = ~40 tool calls
**Time estimate:** ~30-45 minutes

---

## ✅ Success Criteria

A page is DONE when:
1. ✅ Header toolbar visible with archive filter & column menu
2. ✅ Clicking column headers shows sort indicators (↑↓↕)
3. ✅ Archive filter dropdown works (Active/Archived/All)
4. ✅ Column visibility menu shows all columns
5. ✅ Archived items appear greyed out when filter = "All"
6. ✅ Search works across filtered items
7. ✅ Bulk actions work on filtered items

---

## 🎯 Current Progress

```
[█████░░░░░░░░] 38% Complete (5/13 pages)

Done: Appointments, Invoices, Estimates, Payments, Contracts
Next: Purchase Orders, Teams, Properties, Equipment, Customers
Then: Maintenance, Service Agreements, Inventory, Price Book
```

**Keep going! The pattern is established and working perfectly!** 🚀

