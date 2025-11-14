# Datatable Archive Pattern Implementation Guide

**Status**: IN PROGRESS
**Date**: 2025-11-12
**Objective**: Apply comprehensive archive filtering pattern to ALL datatable components across the application

---

## ✅ Completed Updates

### Table Components Updated
1. **jobs-table.tsx** ✅
   - Added `useArchiveStore` import
   - Added archive filter state
   - Added `filteredJobs` with archive filtering logic
   - Updated `FullWidthDataTable` props: `data={filteredJobs}`, `entity="jobs"`, `isArchived`, `showArchived`

2. **invoices-table.tsx** ✅
   - Added `useArchiveStore` import
   - Added `archived_at` and `deleted_at` to Invoice type
   - Added archive filter state
   - Added `filteredInvoices` with archive filtering logic
   - Updated `FullWidthDataTable` props: `data={filteredInvoices}`, `entity="invoices"`, `isArchived`, `showArchived`

3. **appointments-table.tsx** ✅ (Reference implementation)
   - Already fully implemented with archive pattern
   - Includes archive dialogs
   - Includes bulk archive functionality

---

## 📋 Remaining Table Components to Update

### Work Tables (9 files)
1. `/Users/byronwade/Thorbis/src/components/work/estimates-table.tsx`
2. `/Users/byronwade/Thorbis/src/components/work/payments-table.tsx`
3. `/Users/byronwade/Thorbis/src/components/work/contracts-table.tsx`
4. `/Users/byronwade/Thorbis/src/components/work/equipment-table.tsx`
5. `/Users/byronwade/Thorbis/src/components/work/materials-table.tsx`
6. `/Users/byronwade/Thorbis/src/components/work/maintenance-plans-table.tsx`
7. `/Users/byronwade/Thorbis/src/components/work/service-agreements-table.tsx`
8. `/Users/byronwade/Thorbis/src/components/work/purchase-orders-table.tsx`
9. `/Users/byronwade/Thorbis/src/components/work/teams-table.tsx`

### Customer Tables (2 files)
10. `/Users/byronwade/Thorbis/src/components/customers/customers-table.tsx`
11. `/Users/byronwade/Thorbis/src/components/customers/properties-table.tsx`

### Additional Consideration
- `/Users/byronwade/Thorbis/src/components/work/price-book-table.tsx` - May need archive pattern

---

## 🔧 Implementation Pattern for Each Table

### Step 1: Add Import
```typescript
import { useArchiveStore } from "@/lib/stores/archive-store";
```

### Step 2: Add Archive Fields to Type (if missing)
```typescript
type EntityType = {
  // ... existing fields
  archived_at?: string | null;
  deleted_at?: string | null;
};
```

### Step 3: Add Archive Filter State at Component Start
```typescript
export function EntityTable({ items, ... }: Props) {
  // Archive filter state
  const archiveFilter = useArchiveStore((state) => state.filters.ENTITY_NAME);

  // ... existing state ...

  // Filter based on archive status
  const filteredItems = items.filter((item) => {
    const isArchived = !!(item.archived_at || item.deleted_at);
    if (archiveFilter === "active") return !isArchived;
    if (archiveFilter === "archived") return isArchived;
    return true; // "all"
  });
```

### Step 4: Update FullWidthDataTable Props
```typescript
<FullWidthDataTable
  // ... existing props ...
  data={filteredItems}           // Changed from 'items'
  entity="entity-name"            // Added
  isArchived={(item) => !!(item.archived_at || item.deleted_at)}  // Added
  showArchived={archiveFilter !== "active"}                        // Added
/>
```

---

## 📊 Entity Name Mapping

Use these exact entity names for the `entity` prop and archive store filters:

| Component | Entity Name | Store Key |
|-----------|-------------|-----------|
| jobs-table.tsx | `"jobs"` | `filters.jobs` |
| invoices-table.tsx | `"invoices"` | `filters.invoices` |
| estimates-table.tsx | `"estimates"` | `filters.estimates` |
| payments-table.tsx | `"payments"` | `filters.payments` ⚠️ |
| contracts-table.tsx | `"contracts"` | `filters.contracts` |
| equipment-table.tsx | `"equipment"` | `filters.equipment` |
| materials-table.tsx | `"materials"` | `filters.materials` ⚠️ |
| maintenance-plans-table.tsx | `"maintenance_plans"` | `filters.maintenance_plans` |
| service-agreements-table.tsx | `"service_agreements"` | `filters.service_agreements` |
| purchase-orders-table.tsx | `"purchase_orders"` | `filters.purchase_orders` |
| teams-table.tsx | `"team_members"` | `filters.team_members` |
| customers-table.tsx | `"customers"` | `filters.customers` |
| properties-table.tsx | `"properties"` | `filters.properties` ⚠️ |

⚠️ **WARNING**: These entities are NOT in archive-store.ts yet and need to be added!

---

## 🛠️ Archive Store Updates Needed

The following entities need to be added to `/Users/byronwade/Thorbis/src/lib/stores/archive-store.ts`:

### Update ArchivableEntity Type
```typescript
export type ArchivableEntity =
  | "team_members"
  | "customers"
  | "jobs"
  | "equipment"
  | "invoices"
  | "estimates"
  | "contracts"
  | "purchase_orders"
  | "service_agreements"
  | "maintenance_plans"
  | "appointments"
  | "payments"           // ADD THIS
  | "materials"          // ADD THIS
  | "properties"         // ADD THIS
  | "pricebook_items";   // ADD THIS (if needed)
```

### Update defaultFilters Object
```typescript
const defaultFilters: Record<ArchivableEntity, ArchiveFilter> = {
  // ... existing filters ...
  payments: "active",           // ADD THIS
  materials: "active",          // ADD THIS
  properties: "active",         // ADD THIS
  pricebook_items: "active",    // ADD THIS (if needed)
};
```

---

## 🎨 Toolbar Actions Pattern

### Files to Update (11 files)
1. `/Users/byronwade/Thorbis/src/components/work/estimate-toolbar-actions.tsx`
2. `/Users/byronwade/Thorbis/src/components/work/invoice-toolbar-actions.tsx`
3. `/Users/byronwade/Thorbis/src/components/work/contract-toolbar-actions.tsx`
4. `/Users/byronwade/Thorbis/src/components/work/equipment-toolbar-actions.tsx`
5. `/Users/byronwade/Thorbis/src/components/work/payments-toolbar-actions.tsx`
6. `/Users/byronwade/Thorbis/src/components/work/service-agreement-toolbar-actions.tsx`
7. `/Users/byronwade/Thorbis/src/components/work/maintenance-plan-toolbar-actions.tsx`
8. `/Users/byronwade/Thorbis/src/components/work/purchase-order-toolbar-actions.tsx`
9. `/Users/byronwade/Thorbis/src/components/work/team-toolbar-actions.tsx`
10. `/Users/byronwade/Thorbis/src/components/customers/customers-toolbar-actions.tsx`
11. `/Users/byronwade/Thorbis/src/components/inventory/materials-toolbar-actions.tsx` (if exists)

### Pattern for Each Toolbar
```typescript
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

// Define columns that can be hidden
const ENTITY_COLUMNS = [
  { key: "column1", label: "Column 1 Label" },
  { key: "column2", label: "Column 2 Label" },
  // ... all hideable columns from table
];

export function EntityToolbarActions({
  activeCount = 0,
  archivedCount = 0,
  totalCount = 0,
  // ... other props
}) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect
            entity="entity-name"
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            entity="entity-name"
            columns={ENTITY_COLUMNS}
          />
        </div>
      }
      // ... rest of props
    />
  );
}
```

### Column Definitions by Entity

#### Estimates
```typescript
const ESTIMATE_COLUMNS = [
  { key: "estimateNumber", label: "Estimate #" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "validUntil", label: "Valid Until" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];
```

#### Payments
```typescript
const PAYMENT_COLUMNS = [
  { key: "paymentNumber", label: "Payment #" },
  { key: "customer", label: "Customer" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
];
```

#### Contracts
```typescript
const CONTRACT_COLUMNS = [
  { key: "contractNumber", label: "Contract #" },
  { key: "title", label: "Title" },
  { key: "customer", label: "Customer" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
];
```

#### Equipment
```typescript
const EQUIPMENT_COLUMNS = [
  { key: "equipmentNumber", label: "Equipment #" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "model", label: "Model" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
];
```

#### Materials
```typescript
const MATERIAL_COLUMNS = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
  { key: "cost", label: "Cost" },
];
```

#### Maintenance Plans
```typescript
const MAINTENANCE_PLAN_COLUMNS = [
  { key: "planNumber", label: "Plan #" },
  { key: "title", label: "Title" },
  { key: "customer", label: "Customer" },
  { key: "frequency", label: "Frequency" },
  { key: "nextService", label: "Next Service" },
  { key: "status", label: "Status" },
];
```

#### Service Agreements
```typescript
const SERVICE_AGREEMENT_COLUMNS = [
  { key: "agreementNumber", label: "Agreement #" },
  { key: "title", label: "Title" },
  { key: "customer", label: "Customer" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
];
```

#### Purchase Orders
```typescript
const PURCHASE_ORDER_COLUMNS = [
  { key: "poNumber", label: "PO #" },
  { key: "vendor", label: "Vendor" },
  { key: "date", label: "Date" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
];
```

#### Teams
```typescript
const TEAM_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
];
```

#### Customers
```typescript
const CUSTOMER_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "customerType", label: "Type" },
  { key: "status", label: "Status" },
];
```

---

## 📄 Page Updates Needed

### Pattern for Pages

Each page.tsx file needs:

1. **Remove archive filters from query**
```typescript
// ❌ REMOVE THESE:
.is("archived_at", null)
.is("deleted_at", null)

// ✅ Fetch ALL data including archived
```

2. **Add archived_at and deleted_at to mapped data**
```typescript
const items = rawData.map(item => ({
  ...item,
  archived_at: item.archived_at,  // Add this
  deleted_at: item.deleted_at,    // Add this
}));
```

3. **Update stats to only count active items**
```typescript
const activeItems = items.filter(item => !item.archived_at && !item.deleted_at);
// Use activeItems for stats calculations (totalRevenue, avgTicket, etc.)
```

### Pages to Update (10+ files)
1. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/invoices/page.tsx`
2. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/estimates/page.tsx`
3. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/payments/page.tsx`
4. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/contracts/page.tsx`
5. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/equipment/page.tsx`
6. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/materials/page.tsx`
7. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/maintenance-plans/page.tsx`
8. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/service-agreements/page.tsx`
9. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/purchase-orders/page.tsx`
10. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/work/team/page.tsx`
11. `/Users/byronwade/Thorbis/src/app/(dashboard)/dashboard/customers/page.tsx`

---

## ✅ Verification Checklist

After implementation, verify each entity:

### For Each Table Component
- [ ] `useArchiveStore` import added
- [ ] Archive filter state declared
- [ ] `filteredItems` variable created with filtering logic
- [ ] Type includes `archived_at?` and `deleted_at?` fields
- [ ] `FullWidthDataTable` uses `filteredItems` for data
- [ ] `FullWidthDataTable` has `entity="..."` prop
- [ ] `FullWidthDataTable` has `isArchived` prop
- [ ] `FullWidthDataTable` has `showArchived` prop
- [ ] Archive dialogs present (single and bulk)

### For Each Toolbar Component
- [ ] `ArchiveFilterSelect` component imported
- [ ] `ColumnVisibilityMenu` component imported
- [ ] Column definitions array created
- [ ] `beforePrimaryAction` includes both filters
- [ ] Props include `activeCount`, `archivedCount`, `totalCount`

### For Each Page
- [ ] Archive filters removed from Supabase query
- [ ] `archived_at` and `deleted_at` included in mapped data
- [ ] Stats calculations use filtered active items only
- [ ] Toolbar passes correct count props

### For Archive Store
- [ ] New entities added to `ArchivableEntity` type
- [ ] New entities added to `defaultFilters` object

---

## 🚀 Implementation Order

### Phase 1: Core Infrastructure ✅ (DONE)
- [x] jobs-table.tsx
- [x] invoices-table.tsx
- [x] appointments-table.tsx (reference)

### Phase 2: Archive Store Updates (DO THIS FIRST)
- [ ] Update `/Users/byronwade/Thorbis/src/lib/stores/archive-store.ts`
  - Add `payments`, `materials`, `properties` to types
  - Add default filters for new entities

### Phase 3: Remaining Work Tables
- [ ] estimates-table.tsx
- [ ] payments-table.tsx
- [ ] contracts-table.tsx
- [ ] equipment-table.tsx
- [ ] materials-table.tsx
- [ ] maintenance-plans-table.tsx
- [ ] service-agreements-table.tsx
- [ ] purchase-orders-table.tsx
- [ ] teams-table.tsx

### Phase 4: Customer Tables
- [ ] customers-table.tsx
- [ ] properties-table.tsx

### Phase 5: Toolbar Components (11 files)
- [ ] Update all toolbar-actions components with archive filters

### Phase 6: Page Components (11+ files)
- [ ] Remove archive filters from queries
- [ ] Add archived fields to mapped data
- [ ] Update stats to use active items only

---

## 📝 Notes

- **Consistency**: ALL tables must follow the exact same pattern for maintainability
- **Testing**: Test each entity's archive filter thoroughly
- **Performance**: Filtering happens client-side, no additional queries needed
- **User Experience**: Users can toggle between active, archived, and all items seamlessly
- **Column Visibility**: Users can hide/show columns per entity, persisted to localStorage

---

## 🎯 Success Criteria

✅ Implementation Complete When:
1. All 13 table components have archive filtering
2. All 11 toolbar components have archive and column visibility controls
3. All 11+ page components fetch and handle archived data correctly
4. Archive store includes all entity types
5. No TypeScript errors
6. Archive filtering works for all entities
7. Column visibility works for all entities
8. All functionality tested in browser

---

**Total Files to Modify**: ~35 files
- 11 table components remaining
- 1 archive store file
- 11 toolbar components
- 11+ page components

**Estimated Time**: 2-4 hours for complete implementation

**Priority**: HIGH - Critical for data management and user experience consistency
