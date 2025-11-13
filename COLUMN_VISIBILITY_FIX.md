# Column Visibility Fix - Required for All Tables

## ✅ Issue Identified

The column visibility checkboxes were not working because the **table columns** didn't have `hideable: true` set on them.

## 🔍 Root Cause

The `FullWidthDataTable` filters columns based on this logic:

```typescript
const visibleColumns = useMemo(() => {
  if (!entity) return orderedColumns;
  return orderedColumns.filter(
    (col) => !col.hideable || isColumnVisible(entity, col.key)
  );
}, [orderedColumns, entity, isColumnVisible]);
```

**Translation:** Show column if `!col.hideable` OR `isColumnVisible` returns true.

**Problem:** If `hideable` is not set (undefined), then `!col.hideable` is `true`, so the column **always shows** regardless of the visibility store state.

## ✅ Solution Applied to Invoices

Added `hideable: true` to all toggleable columns in `src/components/work/invoices-table.tsx`:

```typescript
// ❌ BEFORE - Column always visible
{
  key: "customer",
  header: "Customer",
  sortable: true,
  render: (invoice) => <span>{invoice.customer}</span>,
}

// ✅ AFTER - Column can be toggled
{
  key: "customer",
  header: "Customer",
  sortable: true,
  hideable: true,  // ← Added this
  render: (invoice) => <span>{invoice.customer}</span>,
}
```

### Columns Fixed in Invoices Table:
- ✅ `customer`
- ✅ `date`
- ✅ `dueDate`
- ✅ `amount`
- ✅ `status`

### Columns NOT Made Hideable:
- ❌ `invoiceNumber` - Primary identifier, should always show
- ❌ `actions` - Actions column should always show

## 📋 Required for ALL Other Tables

The same fix needs to be applied to **every table** that has a ColumnVisibilityMenu:

### Tables That Need Fixing:

1. **✅ Invoices** - FIXED
2. **Estimates** - Needs `hideable: true` on columns
3. **Payments** - Needs `hideable: true` on columns  
4. **Customers** - Needs `hideable: true` on columns
5. **Jobs** - Needs `hideable: true` on columns
6. **Team Members** - Needs `hideable: true` on columns
7. **Appointments** - Needs `hideable: true` on columns
8. **Contracts** - Needs `hideable: true` on columns
9. **Service Agreements** - Needs `hideable: true` on columns
10. **Purchase Orders** - Needs `hideable: true` on columns
11. **Service Tickets** - Needs `hideable: true` on columns

## 📝 Implementation Pattern

For each table file (e.g., `estimates-table.tsx`, `payments-table.tsx`, etc.):

1. **Find the columns definition**:
   ```typescript
   const columns: ColumnDef<YourType>[] = [
   ```

2. **Add `hideable: true` to toggleable columns**:
   - Match the column `key` with the keys in the toolbar's `COLUMNS` array
   - Don't add `hideable` to primary identifiers or actions columns

3. **Example**: For Estimates

   Toolbar defines these columns:
   ```typescript
   // estimate-toolbar-actions.tsx
   const ESTIMATES_COLUMNS = [
     { key: "customer", label: "Customer" },
     { key: "date", label: "Date" },
     { key: "amount", label: "Amount" },
     { key: "status", label: "Status" },
   ];
   ```

   Table should have:
   ```typescript
   // estimates-table.tsx
   const columns: ColumnDef<Estimate>[] = [
     {
       key: "estimateNumber",  // ← NOT hideable (primary ID)
       // ...
     },
     {
       key: "customer",
       hideable: true,  // ← Add this
       // ...
     },
     {
       key: "date",
       hideable: true,  // ← Add this
       // ...
     },
     {
       key: "amount",
       hideable: true,  // ← Add this
       // ...
     },
     {
       key: "status",
       hideable: true,  // ← Add this
       // ...
     },
     {
       key: "actions",  // ← NOT hideable (actions)
       // ...
     },
   ];
   ```

## 🎯 Quick Reference

### Columns That SHOULD Be Hideable:
- ✅ Customer/Client names
- ✅ Dates (created, due, scheduled, etc.)
- ✅ Amounts/Totals
- ✅ Status badges
- ✅ Assigned users
- ✅ Priority
- ✅ Categories
- ✅ Any supplementary info

### Columns That Should NOT Be Hideable:
- ❌ Primary identifiers (invoice #, estimate #, job #, etc.)
- ❌ Actions column
- ❌ Selection checkbox column

## 🔧 Testing

After applying the fix to a table:

1. Open the page in the browser
2. Click the "Columns" button in the toolbar
3. Uncheck a column (e.g., "Customer")
4. **Expected**: The column should disappear from the table
5. Check the column again
6. **Expected**: The column should reappear

## 📊 Status

- ✅ **Fixed**: Invoices
- ⏳ **Pending**: Estimates, Payments, Customers, Jobs, Team, Appointments, Contracts, Service Agreements, Purchase Orders, Service Tickets

**Next Step**: Apply the same fix to all remaining tables.

