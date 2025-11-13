# Datatable Enhancement Pattern - Complete Implementation Guide

## Status: PARTIALLY COMPLETE

**Completed:**
- ✅ appointments-table.tsx - Full archive pattern implemented
- ✅ appointments-toolbar-actions.tsx - Archive filter + column visibility
- ✅ appointments page.tsx - Removed database filtering, added archived_at/deleted_at to data
- ✅ contracts-table.tsx - Full archive pattern implemented

**Remaining: 24 files**

---

## EXACT PATTERN TO APPLY

### 1. Table Component Changes (7 files remaining)

**Files:**
- src/components/work/equipment-table.tsx
- src/components/work/materials-table.tsx
- src/components/work/maintenance-plans-table.tsx
- src/components/work/service-agreements-table.tsx
- src/components/work/purchase-orders-table.tsx
- src/components/work/teams-table.tsx
- src/components/customers/customers-table.tsx

**Steps for EACH table:**

#### Step 1: Add imports
```typescript
// Add to imports at top
import { Archive } from "lucide-react"; // If not already present
import { useState } from "react"; // If not already present
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
import { useArchiveStore } from "@/lib/stores/archive-store";
```

#### Step 2: Add archived_at/deleted_at to type
```typescript
export type EntityName = {
  // ... existing fields ...
  archived_at?: string | null;
  deleted_at?: string | null;
};
```

#### Step 3: Add archive state and filtering
```typescript
export function EntityTable({ items, itemsPerPage = 50 }: Props) {
  // Archive filter state
  const archiveFilter = useArchiveStore((state) => state.filters.entity_name);

  // State for archive confirmation dialogs
  const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
  const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Filter items based on archive status
  const filteredItems = items.filter((item) => {
    const isArchived = !!((item as any).archived_at || (item as any).deleted_at);
    if (archiveFilter === "active") return !isArchived;
    if (archiveFilter === "archived") return isArchived;
    return true; // "all"
  });

  const columns: ColumnDef<EntityType>[] = [
```

#### Step 4: Update ALL column definitions
```typescript
// For EVERY column, add:
{
  key: "column_name",
  header: "Column Header",
  width: "w-XX",
  shrink: true/false,
  hideOnMobile: true/false, // if applicable
  sortable: true, // for data columns
  hideable: true, // for non-essential columns (false for ID, name, actions)
  render: (item) => (/* ... */)
}

// Actions column should always be:
sortable: false,
hideable: false,
```

#### Step 5: Update row action menu
```typescript
// Change Delete to Archive
<DropdownMenuItem
  className="text-destructive"
  onClick={() => {
    setItemToArchive(item.id);
    setIsSingleArchiveOpen(true);
  }}
>
  <Archive className="mr-2 size-4" />
  Archive EntityName
</DropdownMenuItem>
```

#### Step 6: Update bulk actions
```typescript
const bulkActions: BulkAction[] = [
  // ... existing actions ...
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

#### Step 7: Update FullWidthDataTable props
```typescript
return (
  <>
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={filteredItems} // CHANGED from items
      // ... other props ...
      entity="entity_name" // ADD THIS
      getItemId={(item) => item.id}
      isArchived={(item) => !!((item as any).archived_at || (item as any).deleted_at)} // ADD THIS
      itemsPerPage={itemsPerPage}
      // ... other props ...
      showArchived={archiveFilter !== "active"} // ADD THIS
    />

    {/* Archive Dialogs - ADD THESE */}
    {/* Single Archive Dialog */}
    <AlertDialog
      onOpenChange={setIsSingleArchiveOpen}
      open={isSingleArchiveOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive EntityName?</AlertDialogTitle>
          <AlertDialogDescription>
            This item will be archived and can be restored within 90 days.
            After 90 days, it will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={async () => {
              if (itemToArchive) {
                // TODO: Implement archive action
                console.log("Archive item:", itemToArchive);
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
            Archive {selectedItemIds.size} Item(s)?
          </AlertDialogTitle>
          <AlertDialogDescription>
            These items will be archived and can be restored within 90
            days. After 90 days, they will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={async () => {
              for (const itemId of selectedItemIds) {
                console.log("Archive item:", itemId);
              }
              window.location.reload();
            }}
          >
            Archive All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
```

---

### 2. Toolbar Component Changes (10 files)

**Files:**
- src/components/work/estimate-toolbar-actions.tsx
- src/components/work/payments-toolbar-actions.tsx
- src/components/work/contract-toolbar-actions.tsx
- src/components/work/equipment-toolbar-actions.tsx (may be in inventory/)
- src/components/inventory/materials-toolbar-actions.tsx
- src/components/work/maintenance-plan-toolbar-actions.tsx
- src/components/work/service-agreement-toolbar-actions.tsx
- src/components/work/purchase-order-toolbar-actions.tsx
- src/components/work/team-toolbar-actions.tsx
- src/components/customers/customers-toolbar-actions.tsx

**Pattern (EXACT copy from appointments):**

```typescript
"use client";

import { useArchiveStore } from "@/lib/stores/archive-store";
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define ALL hideable columns for this entity
const ENTITY_COLUMNS = [
  { key: "column1", label: "Column 1" },
  { key: "column2", label: "Column 2" },
  // ... all columns that have hideable: true
];

export function EntityToolbarActions({
  totalCount = 0,
}: {
  totalCount?: number;
}) {
  const archiveFilter = useArchiveStore((state) => state.filters.entity_name);

  const activeCount = totalCount; // TODO: Get actual counts from page
  const archivedCount = 0; // TODO: Get actual counts from page

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
      importExportDataType="entity-name"
      primaryAction={{
        href: "/dashboard/work/entity-name/new",
        label: "New EntityName",
      }}
      viewSwitcherSection="entity-name"
    />
  );
}
```

---

### 3. Page Component Changes (10 files)

**Files:**
- src/app/(dashboard)/dashboard/work/estimates/page.tsx
- src/app/(dashboard)/dashboard/work/payments/page.tsx
- src/app/(dashboard)/dashboard/work/contracts/page.tsx
- src/app/(dashboard)/dashboard/work/equipment/page.tsx
- src/app/(dashboard)/dashboard/work/materials/page.tsx
- src/app/(dashboard)/dashboard/work/maintenance-plans/page.tsx
- src/app/(dashboard)/dashboard/work/service-agreements/page.tsx
- src/app/(dashboard)/dashboard/work/purchase-orders/page.tsx
- src/app/(dashboard)/dashboard/work/team/page.tsx
- src/app/(dashboard)/dashboard/customers/page.tsx

**Changes for EACH page:**

#### Change 1: Remove database-level archive filtering
```typescript
// BEFORE:
const { data: items, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("company_id", activeCompanyId)
  .is("archived_at", null)  // REMOVE THIS LINE
  .is("deleted_at", null)   // REMOVE THIS LINE
  .order("created_at", { ascending: false });

// AFTER:
const { data: items, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("company_id", activeCompanyId)
  .order("created_at", { ascending: false });
```

#### Change 2: Add archived_at/deleted_at to mapped data
```typescript
// In the .map() transformation, add:
const mappedItems = (itemsRaw || []).map((item: any) => ({
  // ... existing fields ...
  archived_at: item.archived_at,  // ADD THIS
  deleted_at: item.deleted_at,    // ADD THIS
}));
```

#### Change 3: Filter stats to only count active items
```typescript
// After mapping, before stats calculation:
const activeItems = mappedItems.filter(
  (item) => !item.archived_at && !item.deleted_at
);

// Then use activeItems for ALL stats calculations:
const statusCounts = activeItems.filter((item) => item.status === "...").length;
```

---

## Entity Name Mapping (Use Exact Names)

| Component | Entity Name (store) | Entity Name (ArchiveFilterSelect) |
|-----------|---------------------|-----------------------------------|
| equipment | `equipment` | `"equipment"` |
| materials | `materials` | `"materials"` |
| maintenance-plans | `maintenance_plans` | `"maintenance-plans"` |
| service-agreements | `service_agreements` | `"service-agreements"` |
| purchase-orders | `purchase_orders` | `"purchase-orders"` |
| teams | `team_members` | `"team-members"` |
| customers | `customers` | `"customers"` |
| estimates | `estimates` | `"estimates"` |
| payments | `payments` | `"payments"` |
| contracts | `contracts` | `"contracts"` |

---

## Verification Checklist (For Each Entity)

### Table Component:
- ✅ Import Archive icon and useArchiveStore
- ✅ Import AlertDialog components
- ✅ Add archived_at/deleted_at to type definition
- ✅ Add archive filter state from store
- ✅ Add dialog state (isSingleArchiveOpen, isBulkArchiveOpen, itemToArchive, selectedItemIds)
- ✅ Add filteredItems with (item as any) casts
- ✅ ALL columns have sortable: true/false
- ✅ ALL columns have hideable: true/false
- ✅ Replace Delete menu item with Archive
- ✅ Update bulk actions to include "Archive Selected"
- ✅ Update FullWidthDataTable: add entity, isArchived, showArchived
- ✅ Use filteredItems for data prop
- ✅ Add both archive dialogs after closing </FullWidthDataTable> tag

### Toolbar Component:
- ✅ Import useArchiveStore, ArchiveFilterSelect, ColumnVisibilityMenu
- ✅ Define ENTITY_COLUMNS array with ALL hideable columns
- ✅ Add beforePrimaryAction with ArchiveFilterSelect and ColumnVisibilityMenu
- ✅ Use correct entity names (kebab-case for props)

### Page Component:
- ✅ Remove `.is("archived_at", null)`
- ✅ Remove `.is("deleted_at", null)`
- ✅ Add archived_at to mapped data
- ✅ Add deleted_at to mapped data
- ✅ Filter stats: `const activeItems = items.filter(i => !i.archived_at && !i.deleted_at)`
- ✅ Use activeItems for all stat calculations

---

## Quick Reference: Column Visibility by Entity

### Equipment Columns (hideable: true):
- customer, location, status, category, manufacturer, model, serial_number, installation_date, last_service_date

### Materials Columns (hideable: true):
- category, unit, quantity, reorder_level, cost, supplier, location

### Maintenance Plans Columns (hideable: true):
- customer, service_type, frequency, next_service, status, assigned_to

### Service Agreements Columns (hideable: true):
- customer, service_type, start_date, end_date, status, billing_cycle

### Purchase Orders Columns (hideable: true):
- vendor, order_date, delivery_date, status, total_amount

### Teams Columns (hideable: true):
- email, role, phone, status, hire_date

### Customers Columns (hideable: true):
- email, phone, address, city, state, customer_type, status

### Estimates Columns (hideable: true):
- customer, date, valid_until, status, total

### Payments Columns (hideable: true):
- customer, invoice, payment_date, payment_method, status, amount

### Contracts Columns (hideable: true):
- customer, contractType, signerName, date, validUntil, status

---

## Implementation Order (Recommended)

1. **Remaining Tables (7 files)** - Most complex changes
2. **Toolbar Actions (10 files)** - Simple, repetitive pattern
3. **Page Components (10 files)** - Simple database query changes

Total: 27 files remaining to update

---

## Notes

- Use `(item as any)` for archived_at/deleted_at checks (types will be regenerated later)
- All entity names must match the archive store exactly
- Column visibility entity names use kebab-case
- Archive store entity names use snake_case for multi-word entities
- Keep dialog text consistent across all entities
- TODO comments are acceptable for archive actions (will be implemented later)

---

## Generated: 2025-11-12
## Completed Files: 4 / 31 (13%)
## Remaining Files: 27 (87%)
