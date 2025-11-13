# Complete Datatable Enhancement Update Plan

## Status: IN PROGRESS
**Started**: 2025-11-12
**Scope**: 30 files (10 datatables + 10 toolbars + 10 pages)

---

## Files Already Complete ✅

1. ✅ `src/components/work/appointments-table.tsx`
2. ✅ `src/components/work/appointments-toolbar-actions.tsx`
3. ✅ `src/app/(dashboard)/dashboard/work/appointments/page.tsx`
4. ✅ `src/components/work/jobs-table.tsx`
5. ✅ `src/components/work/invoices-table.tsx`
6. ✅ `src/components/work/estimates-table.tsx` - **JUST COMPLETED**
7. 🔄 `src/components/work/payments-table.tsx` - **IN PROGRESS (imports done)**

---

## Remaining Files (23 files)

### Datatable Components (7 remaining)

#### 1. payments-table.tsx
- **Entity**: `payments`
- **Action Import**: `@/actions/payments`
- **Archive Function**: `archivePayment`
- **Primary Column**: `payment_number` (hideable: false)
- **Status**: 🔄 IN PROGRESS (50% complete - imports added, need filtering and dialogs)
- **Changes Needed**:
  - ✅ Add `useArchiveStore` import
  - ✅ Add `archived_at`, `deleted_at` to type
  - ⚠️ Add archive filter state
  - ⚠️ Add filtered data logic
  - ⚠️ Add sortable/hideable to all columns
  - ⚠️ Update FullWidthDataTable props (entity, isArchived, showArchived)
  - ⚠️ Add archive dialogs

#### 2. contracts-table.tsx
- **Entity**: `contracts`
- **Action Import**: `@/actions/contracts`
- **Archive Function**: `archiveContract`
- **Primary Column**: `contractNumber` (hideable: false)
- **Sortable Columns**: contractNumber, customer, title, contractType, signerName, date, validUntil, status
- **Status**: ❌ NOT STARTED

#### 3. equipment-table.tsx
- **Entity**: `equipment`
- **Action Import**: `@/actions/equipment`
- **Archive Function**: `archiveEquipment`
- **Primary Column**: `equipment_number` or `name`
- **Status**: ❌ NOT STARTED

#### 4. materials-table.tsx
- **Entity**: `materials`
- **Action Import**: `@/actions/materials`
- **Archive Function**: `archiveMaterial`
- **Primary Column**: `name` or `sku`
- **Status**: ❌ NOT STARTED

#### 5. maintenance-plans-table.tsx
- **Entity**: `maintenance_plans`
- **Action Import**: `@/actions/maintenance-plans`
- **Archive Function**: `archiveMaintenancePlan`
- **Primary Column**: `plan_number` or `name`
- **Status**: ❌ NOT STARTED

#### 6. service-agreements-table.tsx
- **Entity**: `service_agreements`
- **Action Import**: `@/actions/service-agreements`
- **Archive Function**: `archiveServiceAgreement`
- **Primary Column**: `agreement_number` or `title`
- **Status**: ❌ NOT STARTED

#### 7. purchase-orders-table.tsx
- **Entity**: `purchase_orders`
- **Action Import**: `@/actions/purchase-orders`
- **Archive Function**: `archivePurchaseOrder`
- **Primary Column**: `po_number`
- **Status**: ❌ NOT STARTED

#### 8. teams-table.tsx
- **Entity**: `team_members`
- **Action Import**: `@/actions/team`
- **Archive Function**: `archiveTeamMember`
- **Primary Column**: `name` or `email`
- **Status**: ❌ NOT STARTED

#### 9. customers-table.tsx
- **Entity**: `customers`
- **Action Import**: `@/actions/customers`
- **Archive Function**: `archiveCustomer`
- **Primary Column**: `display_name` or `first_name`/`last_name`
- **Status**: ❌ NOT STARTED

---

### Toolbar Components (10 remaining)

All toolbars follow the EXACT same pattern:

```typescript
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

const ENTITY_COLUMNS = [
  { key: "field1", label: "Label 1" },
  { key: "field2", label: "Label 2" },
  // ... all hideable columns
];

export function EntityToolbarActions({ totalCount = 0 }) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect
            entity="entity-name"
            activeCount={0}
            archivedCount={0}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            entity="entity-name"
            columns={ENTITY_COLUMNS}
          />
        </div>
      }
      // ... existing props
    />
  );
}
```

#### Toolbar Files:
1. ❌ `estimate-toolbar-actions.tsx` (entity: `estimates`)
2. ❌ `payments-toolbar-actions.tsx` (entity: `payments`)
3. ❌ `contract-toolbar-actions.tsx` (entity: `contracts`)
4. ❌ `equipment-toolbar-actions.tsx` (entity: `equipment`)
5. ❌ `materials-toolbar-actions.tsx` (entity: `materials`)
6. ❌ `maintenance-plan-toolbar-actions.tsx` (entity: `maintenance_plans`)
7. ❌ `service-agreement-toolbar-actions.tsx` (entity: `service_agreements`)
8. ❌ `purchase-order-toolbar-actions.tsx` (entity: `purchase_orders`)
9. ❌ `team-toolbar-actions.tsx` (entity: `team_members`)
10. ❌ `customers-toolbar-actions.tsx` (entity: `customers`)

---

### Page Components (10 remaining)

All pages need:
1. **Remove** `.is("archived_at", null)` from queries
2. **Add** `archived_at` and `deleted_at` to mapped data
3. **Filter** stats to only count active items

Example pattern:
```typescript
// ❌ OLD
const { data } = await supabase
  .from("table")
  .select("*")
  .is("archived_at", null);

// ✅ NEW
const { data } = await supabase
  .from("table")
  .select("*");

const items = data.map(item => ({
  ...item,
  archived_at: item.archived_at,
  deleted_at: item.deleted_at,
}));

// Stats only count active
const activeItems = items.filter(i => !i.archived_at && !i.deleted_at);
const stats = calculateStats(activeItems); // Use activeItems, not items
```

#### Page Files:
1. ❌ `work/estimates/page.tsx`
2. ❌ `work/payments/page.tsx`
3. ❌ `work/contracts/page.tsx`
4. ❌ `work/equipment/page.tsx`
5. ❌ `work/materials/page.tsx`
6. ❌ `work/maintenance-plans/page.tsx`
7. ❌ `work/service-agreements/page.tsx`
8. ❌ `work/purchase-orders/page.tsx`
9. ❌ `work/team/page.tsx`
10. ❌ `customers/page.tsx`

---

## Exact Pattern Reference

### For Datatable Files:

```typescript
// 1. ADD IMPORTS
import { useArchiveStore } from "@/lib/stores/archive-store";
import { useState } from "react";
// Add AlertDialog imports if not present

// 2. UPDATE TYPE
type Entity = {
  // ... existing fields
  archived_at?: string | null;
  deleted_at?: string | null;
};

// 3. IN COMPONENT FUNCTION
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
  return true;
});

// 4. UPDATE ALL COLUMNS
// Primary columns: hideable: false
// All others: sortable: true, hideable: true

// 5. UPDATE DROPDOWN MENU ARCHIVE ACTION
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

// 6. UPDATE BULK ACTIONS
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

// 7. UPDATE FULWIDTHDATATABLE
<FullWidthDataTable
  data={filteredItems}  // Use filtered, not original
  entity="entity-name"
  isArchived={(item) => !!((item as any).archived_at || (item as any).deleted_at)}
  showArchived={archiveFilter !== "active"}
  // ... other props (NO toolbarActions)
/>

// 8. ADD ARCHIVE DIALOGS (see appointments-table.tsx lines 384-447)
```

---

## Column Definitions Reference

### Estimates
- estimateNumber (hideable: false)
- customer (hideable: true)
- project (hideable: false)
- date, validUntil, amount, status (all hideable: true)

### Payments
- payment_number (hideable: false)
- customer, amount, payment_method, status, processed_at (all hideable: true)

### Contracts
- contractNumber (hideable: false)
- customer, title (hideable: false)
- contractType, signerName, date, validUntil, status (all hideable: true)

### Equipment
- equipment_number (hideable: false)
- name (hideable: false if no equipment_number)
- type, manufacturer, model, serial_number, location (all hideable: true)

### Materials
- sku or name (hideable: false)
- description, category, unit, quantity, cost (all hideable: true)

### Maintenance Plans
- plan_number (hideable: false)
- customer, frequency, status, next_service (all hideable: true)

### Service Agreements
- agreement_number (hideable: false)
- customer, title, start_date, end_date, status (all hideable: true)

### Purchase Orders
- po_number (hideable: false)
- vendor, date, total, status (all hideable: true)

### Team Members
- name or email (hideable: false)
- role, department, phone, status (all hideable: true)

### Customers
- display_name or first_name/last_name (hideable: false)
- email, phone, city, status (all hideable: true)

---

## Completion Tracking

### Progress Summary:
- **Datatables**: 3/10 complete (30%)
- **Toolbars**: 0/10 complete (0%)
- **Pages**: 0/10 complete (0%)
- **Overall**: 3/30 complete (10%)

### Priority Order:
1. ✅ estimates-table.tsx (COMPLETE)
2. 🔄 payments-table.tsx (IN PROGRESS - 50%)
3. ⏭️ contracts-table.tsx (NEXT)
4. ⏭️ equipment-table.tsx
5. ⏭️ materials-table.tsx
6. ⏭️ maintenance-plans-table.tsx
7. ⏭️ service-agreements-table.tsx
8. ⏭️ purchase-orders-table.tsx
9. ⏭️ teams-table.tsx
10. ⏭️ customers-table.tsx
11. Then all 10 toolbars
12. Then all 10 pages

---

## Notes
- Use `(item as any)` casts for archived_at checks until types are regenerated
- Mark primary/title columns as `hideable: false`
- ALL other columns should be `sortable: true, hideable: true`
- Remove ALL `.is("archived_at", null)` from database queries
- Add counts to all stats calculations (filter to activeItems first)
- Follow appointments-table.tsx EXACTLY - it's the reference implementation

---

## Next Actions
1. Complete payments-table.tsx (add filtering, dialogs)
2. Continue through remaining datatables in priority order
3. Batch update all toolbars (simple, repetitive pattern)
4. Batch update all pages (remove archived filters, add fields to data)
5. Test each section before moving to next
