# Advanced Filtering System 🔍

## Overview

A powerful, flexible filtering system that lets users filter by **ANY field** with **multiple conditions**. Think Airtable/Notion-style filtering for your data tables.

## Features ✨

### Multi-Criteria Filtering
- **Add multiple filters** - Combine as many conditions as you want
- **Filter by any field** - Invoice number, customer, amount, date, status, etc.
- **Mix filter types** - Text, numbers, dates, dropdowns all in one view

### Smart Operators
Different operators for different data types:

**Text Fields:**
- Equals / Does not equal
- Contains / Does not contain
- Starts with / Ends with
- Is empty / Is not empty

**Number Fields:**
- Equals / Does not equal
- Greater than / Less than
- Greater than or equal / Less than or equal
- **Between** (two values)
- Is empty / Is not empty

**Date Fields:**
- Is / Is not
- Before / After
- On or before / On or after
- In the last / In the next (for relative dates)
- Is empty / Is not empty

**Select Fields:**
- Is / Is not
- Is empty / Is not empty

### Dynamic UI
- **Add Filter** dropdown - Click to add a new condition
- **Individual removal** - X button on each filter
- **Clear all** - Reset all filters at once
- **Active count badge** - See how many filters are active

## How It Works

### For Users

#### Add a Filter
1. Click "**Add Filter**"
2. Choose a field (Invoice Number, Customer, Amount, etc.)
3. Choose an operator (Equals, Contains, Greater than, etc.)
4. Enter a value
5. Done! Table updates instantly

#### Example Filters

**Find overdue invoices over $1,000:**
- Status equals "Overdue"
- Amount greater than 1000

**Find recent invoices for a customer:**
- Customer contains "Acme Corp"
- Invoice Date after 2024-01-01

**Find invoices in a range:**
- Amount between 500 and 2000
- Status equals "Pending"

#### Combine Multiple Filters
All filters use **AND** logic - items must match ALL conditions:
- Invoice Number starts with "INV-2024"
- Amount greater than 1000
- Status not equals "Draft"

### For Developers

#### Setup (3 steps)

**1. Import components:**
```typescript
import {
  AdvancedFilters,
  applyFilters,
  type FilterCondition,
  type FilterField,
} from "@/components/ui/advanced-filters";
```

**2. Add state:**
```typescript
const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
```

**3. Define fields:**
```typescript
const filterFields: FilterField[] = [
  {
    id: "invoiceNumber",
    label: "Invoice Number",
    type: "text",
  },
  {
    id: "amount",
    label: "Amount",
    type: "number",
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Paid", value: "paid" },
    ],
  },
  {
    id: "date",
    label: "Invoice Date",
    type: "date",
  },
];
```

**4. Apply filters:**
```typescript
const filteredData = useMemo(() => {
  return applyFilters(data, filterConditions);
}, [data, filterConditions]);
```

**5. Add to toolbar:**
```typescript
<DataTable
  toolbarActions={
    <AdvancedFilters
      fields={filterFields}
      conditions={filterConditions}
      onChange={setFilterConditions}
      onClear={() => setFilterConditions([])}
    />
  }
  // ... other props
/>
```

## Examples

### Invoices Table ✅
**Fields:**
- Invoice Number (text)
- Customer (text)
- Amount (number)
- Status (select: draft, pending, paid, overdue)
- Invoice Date (date)
- Due Date (date)

**Use Cases:**
- Find all overdue invoices: `Status = Overdue`
- Find invoices over $5,000: `Amount > 5000`
- Find invoices for "Acme": `Customer contains Acme`
- Find recent invoices: `Invoice Date after 2024-01-01`
- Find invoices due soon: `Due Date in next 7 days`

### Estimates Table (To Implement)
**Fields:**
- Estimate Number (text)
- Customer (text)
- Amount (number)
- Status (select: draft, sent, accepted, declined, expired)
- Created Date (date)
- Valid Until (date)

**Use Cases:**
- Expiring estimates: `Valid Until before [date]`
- High-value estimates: `Amount > 10000`
- Pending customer response: `Status = Sent`

### Jobs Table (To Implement)
**Fields:**
- Job Number (text)
- Customer (text)
- Technician (select)
- Status (select)
- Priority (select)
- Scheduled Date (date)
- Completion Date (date)
- Total Cost (number)

**Use Cases:**
- Today's jobs: `Scheduled Date = Today`
- High priority incomplete: `Priority = High AND Status ≠ Completed`
- Jobs by technician: `Technician = John Doe`
- Jobs over budget: `Total Cost > Estimated Cost`

### Customers Table (To Implement)
**Fields:**
- Name (text)
- Email (text)
- Phone (text)
- Type (select: residential, commercial)
- Status (select: active, inactive)
- Created Date (date)
- Total Revenue (number)

**Use Cases:**
- High-value customers: `Total Revenue > 50000`
- Commercial customers: `Type = Commercial`
- Recent signups: `Created Date in last 30 days`
- Missing contact info: `Email is empty OR Phone is empty`

## UI Components

### FilterCondition Display
```
┌───────────────────────────────────────────────────────────┐
│ [Invoice Number ▼] [Equals ▼] [INV-2024-001    ] [X]     │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│ AND [Amount ▼] [Greater than ▼] [1000]  [X]              │
└───────────────────────────────────────────────────────────┘
```

### Add Filter Menu
```
┌─────────────────┐
│ ➕ Add Filter   │
└─────────────────┘
        ↓
┌─────────────────────┐
│ FILTER BY FIELD     │
├─────────────────────┤
│ Invoice Number      │
│ Customer            │
│ Amount              │
│ Status              │
│ Invoice Date        │
│ Due Date            │
└─────────────────────┘
```

### Toolbar
```
[➕ Add Filter ▼] [Clear all] [2 active]
```

## Technical Details

### Filter Types

```typescript
type FilterType = "text" | "number" | "date" | "select" | "boolean";
```

### Operators

```typescript
type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_than_or_equal"
  | "less_than_or_equal"
  | "between"
  | "is_empty"
  | "is_not_empty"
  | "before"
  | "after"
  | "on_or_before"
  | "on_or_after"
  | "in_last"
  | "in_next";
```

### FilterCondition Structure

```typescript
type FilterCondition = {
  id: string;                           // Unique ID
  field: string;                        // Field to filter on
  operator: FilterOperator;             // How to compare
  value: string | number | boolean;     // Value to compare against
  value2?: string | number;             // Second value for "between"
};
```

### Apply Filters Function

The `applyFilters` helper function handles all the logic:

```typescript
const filteredData = applyFilters(data, conditions);
```

It:
- Iterates through each item
- Checks if item matches ALL conditions (AND logic)
- Returns filtered array
- Handles type conversions automatically
- Supports all operators

## Benefits

### For Users
- ✅ **Powerful** - Filter by anything, anyway you want
- ✅ **Flexible** - Combine multiple conditions
- ✅ **Intuitive** - UI guides you through options
- ✅ **Fast** - Instant results as you type
- ✅ **Visual** - See exactly what filters are active

### For Developers
- ✅ **Reusable** - Same component across all tables
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Declarative** - Just define fields, we handle the rest
- ✅ **Performant** - Memoized filtering
- ✅ **Extensible** - Easy to add new operators/types

## Migration from Simple Filters

**Before (Simple Dropdown):**
```typescript
// Limited to predefined options
<TableFilters
  filters={[
    { label: "Status", options: [...] },
    { label: "Archive", options: [...] },
  ]}
/>
```

**After (Advanced):**
```typescript
// Filter by ANY field with ANY condition
<AdvancedFilters
  fields={filterFields}
  conditions={filterConditions}
  onChange={setFilterConditions}
  onClear={() => setFilterConditions([])}
/>
```

## Future Enhancements 💡

### Phase 2
- ☐ **OR logic** - Match ANY condition (in addition to AND)
- ☐ **Grouped conditions** - (A AND B) OR (C AND D)
- ☐ **Save filter presets** - "My Overdue Invoices"
- ☐ **URL persistence** - Share filtered views via link

### Phase 3
- ☐ **Relative dates** - "Last 7 days", "This month"
- ☐ **Advanced operators** - "One of", "None of", "Has any"
- ☐ **Cross-field filters** - "Amount > Average Amount"
- ☐ **Filter templates** - Quick-apply common filters

### Phase 4
- ☐ **Natural language** - "Overdue invoices over $1000"
- ☐ **Filter history** - Recently used filters
- ☐ **Export filtered** - Download filtered results
- ☐ **Scheduled filters** - Email me matching items daily

## Files

- `src/components/ui/advanced-filters.tsx` - Main component
- `src/components/work/invoices-table.tsx` - Example implementation
- `ADVANCED_FILTERING_SYSTEM.md` - This documentation

## Status

**Current:** ✅ Implemented for Invoices table
**Next:** Estimates, Jobs, Customers, Payments, etc.

---

**Try it now!** Go to Invoices → Click "Add Filter" → Filter by anything! 🎉

