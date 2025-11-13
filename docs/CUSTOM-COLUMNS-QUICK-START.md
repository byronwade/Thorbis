# Custom Columns - Quick Start Guide

## For Developers

### 1. Enable Custom Columns on a Datatable

Add the `entity` prop to your `FullWidthDataTable`:

```typescript
<FullWidthDataTable
  entity="appointments" // 👈 Add this!
  data={appointments}
  columns={columns}
  getItemId={(item) => item.id}
  // ... other props
/>
```

That's it! Custom columns are now enabled for this table.

---

### 2. Add Column Visibility Menu

If not already present, add the `ColumnVisibilityMenu` to your toolbar:

```typescript
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";

<FullWidthDataTable
  entity="appointments"
  data={appointments}
  columns={columns}
  getItemId={(item) => item.id}
  toolbarActions={
    <ColumnVisibilityMenu
      entity="appointments"
      columns={hideableColumns.map(col => ({
        key: col.key,
        label: col.header
      }))}
    />
  }
/>
```

---

### 3. Adding More Fields for an Entity

Edit `/Users/byronwade/Stratos/src/lib/datatable/field-introspection.ts`:

```typescript
appointments: [
  // Add new field
  {
    path: "new_field_name",
    label: "New Field Label",
    type: "string", // or "number", "date", "boolean", "relation"
    recommended: "text", // or "date", "currency", "number", "badge"
  },
  // For nested fields (relationships)
  {
    path: "customer.phone",
    label: "Customer Phone",
    type: "relation",
    recommended: "text",
  },
  // ... existing fields
]
```

---

## For Users

### Adding a Custom Column

1. **Click "Columns" button** in the table toolbar
2. **Click "Add Custom Column"** button
3. **Select a field** from the dropdown (e.g., "Customer Email")
4. **Review/edit the label** (auto-populated)
5. **Choose width** (Auto, Small, Medium, Large, X-Large)
6. **Choose format** (Text, Date, Currency, Number, Badge)
7. **Toggle sortable** (if you want to sort by this column)
8. **Click "Add Column"**

The column appears immediately in your table!

---

### Managing Custom Columns

**Hide/Show Column**:
- Click "Columns" button
- Check/uncheck the column in the list

**Delete Custom Column**:
- Click "Columns" button
- Scroll to "Custom Columns" section
- Hover over the column
- Click the red trash icon

**Your columns persist across page reloads!**

---

## Available Entities

- `appointments` - 45+ fields including customer, technician, property, job
- `jobs` - 30+ fields including customer, property, costs
- `customers` - 15+ fields including contact info, address
- `invoices` - 12+ fields including amounts, dates, customer
- `equipment` - 15+ fields including customer, property, dates

---

## Available Formats

| Format | Example | Best For |
|--------|---------|----------|
| Text | "Sample Text..." | Names, descriptions, notes |
| Date | Jan 15, 2025 3:45 PM | Timestamps, dates |
| Currency | $1,234.56 | Money amounts |
| Number | 1,234 | Quantities, counts |
| Badge | Status | Status, types, booleans |

---

## Tips

1. **Use nested fields** to access related data (e.g., `customer.email`)
2. **Format auto-recommends** based on field type
3. **Custom columns work with sorting** if you enable it
4. **Custom columns work with search** automatically
5. **Custom columns persist** - no need to re-add them
6. **Delete unused columns** to keep your table clean

---

## Examples

### Show customer contact info in appointments table
- Field: `customer.email` → Label: "Customer Email" → Format: Text
- Field: `customer.phone` → Label: "Customer Phone" → Format: Text

### Show financial data in jobs table
- Field: `total_cost` → Label: "Total Cost" → Format: Currency
- Field: `labor_cost` → Label: "Labor Cost" → Format: Currency

### Show timestamps in any table
- Field: `created_at` → Label: "Created" → Format: Date
- Field: `updated_at` → Label: "Last Updated" → Format: Date

### Show status/type fields
- Field: `priority` → Label: "Priority" → Format: Badge
- Field: `status` → Label: "Status" → Format: Badge

---

## Troubleshooting

**Column not appearing?**
- Check if the column is hidden in Column Visibility Menu
- Verify you selected a field and entered a label
- Refresh the page

**Data showing "—"?**
- The field is null/undefined in your data
- Check if the field path is correct (e.g., `customer.email` not `customer_email`)

**Want to add a field not in the list?**
- Contact a developer to add it to `field-introspection.ts`
- Provide: field name, label, type, and which table it's from

---

## Architecture

```
User clicks "Add Custom Column"
        ↓
ColumnBuilderDialog opens
        ↓
User selects field & config
        ↓
Column saved to Zustand store
        ↓
Store persists to localStorage
        ↓
FullWidthDataTable reads custom columns
        ↓
Merges with predefined columns
        ↓
Renders custom columns with format
        ↓
Column visible in table!
```

---

## Performance

- ✅ **No server calls** - All data is already loaded
- ✅ **Instant rendering** - Zustand + memoization
- ✅ **Persistent** - localStorage (fast)
- ✅ **Scales** - Works with virtualization for 1000+ rows
- ✅ **Type-safe** - Full TypeScript coverage

---

## Questions?

See full documentation: `/docs/CUSTOM-COLUMNS-IMPLEMENTATION.md`
