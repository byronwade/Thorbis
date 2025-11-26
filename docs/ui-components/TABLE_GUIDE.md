# Table Implementation Guide

**Comprehensive guide for creating and maintaining tables in Stratos.**

Last Updated: 2025-11-18

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Design System Variants](#design-system-variants)
3. [Table Presets](#table-presets)
4. [Common Column Patterns](#common-column-patterns)
5. [Complete Examples](#complete-examples)
6. [Migration Guide](#migration-guide)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Step 1: Choose Your Variant

| Variant | Use Case | Items/Page | Features |
|---------|----------|------------|----------|
| **full** | Main list pages | 50 | All features enabled |
| **compact** | Detail views | 20 | Streamlined |
| **nested** | Deep nesting | 10 | Minimal |

### Step 2: Use a Preset

```typescript
import { FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";

<FullWidthDataTable
  {...TablePresets.fullList({ entity: "customers" })}
  data={customers}
  columns={columns}
  getItemId={(c) => c.id}
/>
```

### Step 3: Define Columns

Use shared column hooks for consistency:

```typescript
import { useDateColumn, useActionsColumn, useLinkColumn } from "@/lib/datatable/common-columns";

const columns = [
  useLinkColumn("name", "Name", (c) => c.name, (c) => `/customers/${c.id}`),
  useDateColumn("created_at", "Created", (c) => c.created_at),
  useActionsColumn((c) => `/customers/${c.id}`)
];
```

---

## Design System Variants

### Full Variant (Main Lists)

**Use for:** Primary list pages (Customers, Jobs, Invoices, Appointments, etc.)

**Features:**
- 50 items per page
- Full search and filtering
- Pagination controls
- Bulk actions
- Row selection
- Standard spacing (px-4 py-2)

**Visual:**
- Header: bg-muted, text-xs, px-4 py-2
- Rows: bg-card / bg-card/70 (alternating), px-3 py-1.5
- Hover: hover:bg-muted/25
- Borders: border-border/30

```typescript
<FullWidthDataTable
  variant="full"
  data={customers}
  columns={columns}
  getItemId={(c) => c.id}
  entity="customers"
  enableSelection={true}
  bulkActions={bulkActions}
/>
```

### Compact Variant (Detail Views)

**Use for:** Nested tables in detail pages (Job payments, Customer invoices, Property equipment)

**Features:**
- 20 items per page
- Streamlined features
- Reduced spacing (px-3 py-1.5)
- Optional selection

**Visual:**
- Header: bg-muted/80, text-[11px], px-3 py-1.5
- Rows: bg-background / bg-muted/20 (alternating), px-2 py-1
- Hover: hover:bg-muted/30
- Borders: border-border/20

```typescript
<FullWidthDataTable
  variant="compact"
  data={jobPayments}
  columns={columns}
  getItemId={(p) => p.id}
/>
```

### Nested Variant (Deep Nesting)

**Use for:** Deeply nested tables (Invoice line items, Task subtasks)

**Features:**
- 10 items per page
- Minimal features
- Tight spacing (px-2 py-1)
- No pagination by default
- No search by default

**Visual:**
- Header: bg-muted/60, text-[10px], px-2 py-1
- Rows: bg-background / bg-muted/10 (alternating), px-1.5 py-0.5
- Hover: hover:bg-muted/20
- Borders: border-border/10

```typescript
<FullWidthDataTable
  variant="nested"
  data={invoiceLineItems}
  columns={columns}
  getItemId={(i) => i.id}
  showPagination={false}
  noPadding={true}
/>
```

---

## Table Presets

Pre-configured setups for common scenarios.

### TablePresets.fullList()

Full-featured main list table.

```typescript
import { TablePresets } from "@/lib/datatable/table-presets";

<FullWidthDataTable
  {...TablePresets.fullList({
    entity: "customers",
    enableSelection: true,
    searchPlaceholder: "Search customers..."
  })}
  data={customers}
  columns={columns}
  getItemId={(c) => c.id}
  bulkActions={bulkActions}
  onRowClick={handleRowClick}
/>
```

**Options:**
- `entity?: string` - For column visibility persistence
- `enableSelection?: boolean` - Default: true
- `showRefresh?: boolean` - Default: false
- `searchPlaceholder?: string` - Default: "Search..."
- `itemsPerPage?: number` - Default: 50

### TablePresets.compact()

Streamlined detail view table.

```typescript
<FullWidthDataTable
  {...TablePresets.compact()}
  data={jobPayments}
  columns={columns}
  getItemId={(p) => p.id}
/>
```

**Options:**
- Same as fullList, but defaults to 20 items/page and no selection

### TablePresets.nested()

Minimal nested table.

```typescript
<FullWidthDataTable
  {...TablePresets.nested()}
  data={invoiceLineItems}
  columns={columns}
  getItemId={(i) => i.id}
/>
```

**Options:**
- Same as fullList, but defaults to 10 items/page, no pagination, no search

### TablePresets.serverPaginated()

Server-side pagination and search.

```typescript
<FullWidthDataTable
  {...TablePresets.serverPaginated({ entity: "jobs" })}
  data={jobs}
  columns={columns}
  getItemId={(j) => j.id}
  totalCount={totalCount}
  currentPageFromServer={currentPage}
  initialSearchQuery={searchQuery}
/>
```

### TablePresets.readOnly()

Simple read-only display.

```typescript
<FullWidthDataTable
  {...TablePresets.readOnly()}
  data={reportData}
  columns={columns}
  getItemId={(d) => d.id}
/>
```

### TablePresets.modal()

For tables in modals/dialogs.

```typescript
<FullWidthDataTable
  {...TablePresets.modal({ enableSelection: true })}
  data={selectableItems}
  columns={columns}
  getItemId={(i) => i.id}
/>
```

---

## Common Column Patterns

Use shared column hooks to reduce duplication and ensure consistency.

### Date Columns

```typescript
import { useDateColumn } from "@/lib/datatable/common-columns";

// Simple date
useDateColumn("created_at", "Created", (item) => item.created_at)

// With time
useDateColumn("scheduled_at", "Scheduled", (item) => item.scheduled_at, {
  includeTime: true,
  width: "w-40"
})
```

### Currency Columns

```typescript
import { useCurrencyColumn } from "@/lib/datatable/common-columns";

useCurrencyColumn("total", "Total", (item) => item.total, {
  align: "right",
  width: "w-28"
})
```

### Status Columns

```typescript
import { useJobStatusColumn, useCustomerStatusColumn, usePriorityColumn } from "@/lib/datatable/common-columns";

// Job status
useJobStatusColumn("status", "Status", (job) => job.status)

// Customer status
useCustomerStatusColumn("status", "Status", (customer) => customer.status)

// Priority
usePriorityColumn("priority", "Priority", (job) => job.priority)
```

### Link Columns

```typescript
import { useLinkColumn } from "@/lib/datatable/common-columns";

useLinkColumn(
  "name",
  "Customer",
  (customer) => customer.name,
  (customer) => `/customers/${customer.id}`
)
```

### Actions Columns

```typescript
import { useActionsColumn } from "@/lib/datatable/common-columns";

useActionsColumn(
  (item) => `/customers/${item.id}`, // View link
  (item) => `/customers/${item.id}/edit`, // Edit link (optional)
  handleArchive, // Archive handler (optional)
  handleDelete // Delete handler (optional)
)
```

### Text Columns

```typescript
import { useTextColumn } from "@/lib/datatable/common-columns";

useTextColumn("email", "Email", (customer) => customer.email, {
  truncate: true,
  fontWeight: "medium"
})
```

### Number Columns

```typescript
import { useNumberColumn } from "@/lib/datatable/common-columns";

useNumberColumn("invoice_number", "#", (invoice) => invoice.invoice_number, {
  prefix: "#",
  format: "integer"
})
```

---

## Complete Examples

### Example 1: Full List Table (Customers)

```typescript
// /src/components/customers/customers-table.tsx
"use client";

import { FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";
import {
  useLinkColumn,
  useCustomerStatusColumn,
  useDateColumn,
  useActionsColumn
} from "@/lib/datatable/common-columns";
import type { Customer } from "@/types";
import { archiveCustomer } from "@/actions/customers";

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const columns = [
    useLinkColumn(
      "name",
      "Name",
      (c) => c.name,
      (c) => `/customers/${c.id}`
    ),
    useCustomerStatusColumn("status", "Status", (c) => c.status),
    useDateColumn("created_at", "Created", (c) => c.created_at),
    useActionsColumn(
      (c) => `/customers/${c.id}`,
      (c) => `/customers/${c.id}/edit`,
      (c) => archiveCustomer(c.id)
    )
  ];

  const bulkActions = [
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      onClick: (ids) => console.log("Archive", ids)
    }
  ];

  return (
    <FullWidthDataTable
      {...TablePresets.fullList({
        entity: "customers",
        searchPlaceholder: "Search customers..."
      })}
      data={customers}
      columns={columns}
      getItemId={(c) => c.id}
      bulkActions={bulkActions}
      searchFilter={(c, query) => c.name.toLowerCase().includes(query)}
    />
  );
}
```

### Example 2: Compact Detail Table (Job Payments)

```typescript
// /src/components/work/job-details/job-payments-table.tsx
"use client";

import { FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";
import { useDateColumn, useCurrencyColumn } from "@/lib/datatable/common-columns";
import type { Payment } from "@/types";

export function JobPaymentsTable({ payments }: { payments: Payment[] }) {
  const columns = [
    useDateColumn("payment_date", "Date", (p) => p.payment_date),
    useCurrencyColumn("amount", "Amount", (p) => p.amount),
    { key: "method", header: "Method", render: (p) => p.payment_method }
  ];

  return (
    <FullWidthDataTable
      {...TablePresets.compact()}
      data={payments}
      columns={columns}
      getItemId={(p) => p.id}
    />
  );
}
```

### Example 3: Server-Paginated Table (Jobs)

```typescript
// /src/components/work/jobs-table.tsx
"use client";

import { FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";
import {
  useLinkColumn,
  useJobStatusColumn,
  useDateColumn,
  useActionsColumn
} from "@/lib/datatable/common-columns";

export function JobsTable({
  jobs,
  totalCount,
  currentPage,
  searchQuery
}: {
  jobs: Job[];
  totalCount: number;
  currentPage: number;
  searchQuery: string;
}) {
  const columns = [
    useLinkColumn("title", "Job", (j) => j.title, (j) => `/jobs/${j.id}`),
    useJobStatusColumn("status", "Status", (j) => j.status),
    useDateColumn("scheduled_date", "Scheduled", (j) => j.scheduled_date),
    useActionsColumn((j) => `/jobs/${j.id}`)
  ];

  return (
    <FullWidthDataTable
      {...TablePresets.serverPaginated({ entity: "jobs" })}
      data={jobs}
      columns={columns}
      getItemId={(j) => j.id}
      totalCount={totalCount}
      currentPageFromServer={currentPage}
      initialSearchQuery={searchQuery}
    />
  );
}
```

---

## Migration Guide

### Migrating Existing Tables

**Step 1: Import presets and columns**

```typescript
import { TablePresets } from "@/lib/datatable/table-presets";
import { useDateColumn, useActionsColumn } from "@/lib/datatable/common-columns";
```

**Step 2: Replace manual config with preset**

Before:
```typescript
<FullWidthDataTable
  enableSelection={true}
  showPagination={true}
  itemsPerPage={50}
  serverPagination={false}
  searchPlaceholder="Search..."
  entity="customers"
  data={customers}
  columns={columns}
  getItemId={(c) => c.id}
/>
```

After:
```typescript
<FullWidthDataTable
  {...TablePresets.fullList({ entity: "customers" })}
  data={customers}
  columns={columns}
  getItemId={(c) => c.id}
/>
```

**Step 3: Replace manual columns with hooks**

Before:
```typescript
const columns = [
  {
    key: "created_at",
    header: "Created",
    width: "w-32",
    render: (c) => formatDate(c.created_at)
  }
];
```

After:
```typescript
const columns = [
  useDateColumn("created_at", "Created", (c) => c.created_at)
];
```

---

## Best Practices

### 1. Always Use Variants

Choose the appropriate variant for your use case:

```typescript
// ✅ CORRECT - Main list
<FullWidthDataTable variant="full" {...} />

// ✅ CORRECT - Detail view
<FullWidthDataTable variant="compact" {...} />

// ❌ WRONG - Missing variant (defaults to full)
<FullWidthDataTable {...} />
```

### 2. Use Presets When Possible

```typescript
// ✅ CORRECT - Using preset
{...TablePresets.fullList({ entity: "customers" })}

// ❌ WRONG - Manual configuration
enableSelection={true}
showPagination={true}
itemsPerPage={50}
```

### 3. Use Column Hooks for Common Patterns

```typescript
// ✅ CORRECT - Using hooks
useDateColumn("created_at", "Created", (c) => c.created_at)

// ❌ WRONG - Manual render
{
  key: "created_at",
  header: "Created",
  render: (c) => formatDate(c.created_at)
}
```

### 4. Keep Columns Consistent

Use the same column width and order across similar tables.

### 5. Enable Column Visibility for Main Lists

```typescript
// ✅ CORRECT - Entity specified
entity="customers"

// ❌ WRONG - No entity (no column persistence)
// (missing entity prop)
```

### 6. Use Server Pagination for Large Datasets

For 1,000+ records, use server pagination:

```typescript
{...TablePresets.serverPaginated({ entity: "jobs" })}
totalCount={totalCount}
currentPageFromServer={currentPage}
```

### 7. Add Search Filtering

```typescript
searchFilter={(customer, query) =>
  customer.name.toLowerCase().includes(query) ||
  customer.email.toLowerCase().includes(query)
}
```

---

## Troubleshooting

### Table Not Rendering

**Problem:** Table shows empty state despite having data.

**Solution:** Check `getItemId` returns unique string IDs:

```typescript
// ✅ CORRECT
getItemId={(c) => c.id}

// ❌ WRONG
getItemId={(c) => c} // Returns object, not string
```

### Pagination Not Working

**Problem:** Pagination controls don't appear or don't work.

**Solution:** Ensure `showPagination={true}` and data length > `itemsPerPage`:

```typescript
showPagination={true}
itemsPerPage={50}
```

### Columns Not Sortable

**Problem:** Clicking column headers doesn't sort.

**Solution:** Add `sortable: true` to column definition:

```typescript
useDateColumn("created_at", "Created", (c) => c.created_at, { sortable: true })
```

### Search Not Working

**Problem:** Search input appears but doesn't filter data.

**Solution:** Provide `searchFilter` function:

```typescript
searchFilter={(customer, query) =>
  customer.name.toLowerCase().includes(query)
}
```

### Column Visibility Not Persisting

**Problem:** Column visibility resets on page refresh.

**Solution:** Add `entity` prop:

```typescript
entity="customers"
```

### Compact Variant Too Small

**Problem:** Text is too small in compact tables.

**Solution:** Use `full` variant or override `itemsPerPage`:

```typescript
{...TablePresets.compact({ itemsPerPage: 50 })}
```

### Bulk Actions Not Appearing

**Problem:** Bulk action buttons don't show when rows selected.

**Solution:** Ensure `bulkActions` array is provided:

```typescript
bulkActions={[
  {
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    onClick: (ids) => console.log(ids)
  }
]}
```

---

## Reference

### All Available Column Hooks

| Hook | Use Case | Example |
|------|----------|---------|
| `useDateColumn` | Date fields | Created, Updated, Scheduled |
| `useCurrencyColumn` | Money values | Total, Subtotal, Tax |
| `useJobStatusColumn` | Job status | Status |
| `useCustomerStatusColumn` | Customer status | Status |
| `usePriorityColumn` | Priority | Priority |
| `useActionsColumn` | Row actions | View, Edit, Archive |
| `useLinkColumn` | Links | Name, Title |
| `useTextColumn` | Text | Email, Phone, Address |
| `useNumberColumn` | Numbers | Invoice #, Quantity |

### All Table Presets

| Preset | Variant | Items/Page | Use Case |
|--------|---------|------------|----------|
| `fullList` | full | 50 | Main lists |
| `compact` | compact | 20 | Detail views |
| `nested` | nested | 10 | Deep nesting |
| `serverPaginated` | full | 50 | Server pagination |
| `readOnly` | compact | 20 | Display only |
| `modal` | compact | 10 | Modals/dialogs |

---

**Questions?** Check existing table implementations in `/src/components/` for examples.

**Last Updated:** 2025-11-18 | **Version:** 3.0
