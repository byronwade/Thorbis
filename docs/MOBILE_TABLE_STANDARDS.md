# Mobile Table Display Standards

**Standardized hideOnMobile patterns for responsive table design**

---

## Overview

All 26 table components in Stratos follow a consistent `hideOnMobile` pattern to optimize mobile UX. This standard ensures users see the most critical information on small screens while maintaining full data access on desktop.

## Core Principles

1. **Essential First** - Show only columns needed for core decision-making on mobile
2. **Progressive Disclosure** - Hide secondary metadata, expand on desktop
3. **Consistent Patterns** - Same column types hidden across all tables
4. **Maintain Actions** - Always show action menus for task completion

---

## hideOnMobile Standards

### ✅ ALWAYS VISIBLE (hideOnMobile: false or omitted)

#### Primary Identifiers
- Job title, Customer name, Item name, Invoice number
- The main column that identifies the row

#### Critical Status
- Status badges when they drive workflow decisions
- Example: Job status, Invoice status, Contract status

#### Financial Data
- Primary amounts (Total, Amount, Price)
- Critical for business decisions

#### Actions
- Row action menus
- Enable task completion on mobile

**Example (Jobs Table):**
```typescript
{
  key: "status",
  header: "Status",
  hideable: false, // CRITICAL: Status essential for workflow
  render: (job) => <JobStatusBadge status={job.status} />
},
{
  key: "totalAmount",
  header: "Amount",
  hideable: false, // CRITICAL: Financial data essential
  render: (job) => <span>{formatCurrency(job.totalAmount)}</span>
}
```

### 📱 HIDDEN ON MOBILE (hideOnMobile: true)

#### Date Columns
Always hidden - users can tap into detail view for dates
- Created, Updated, Start Date, End Date
- Due Date, Scheduled, Next Visit, Last Service
- **Frequency:** 14 occurrences across tables

**Example:**
```typescript
{
  key: "dueDate",
  header: "Due Date",
  hideOnMobile: true,
  sortable: true,
  render: (invoice) => formatDate(invoice.dueDate)
}
```

#### Related Entity Information
Hidden when shown in primary column or non-critical
- Customer (when shown elsewhere)
- Assigned To
- Property, Job reference
- **Frequency:** 6 occurrences across tables

**Example:**
```typescript
{
  key: "customer",
  header: "Customer",
  hideOnMobile: true,
  render: (job) => <CustomerPreviewCard customer={job.customer} />
}
```

#### Secondary Metadata
Classification and supplementary info
- Priority, Type, Category, Method
- Reference, Service Type
- **Frequency:** 12 occurrences across tables

**Example:**
```typescript
{
  key: "priority",
  header: "Priority",
  hideOnMobile: true,
  render: (job) => <PriorityBadge priority={job.priority} />
}
```

#### Contact Details
Already shown in detail view or primary column
- Email, Phone
- Contact name (when redundant)
- Address
- **Frequency:** 3 occurrences across tables

**Example:**
```typescript
{
  key: "contact",
  header: "Contact",
  hideOnMobile: true,
  render: (customer) => (
    <div>
      <div>{customer.email}</div>
      <div>{customer.phone}</div>
    </div>
  )
}
```

#### Financial Metadata
Derived or secondary financial values
- Markup percentage
- Labor cost
- Unit cost
- **Frequency:** 3 occurrences across tables

**Example:**
```typescript
{
  key: "markup",
  header: "Markup",
  hideOnMobile: true,
  align: "right",
  render: (item) => <span>{item.markupPercent}%</span>
}
```

#### Technical Specifications
Equipment and product details
- Serial Number, Manufacturer, Location
- Model, Quantity, Unit
- **Frequency:** 4 occurrences across tables

**Example:**
```typescript
{
  key: "serialNumber",
  header: "Serial Number",
  hideOnMobile: true,
  render: (equipment) => equipment.serialNumber || "—"
}
```

---

## Statistics

**Current Standardization (as of 2025-11-24):**
- Total Tables: **26**
- Tables with hideOnMobile: **26** (100%)
- Most Hidden Column Type: **Date columns** (14 occurrences)
- Second Most Hidden: **Secondary metadata** (12 occurrences)

**Mobile Visibility Breakdown:**
- Essential columns visible: ~3-4 per table (Title, Status, Amount, Actions)
- Optional columns hidden: ~3-6 per table (Dates, metadata, contact info)
- Mobile column reduction: **~50-70%** fewer columns on small screens

---

## Implementation Guidelines

### When Adding New Columns

Ask these questions:

1. **Is this data critical for the user's immediate decision?**
   - YES → Keep visible (`hideOnMobile: false` or omit)
   - NO → Continue to question 2

2. **Is this a date column?**
   - YES → Hide on mobile (`hideOnMobile: true`)
   - NO → Continue to question 3

3. **Is this secondary metadata (priority, type, category)?**
   - YES → Hide on mobile (`hideOnMobile: true`)
   - NO → Continue to question 4

4. **Is this contact info or related entity data?**
   - YES → Hide on mobile if already shown elsewhere (`hideOnMobile: true`)
   - NO → Continue to question 5

5. **Is this a technical spec or derived value?**
   - YES → Hide on mobile (`hideOnMobile: true`)
   - NO → Keep visible if truly essential

### Code Pattern

```typescript
const columns: ColumnDef<T>[] = [
  // PRIMARY IDENTIFIER - Always visible
  {
    key: "title",
    header: "Title",
    width: "flex-1",
    render: (item) => <Link href={...}>{item.title}</Link>
  },

  // CRITICAL STATUS - Always visible
  {
    key: "status",
    header: "Status",
    width: "w-28",
    hideable: false, // Prevent hiding via column toggle
    render: (item) => <StatusBadge status={item.status} />
  },

  // DATE COLUMN - Hide on mobile
  {
    key: "createdAt",
    header: "Created",
    width: "w-32",
    hideOnMobile: true, // ← Standard for dates
    sortable: true,
    render: (item) => formatDate(item.createdAt)
  },

  // SECONDARY METADATA - Hide on mobile
  {
    key: "priority",
    header: "Priority",
    width: "w-24",
    hideOnMobile: true, // ← Standard for metadata
    render: (item) => <PriorityBadge priority={item.priority} />
  },

  // FINANCIAL DATA - Always visible
  {
    key: "amount",
    header: "Amount",
    width: "w-32",
    align: "right",
    hideable: false, // Prevent hiding via column toggle
    render: (item) => formatCurrency(item.amount)
  },

  // ACTIONS - Always visible
  {
    key: "actions",
    header: "",
    width: "w-10",
    render: (item) => <RowActionsDropdown actions={...} />
  }
];
```

---

## Verification Checklist

When reviewing table implementations, verify:

- [ ] Primary identifier (title/name) is visible on mobile
- [ ] Critical status column is visible on mobile
- [ ] Financial data (amounts) is visible on mobile
- [ ] Actions menu is visible on mobile
- [ ] All date columns have `hideOnMobile: true`
- [ ] Secondary metadata has `hideOnMobile: true`
- [ ] Contact details have `hideOnMobile: true` (if redundant)
- [ ] Technical specs have `hideOnMobile: true`
- [ ] Mobile shows ~3-4 essential columns only

---

## Exception Cases

### Price Book Table - Status Column

The price book table hides the Status column on mobile, but this is acceptable because:
- Status only shows for **inactive** items
- Most items are active (no status badge shown)
- The column is mostly empty, wasting mobile space

```typescript
{
  key: "status",
  header: "Status",
  hideOnMobile: true, // Exception: rarely populated
  render: (item) => item.isActive ? null : <Badge>Inactive</Badge>
}
```

**General Rule:** If a status column is mostly empty or non-critical for mobile actions, it's acceptable to hide it.

---

## Related Documentation

- `/docs/LOADING_STATES_GUIDE.md` - Loading state patterns for tables
- `/src/components/ui/full-width-datatable.tsx` - Table component implementation
- `/docs/AGENTS.md` - Complete linting rules including table patterns

---

**Version:** 1.0
**Last Audited:** 2025-11-24
**Maintainer:** Development Team
**Coverage:** 26/26 tables (100% compliant)
