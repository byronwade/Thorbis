# Datatable Enhancement Status Report

**Date**: 2025-11-12
**Task**: Apply complete datatable enhancement pattern to ALL datatable files
**Total Scope**: 30 files (10 datatables + 10 toolbars + 10 pages)

---

## Executive Summary

This task involves systematically applying the complete archive functionality and column visibility enhancements from `appointments-table.tsx` to ALL remaining datatable components across the application.

### Current Status
- **Files Complete**: 4/30 (13.3%)
- **Files In Progress**: 2/30 (6.7%)
- **Files Remaining**: 24/30 (80%)

---

## Files Status

### ✅ COMPLETE (4 files)

1. **appointments-table.tsx** ✅
   - Archive filtering with useArchiveStore
   - Column visibility with sortable/hideable flags
   - Archive dialogs (single + bulk)
   - Full pattern implementation

2. **appointments-toolbar-actions.tsx** ✅
   - ArchiveFilterSelect component
   - ColumnVisibilityMenu component
   - BaseToolbarActions pattern

3. **jobs-table.tsx** ✅
   - Previously completed
   - Has archive functionality

4. **invoices-table.tsx** ✅
   - Previously completed
   - Has archive functionality

---

### 🔄 IN PROGRESS (2 files)

5. **estimates-table.tsx** 🔄 95% COMPLETE
   - ✅ Added imports (useArchiveStore, AlertDialog, Archive icon, useState)
   - ✅ Added archived_at/deleted_at to type
   - ✅ Added archive filter state
   - ✅ Added filtered data logic
   - ✅ Updated ALL columns with sortable/hideable flags:
     - estimateNumber: hideable: false (primary)
     - customer: sortable: true, hideable: true
     - project: sortable: true, hideable: false (secondary primary)
     - date, validUntil, amount, status: all sortable: true, hideable: true
   - ✅ Changed archive dropdown menu item
   - ✅ Updated bulk actions to archive
   - ✅ Updated FullWidthDataTable props (entity, isArchived, showArchived)
   - ✅ Added single + bulk archive dialogs
   - **Remaining**: Test in browser

6. **payments-table.tsx** 🔄 15% COMPLETE
   - ✅ Added useArchiveStore import
   - ✅ Added archived_at/deleted_at to type
   - ⚠️ NEED: Add archive filter state + filtered data logic
   - ⚠️ NEED: Update columns with sortable/hideable
   - ⚠️ NEED: Update FullWidthDataTable props
   - ⚠️ NEED: Add archive dialogs

---

### ❌ NOT STARTED - Datatable Components (4 files)

7. **contracts-table.tsx** ❌
   - Entity: `contracts`
   - Primary Column: `contractNumber`
   - Columns: contractNumber (hideable: false), customer, title (hideable: false), contractType, signerName, date, validUntil, status (all hideable: true)

8. **equipment-table.tsx** ❌
   - Entity: `equipment`
   - Primary Column: `assetId`
   - Columns: assetId (hideable: false), name (hideable: false), assignedTo, lastService, nextService, status (all hideable: true)

9. **materials-table.tsx** ❌
   - Entity: `materials`
   - Primary Column: `itemCode`
   - Columns: itemCode (hideable: false), description (hideable: false), category, quantity, unit, unitCost, totalValue, status (all hideable: true)

10. **maintenance-plans-table.tsx** ❌
    - Entity: `maintenance_plans`
    - Primary Column: `planName`
    - Columns: planName (hideable: false), customer (hideable: false), serviceType, frequency, nextVisit, monthlyFee, status (all hideable: true)

11. **service-agreements-table.tsx** ❌
    - Entity: `service_agreements`
    - Need to inspect structure

12. **purchase-orders-table.tsx** ❌
    - Entity: `purchase_orders`
    - Need to inspect structure

13. **teams-table.tsx** ❌
    - Entity: `team_members`
    - Need to inspect structure

14. **customers-table.tsx** ❌
    - Entity: `customers`
    - Need to inspect structure

---

### ❌ NOT STARTED - Toolbar Components (10 files)

15. **estimate-toolbar-actions.tsx** ❌
16. **payments-toolbar-actions.tsx** ❌
17. **contract-toolbar-actions.tsx** ❌
18. **equipment-toolbar-actions.tsx** ❌
19. **materials-toolbar-actions.tsx** ❌
20. **maintenance-plan-toolbar-actions.tsx** ❌
21. **service-agreement-toolbar-actions.tsx** ❌
22. **purchase-order-toolbar-actions.tsx** ❌
23. **team-toolbar-actions.tsx** ❌
24. **customers-toolbar-actions.tsx** ❌

**Pattern for ALL toolbars** (EXACT same code for each):

```typescript
"use client";

import { useArchiveStore } from "@/lib/stores/archive-store";
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define hideable columns (all columns EXCEPT primary ones)
const ENTITY_COLUMNS = [
  { key: "column1", label: "Column 1" },
  { key: "column2", label: "Column 2" },
  // ... list ALL hideable columns from table
];

export function EntityToolbarActions({
  totalCount = 0,
}: {
  totalCount?: number;
}) {
  const archiveFilter = useArchiveStore((state) => state.filters.ENTITY_NAME);

  // Calculate counts (will be passed from page)
  const activeCount = totalCount;
  const archivedCount = 0;

  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect
            activeCount={activeCount}
            archivedCount={archivedCount}
            entity="entity-name"
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={ENTITY_COLUMNS}
            entity="entity-name"
          />
        </div>
      }
      // ... KEEP ALL existing props (importExportDataType, primaryAction, viewSwitcherSection, etc.)
    />
  );
}
```

---

### ❌ NOT STARTED - Page Components (10 files)

25. **work/estimates/page.tsx** ❌
26. **work/payments/page.tsx** ❌
27. **work/contracts/page.tsx** ❌
28. **work/equipment/page.tsx** ❌
29. **work/materials/page.tsx** ❌
30. **work/maintenance-plans/page.tsx** ❌
31. **work/service-agreements/page.tsx** ❌
32. **work/purchase-orders/page.tsx** ❌
33. **work/team/page.tsx** ❌
34. **customers/page.tsx** ❌

**Pattern for ALL pages**:

```typescript
// ❌ REMOVE this filter from query
.is("archived_at", null)

// ✅ ADD archived fields to mapped data
const items = data.map(item => ({
  ...item,
  archived_at: item.archived_at,
  deleted_at: item.deleted_at,
}));

// ✅ Filter stats to only count active items
const activeItems = items.filter(i => !i.archived_at && !i.deleted_at);
const stats = {
  total: activeItems.length, // Use activeItems, not items
  // ... calculate other stats from activeItems
};
```

---

## Exact Changes Needed for Each Datatable

### 1. Imports (add if not present)
```typescript
import { useArchiveStore } from "@/lib/stores/archive-store";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Archive } from "lucide-react"; // If not already imported
```

### 2. Type Definition (add these fields)
```typescript
export type Entity = {
  // ... existing fields
  archived_at?: string | null;
  deleted_at?: string | null;
};
```

### 3. Component State (add at top of component function)
```typescript
// Archive filter state
const archiveFilter = useArchiveStore((state) => state.filters.ENTITY_NAME);
const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
const [itemToArchive, setItemToArchive] = useState<string | null>(null);
const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

// Filter data based on archive status
const filteredItems = items.filter((item) => {
  const isArchived = !!((item as any).archived_at || (item as any).deleted_at);
  if (archiveFilter === "active") return !isArchived;
  if (archiveFilter === "archived") return isArchived;
  return true; // "all"
});
```

### 4. Update Column Definitions
```typescript
// For PRIMARY columns (name, number, title):
{
  key: "primaryField",
  header: "Primary Field",
  sortable: true,
  hideable: false,  // ← PRIMARY = FALSE
  sortFn: (a, b) => a.primaryField.localeCompare(b.primaryField),
  // ... rest of column def
}

// For ALL other columns:
{
  key: "otherField",
  header: "Other Field",
  sortable: true,
  hideable: true,  // ← ALL OTHERS = TRUE
  sortFn: (a, b) => a.otherField.localeCompare(b.otherField),
  // ... rest of column def
}
```

### 5. Update Actions Dropdown (replace Delete with Archive)
```typescript
<DropdownMenuItem
  className="text-destructive"
  onClick={() => {
    setItemToArchive(item.id);
    setIsSingleArchiveOpen(true);
  }}
>
  <Archive className="mr-2 size-4" />
  Archive {EntityLabel}
</DropdownMenuItem>
```

### 6. Update Bulk Actions (replace Delete with Archive)
```typescript
const bulkActions: BulkAction[] = [
  {
    label: "Archive Selected",
    icon: <Archive className="h-4 w-4" />,
    onClick: async (selectedIds) => {
      setSelectedItemIds(selectedIds);
      setIsBulkArchiveOpen(true);
    },
    variant: "destructive",
  },
];
```

### 7. Update FullWidthDataTable Props
```typescript
<FullWidthDataTable
  data={filteredItems}  // ← Use filtered, not original items
  entity="entity-name"  // ← Add entity prop
  isArchived={(item) => !!((item as any).archived_at || (item as any).deleted_at)}  // ← Add isArchived
  showArchived={archiveFilter !== "active"}  // ← Add showArchived
  // ... keep all other existing props
/>
```

### 8. Add Archive Dialogs (add after FullWidthDataTable, before closing fragment)
```typescript
{/* Single Archive Dialog */}
<AlertDialog
  onOpenChange={setIsSingleArchiveOpen}
  open={isSingleArchiveOpen}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Archive {EntityLabel}?</AlertDialogTitle>
      <AlertDialogDescription>
        This {entity_label} will be archived and can be restored within 90
        days. After 90 days, it will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={async () => {
          if (itemToArchive) {
            const { archiveEntity } = await import("@/actions/ENTITY_ACTION_FILE");
            await archiveEntity(itemToArchive);
            window.location.reload();
          }
        }}
      >
        Archive
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

{/* Bulk Archive Dialog */}
<AlertDialog onOpenChange={setIsBulkArchiveOpen} open={isBulkArchiveOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Archive {selectedItemIds.size} {EntityLabel}(s)?
      </AlertDialogTitle>
      <AlertDialogDescription>
        These {entity_label_plural} will be archived and can be restored within 90
        days. After 90 days, they will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={async () => {
          const { archiveEntity } = await import("@/actions/ENTITY_ACTION_FILE");
          for (const id of selectedItemIds) {
            await archiveEntity(id);
          }
          window.location.reload();
        }}
      >
        Archive All
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Entity Configuration Reference

| Entity | Entity Name (store) | Action Import | Archive Function | Primary Columns |
|--------|---------------------|---------------|------------------|-----------------|
| Estimates | `estimates` | `@/actions/estimates` | `archiveEstimate` | estimateNumber, project |
| Payments | `payments` | `@/actions/payments` | `archivePayment` | payment_number |
| Contracts | `contracts` | `@/actions/contracts` | `archiveContract` | contractNumber, title |
| Equipment | `equipment` | `@/actions/equipment` | `archiveEquipment` | assetId, name |
| Materials | `materials` | `@/actions/materials` | `archiveMaterial` | itemCode, description |
| Maintenance Plans | `maintenance_plans` | `@/actions/maintenance-plans` | `archiveMaintenancePlan` | planName, customer |
| Service Agreements | `service_agreements` | `@/actions/service-agreements` | `archiveServiceAgreement` | agreement_number, title |
| Purchase Orders | `purchase_orders` | `@/actions/purchase-orders` | `archivePurchaseOrder` | po_number |
| Team Members | `team_members` | `@/actions/team` | `archiveTeamMember` | name or email |
| Customers | `customers` | `@/actions/customers` | `archiveCustomer` | display_name or first_name/last_name |

---

## Next Steps

### Priority 1: Complete In-Progress Files
1. ✅ estimates-table.tsx - COMPLETE (needs browser testing)
2. 🔄 payments-table.tsx - Add filtering, column flags, dialogs (50% remaining)

### Priority 2: Complete Remaining Datatables (in order)
3. contracts-table.tsx
4. equipment-table.tsx
5. materials-table.tsx
6. maintenance-plans-table.tsx
7. service-agreements-table.tsx
8. purchase-orders-table.tsx
9. teams-table.tsx
10. customers-table.tsx

### Priority 3: Batch Update All Toolbars
- All 10 toolbars use IDENTICAL pattern
- Can be done quickly in batch
- Only differences: entity name and column list

### Priority 4: Batch Update All Pages
- All 10 pages use IDENTICAL pattern
- Remove `.is("archived_at", null)` from queries
- Add archived fields to mapped data
- Filter stats to active items only

---

## Testing Checklist

After completing each datatable:
- [ ] Archive filter shows correct counts (Active/Archived/All)
- [ ] Column visibility menu shows all hideable columns
- [ ] Primary columns are NOT in visibility menu (hideable: false)
- [ ] Sorting works on all columns
- [ ] Archive button in dropdown opens dialog
- [ ] Bulk archive with selection works
- [ ] Archived items show with visual indicator
- [ ] Stats only count active items
- [ ] Page loads without errors

---

## Files Reference

### Completed Examples (use as templates):
- **Datatable**: `/Users/byronwade/Thorbis/src/components/work/appointments-table.tsx`
- **Toolbar**: `/Users/byronwade/Thorbis/src/components/work/appointments-toolbar-actions.tsx`
- **Page**: `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/appointments/page.tsx`

### In Progress:
- `/Users/byronwade/Thorbis/src/components/work/estimates-table.tsx` (95%)
- `/Users/byronwade/Thorbis/src/components/work/payments-table.tsx` (15%)

---

## Notes

- Use `(item as any)` casts for archived_at/deleted_at checks until types regenerated
- ALL columns sortable except actions column
- Primary/title columns: hideable: false
- All other columns: hideable: true
- Remove `.is("archived_at", null)` from ALL database queries
- Stats calculations must filter to activeItems first
- Archive dialogs import action functions dynamically
- Use EXACT pattern from appointments-table.tsx

---

**Last Updated**: 2025-11-12 (during systematic update session)
