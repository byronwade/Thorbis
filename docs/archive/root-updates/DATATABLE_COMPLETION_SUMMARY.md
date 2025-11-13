# Datatable Enhancement Pattern - Implementation Summary

## Completed Work

### Files Successfully Updated (4/31 - 13%)

1. ✅ **src/components/work/appointments-table.tsx**
   - Added archive filter integration with useArchiveStore
   - Added sortable and hideable properties to all columns
   - Implemented single and bulk archive dialogs
   - Added filteredAppointments based on archive status
   - Updated FullWidthDataTable with entity, isArchived, showArchived props

2. ✅ **src/components/work/appointments-toolbar-actions.tsx**
   - Added ArchiveFilterSelect component
   - Added ColumnVisibilityMenu component
   - Integrated with useArchiveStore

3. ✅ **src/app/(dashboard)/dashboard/work/appointments/page.tsx**
   - Removed `.is("archived_at", null)` and `.is("deleted_at", null)` from query
   - Added archived_at and deleted_at to mapped data
   - Filtered stats to only count active appointments

4. ✅ **src/components/work/contracts-table.tsx**
   - Complete archive pattern implementation
   - All columns updated with sortable/hideable properties
   - Archive dialogs added
   - Filtered data integration

---

## Remaining Work (27 files - 87%)

### Priority 1: Remaining Table Components (7 files)

These are the most complex updates requiring ~100-150 lines of changes each:

1. **src/components/work/equipment-table.tsx**
   - Status: Partially prepared (already has Archive import and bulk action placeholder)
   - Needs: Type update, state management, filtered data, column properties, dialog implementation
   - Entity: `equipment`
   - Hideable columns: assignedTo, lastService, nextService, status

2. **src/components/work/materials-table.tsx**
   - Entity: `materials`
   - Estimated hideable columns: category, unit, quantity, cost, supplier, location

3. **src/components/work/maintenance-plans-table.tsx**
   - Entity: `maintenance_plans`
   - Estimated hideable columns: customer, serviceType, frequency, nextService, status, assignedTo

4. **src/components/work/service-agreements-table.tsx**
   - Entity: `service_agreements`
   - Estimated hideable columns: customer, serviceType, startDate, endDate, status, billingCycle

5. **src/components/work/purchase-orders-table.tsx**
   - Entity: `purchase_orders`
   - Longest file (348 lines)
   - Estimated hideable columns: vendor, orderDate, deliveryDate, status, totalAmount

6. **src/components/work/teams-table.tsx**
   - Entity: `team_members`
   - Longest file (609 lines) - may have complex structure
   - Estimated hideable columns: email, role, phone, status, hireDate

7. **src/components/customers/customers-table.tsx**
   - Entity: `customers`
   - Estimated hideable columns: email, phone, address, city, state, customerType, status

### Priority 2: Toolbar Action Components (10 files)

These are simple, repetitive updates (~30 lines of changes each):

1. **src/components/work/estimate-toolbar-actions.tsx**
2. **src/components/work/payments-toolbar-actions.tsx**
3. **src/components/work/contract-toolbar-actions.tsx**
4. **src/components/work/equipment-toolbar-actions.tsx** (may be in inventory/)
5. **src/components/inventory/materials-toolbar-actions.tsx**
6. **src/components/work/maintenance-plan-toolbar-actions.tsx**
7. **src/components/work/service-agreement-toolbar-actions.tsx**
8. **src/components/work/purchase-order-toolbar-actions.tsx**
9. **src/components/work/team-toolbar-actions.tsx**
10. **src/components/customers/customers-toolbar-actions.tsx**

**Standard Pattern for ALL Toolbars:**
```typescript
"use client";

import { useArchiveStore } from "@/lib/stores/archive-store";
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

const ENTITY_COLUMNS = [
  // List ALL hideable columns from corresponding table
];

export function EntityToolbarActions({ totalCount = 0 }: { totalCount?: number }) {
  const archiveFilter = useArchiveStore((state) => state.filters.entity_name);

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
      importExportDataType="entity-name"
      primaryAction={{
        href: "/dashboard/path/to/new",
        label: "New EntityName",
      }}
      viewSwitcherSection="entity-name"
    />
  );
}
```

### Priority 3: Page Components (10 files)

These are simple query updates (~10 lines of changes each):

1. **src/app/(dashboard)/dashboard/work/estimates/page.tsx**
2. **src/app/(dashboard)/dashboard/work/payments/page.tsx**
3. **src/app/(dashboard)/dashboard/work/contracts/page.tsx**
4. **src/app/(dashboard)/dashboard/work/equipment/page.tsx**
5. **src/app/(dashboard)/dashboard/work/materials/page.tsx**
6. **src/app/(dashboard)/dashboard/work/maintenance-plans/page.tsx**
7. **src/app/(dashboard)/dashboard/work/service-agreements/page.tsx**
8. **src/app/(dashboard)/dashboard/work/purchase-orders/page.tsx**
9. **src/app/(dashboard)/dashboard/work/team/page.tsx**
10. **src/app/(dashboard)/dashboard/customers/page.tsx**

**Standard Pattern for ALL Pages:**
```typescript
// Remove these lines from query:
.is("archived_at", null)
.is("deleted_at", null)

// Add to mapped data:
archived_at: item.archived_at,
deleted_at: item.deleted_at,

// Filter stats:
const activeItems = mappedItems.filter(
  (item) => !item.archived_at && !item.deleted_at
);
// Use activeItems for all stat calculations
```

---

## Entity Name Reference Table

| File Path | Store Entity | Archive Filter Entity | URL Path |
|-----------|--------------|----------------------|----------|
| equipment-table | `equipment` | `"equipment"` | `/work/equipment` |
| materials-table | `materials` | `"materials"` | `/work/materials` |
| maintenance-plans-table | `maintenance_plans` | `"maintenance-plans"` | `/work/maintenance-plans` |
| service-agreements-table | `service_agreements` | `"service-agreements"` | `/work/service-agreements` |
| purchase-orders-table | `purchase_orders` | `"purchase-orders"` | `/work/purchase-orders` |
| teams-table | `team_members` | `"team-members"` | `/work/team` |
| customers-table | `customers` | `"customers"` | `/customers` |
| estimates-table | `estimates` | `"estimates"` | `/work/estimates` |
| payments-table | `payments` | `"payments"` | `/work/payments` |
| contracts-table | `contracts` | `"contracts"` | `/work/contracts` |

---

## Archive Store Filter Names

Based on `/src/lib/stores/archive-store.ts`, the exact filter names are:

```typescript
filters: {
  appointments: "active" | "archived" | "all",
  contracts: "active" | "archived" | "all",
  customers: "active" | "archived" | "all",
  equipment: "active" | "archived" | "all",
  estimates: "active" | "archived" | "all",
  invoices: "active" | "archived" | "all",
  jobs: "active" | "archived" | "all",
  maintenance_plans: "active" | "archived" | "all",
  materials: "active" | "archived" | "all",
  payments: "active" | "archived" | "all",
  purchase_orders: "active" | "archived" | "all",
  service_agreements: "active" | "archived" | "all",
  team_members: "active" | "archived" | "all",
}
```

---

## Implementation Checklist Template

Copy this checklist for each remaining file:

### For Table Components (7 remaining):

```
Entity: [name]
File: src/components/.../[entity]-table.tsx

✅ Step 1: Add imports
  - Import { Archive } from "lucide-react"
  - Import { useState } from "react"
  - Import AlertDialog components
  - Import { useArchiveStore } from "@/lib/stores/archive-store"

✅ Step 2: Update type definition
  - Add archived_at?: string | null;
  - Add deleted_at?: string | null;

✅ Step 3: Add state management
  - const archiveFilter = useArchiveStore((state) => state.filters.[entity]);
  - const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
  - const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
  - const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  - const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

✅ Step 4: Add filtered data
  - const filteredItems = items.filter((item) => {
      const isArchived = !!((item as any).archived_at || (item as any).deleted_at);
      if (archiveFilter === "active") return !isArchived;
      if (archiveFilter === "archived") return isArchived;
      return true;
    });

✅ Step 5: Update ALL column definitions
  - Add sortable: true/false to every column
  - Add hideable: true/false to every column
  - ID columns and actions: hideable: false
  - Data columns: hideable: true

✅ Step 6: Update row actions menu
  - Replace Delete with Archive
  - Add onClick handler to open single archive dialog

✅ Step 7: Update bulk actions
  - Change "Delete" to "Archive Selected"
  - Update onClick to open bulk archive dialog

✅ Step 8: Update FullWidthDataTable props
  - data={filteredItems} (not items)
  - entity="[entity-name]"
  - isArchived={(item) => !!((item as any).archived_at || (item as any).deleted_at)}
  - showArchived={archiveFilter !== "active"}

✅ Step 9: Add archive dialogs
  - Single archive dialog after </FullWidthDataTable>
  - Bulk archive dialog after single dialog
```

### For Toolbar Components (10 remaining):

```
Entity: [name]
File: src/components/.../[entity]-toolbar-actions.tsx

✅ Complete rewrite using appointments-toolbar-actions.tsx pattern
✅ Define [ENTITY]_COLUMNS array with all hideable columns
✅ Import useArchiveStore, ArchiveFilterSelect, ColumnVisibilityMenu
✅ Use correct entity names (kebab-case for props, snake_case for store)
```

### For Page Components (10 remaining):

```
Entity: [name]
File: src/app/(dashboard)/dashboard/.../page.tsx

✅ Remove .is("archived_at", null) from query
✅ Remove .is("deleted_at", null) from query
✅ Add archived_at: item.archived_at to mapped data
✅ Add deleted_at: item.deleted_at to mapped data
✅ Add activeItems filter before stats
✅ Use activeItems for all stat calculations
```

---

## Testing Checklist (After All Changes)

For each entity, verify:

1. ✅ Archive filter dropdown appears in toolbar
2. ✅ Column visibility menu appears in toolbar
3. ✅ Clicking "Active" shows only non-archived items
4. ✅ Clicking "Archived" shows only archived items
5. ✅ Clicking "All" shows all items
6. ✅ Column visibility menu lists all hideable columns
7. ✅ Hiding columns removes them from table
8. ✅ Archive button appears in row actions menu
9. ✅ Bulk "Archive Selected" action appears
10. ✅ Archive dialogs open correctly
11. ✅ Stats only count active (non-archived) items

---

## Estimated Completion Time

- Table components: ~30 min each = 3.5 hours
- Toolbar components: ~5 min each = 50 minutes
- Page components: ~5 min each = 50 minutes

**Total estimated time: ~5.5 hours**

---

## Next Steps

1. Complete remaining 7 table components (equipment, materials, maintenance-plans, service-agreements, purchase-orders, teams, customers)
2. Complete all 10 toolbar action components
3. Complete all 10 page components
4. Run verification tests on each entity
5. Update types after database migrations
6. Replace TODO comments with actual archive actions

---

## Reference Files

- ✅ Complete Reference: `/src/components/work/appointments-table.tsx`
- ✅ Complete Reference: `/src/components/work/appointments-toolbar-actions.tsx`
- ✅ Complete Reference: `/src/app/(dashboard)/dashboard/work/appointments/page.tsx`
- ✅ Complete Reference: `/src/components/work/contracts-table.tsx`
- 📋 Implementation Guide: `/DATATABLE_ENHANCEMENT_COMPLETION_GUIDE.md`

---

## Generated: 2025-11-12
## Status: 4/31 files complete (13%)
## Last Updated: After completing contracts-table.tsx
