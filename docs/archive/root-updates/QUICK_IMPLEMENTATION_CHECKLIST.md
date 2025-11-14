# Quick Implementation Checklist

**FOLLOW THIS ORDER EXACTLY**

---

## Step 1: Update Archive Store (CRITICAL - DO THIS FIRST!)

File: `/Users/byronwade/Thorbis/src/lib/stores/archive-store.ts`

Add these lines:

```typescript
// In ArchivableEntity type (around line 18-29):
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
  | "payments"           // ← ADD
  | "materials"          // ← ADD
  | "properties";        // ← ADD

// In defaultFilters object (around line 44-56):
const defaultFilters: Record<ArchivableEntity, ArchiveFilter> = {
  team_members: "active",
  customers: "active",
  jobs: "active",
  equipment: "active",
  invoices: "active",
  estimates: "active",
  contracts: "active",
  purchase_orders: "active",
  service_agreements: "active",
  maintenance_plans: "active",
  appointments: "active",
  payments: "active",           // ← ADD
  materials: "active",          // ← ADD
  properties: "active",         // ← ADD
};
```

---

## Step 2: Update Each Table Component

### For Each File (11 files remaining):
1. estimates-table.tsx
2. payments-table.tsx
3. contracts-table.tsx
4. equipment-table.tsx
5. materials-table.tsx
6. maintenance-plans-table.tsx
7. service-agreements-table.tsx
8. purchase-orders-table.tsx
9. teams-table.tsx
10. customers-table.tsx
11. properties-table.tsx

### Apply These 4 Changes:

**Change 1: Add Import**
```typescript
import { useArchiveStore } from "@/lib/stores/archive-store";
```

**Change 2: Add to Type** (if not present)
```typescript
type EntityType = {
  // ... existing fields
  archived_at?: string | null;
  deleted_at?: string | null;
};
```

**Change 3: Add at Start of Component**
```typescript
export function EntityTable({ items, ...props }: Props) {
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

**Change 4: Update FullWidthDataTable**
```typescript
<FullWidthDataTable
  // ... existing props ...
  data={filteredItems}           // CHANGE from 'items'
  entity="entity-name"            // ADD
  isArchived={(item) => !!(item.archived_at || item.deleted_at)}  // ADD
  showArchived={archiveFilter !== "active"}                        // ADD
/>
```

### Entity Names to Use:
- estimates → `"estimates"`
- payments → `"payments"`
- contracts → `"contracts"`
- equipment → `"equipment"`
- materials → `"materials"`
- maintenance_plans → `"maintenance_plans"`
- service_agreements → `"service_agreements"`
- purchase_orders → `"purchase_orders"`
- teams → `"team_members"`
- customers → `"customers"`
- properties → `"properties"`

---

## Step 3: Update Toolbar Components (11 files)

For each toolbar component, add this to `beforePrimaryAction`:

```typescript
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

const ENTITY_COLUMNS = [
  { key: "column1", label: "Column 1" },
  // ... list all hideable columns
];

export function EntityToolbarActions({ ... }) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <ArchiveFilterSelect
            entity="entity-name"
            activeCount={0}
            archivedCount={0}
            totalCount={0}
          />
          <ColumnVisibilityMenu
            entity="entity-name"
            columns={ENTITY_COLUMNS}
          />
        </div>
      }
      // ... rest
    />
  );
}
```

---

## Step 4: Update Page Components (11+ files)

For each page.tsx:

**Change 1: Remove Archive Filters**
```typescript
// REMOVE THESE LINES:
.is("archived_at", null)
.is("deleted_at", null)
```

**Change 2: Add Archived Fields**
```typescript
const items = (rawData || []).map((item) => ({
  ...item,
  archived_at: item.archived_at,    // ADD
  deleted_at: item.deleted_at,      // ADD
}));
```

**Change 3: Calculate Stats from Active Only**
```typescript
const activeItems = items.filter(item => !item.archived_at && !item.deleted_at);
const archivedItems = items.filter(item => item.archived_at || item.deleted_at);

// Use activeItems for stats
const stats = {
  total: activeItems.length,
  revenue: activeItems.reduce((sum, i) => sum + i.amount, 0),
};
```

---

## Quick Test After Each Update

1. Open the page in browser
2. Check archive filter dropdown appears
3. Check column visibility menu appears
4. Test switching between Active/Archived/All
5. Test hiding/showing columns
6. Verify no TypeScript errors

---

## Files Summary

### ✅ Completed (3)
- jobs-table.tsx
- invoices-table.tsx
- appointments-table.tsx

### 🔨 To Update (33)

#### Tables (11)
- [ ] estimates-table.tsx
- [ ] payments-table.tsx
- [ ] contracts-table.tsx
- [ ] equipment-table.tsx
- [ ] materials-table.tsx
- [ ] maintenance-plans-table.tsx
- [ ] service-agreements-table.tsx
- [ ] purchase-orders-table.tsx
- [ ] teams-table.tsx
- [ ] customers-table.tsx
- [ ] properties-table.tsx

#### Toolbars (11)
- [ ] estimate-toolbar-actions.tsx
- [ ] invoice-toolbar-actions.tsx (may need update)
- [ ] contract-toolbar-actions.tsx
- [ ] equipment-toolbar-actions.tsx
- [ ] payments-toolbar-actions.tsx
- [ ] service-agreement-toolbar-actions.tsx
- [ ] maintenance-plan-toolbar-actions.tsx
- [ ] purchase-order-toolbar-actions.tsx
- [ ] team-toolbar-actions.tsx
- [ ] customers-toolbar-actions.tsx
- [ ] materials-toolbar-actions.tsx (inventory folder)

#### Pages (11)
- [ ] work/estimates/page.tsx
- [ ] work/invoices/page.tsx
- [ ] work/payments/page.tsx
- [ ] work/contracts/page.tsx
- [ ] work/equipment/page.tsx
- [ ] work/materials/page.tsx
- [ ] work/maintenance-plans/page.tsx
- [ ] work/service-agreements/page.tsx
- [ ] work/purchase-orders/page.tsx
- [ ] work/team/page.tsx
- [ ] customers/page.tsx

---

## Estimated Time

- Archive Store: 5 minutes
- Each Table: 10 minutes × 11 = 110 minutes
- Each Toolbar: 15 minutes × 11 = 165 minutes
- Each Page: 10 minutes × 11 = 110 minutes

**Total: ~6-7 hours**

Split into:
- Session 1 (2h): Archive store + all tables
- Session 2 (3h): All toolbars
- Session 3 (2h): All pages + testing

---

## Common Mistakes to Avoid

❌ Forgetting to update archive store first
❌ Using wrong entity name (typo in string)
❌ Not updating type with archived_at/deleted_at
❌ Forgetting to change `data={items}` to `data={filteredItems}`
❌ Missing the `isArchived` prop
❌ Missing the `showArchived` prop
❌ Forgetting to remove archive filters from page queries
❌ Not filtering to activeItems when calculating stats

---

## Final Verification

Run these checks:

```bash
# Check all tables have useArchiveStore
grep -l "useArchiveStore" src/components/work/*-table.tsx src/components/customers/*-table.tsx

# Check all tables have entity prop
grep -l 'entity="' src/components/work/*-table.tsx src/components/customers/*-table.tsx

# Check all toolbars have ArchiveFilterSelect
grep -l "ArchiveFilterSelect" src/components/work/*-toolbar-actions.tsx src/components/customers/*-toolbar-actions.tsx

# Check no TypeScript errors
pnpm type-check
```

---

## Success Indicators

✅ All archive filters work across all entities
✅ Column visibility works across all entities
✅ No TypeScript errors
✅ Stats only count active items
✅ Users can seamlessly switch between active/archived/all views
✅ Archived items show with red background
✅ All changes follow the exact same pattern (consistency)
