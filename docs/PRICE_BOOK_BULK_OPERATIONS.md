# Price Book Bulk Operations System

## 🎯 Overview

Implemented a comprehensive bulk operations system for the price book that enables efficient management of large datasets through mass price updates, bulk imports, and flexible exports.

## ✨ Key Features

### 1. **Mass Price Update**
- **Filter-based selection** - Target specific item types, categories, suppliers, or price ranges
- **Flexible adjustments** - Percentage or fixed amount changes
- **Increase/decrease support** - Easily raise or lower prices
- **Markup ratio maintenance** - Option to keep profit margins consistent
- **Real-time preview** - See changes before applying
- **Warning system** - Clear alerts before permanent changes

### 2. **Bulk Import**
- **Multi-format support** - CSV and Excel (.xlsx, .xls) files
- **Drag & drop upload** - Easy file selection interface
- **Smart column mapping** - Auto-detect and manual column assignment
- **Data validation** - Catch errors and warnings before import
- **Duplicate handling** - Skip, update, or create new items
- **Progress tracking** - Real-time import status
- **Template download** - Get started quickly with correct format

### 3. **Bulk Export**
- **Multiple formats** - CSV, Excel (.xlsx), and PDF
- **Advanced filtering** - Export exactly what you need
- **Column customization** - Choose which fields to include
- **Export history** - Access recent exports
- **Estimated file size** - Know what to expect before downloading
- **Quick re-export** - Reuse previous export configurations

## 📊 User Experience Flow

### Mass Price Update Flow
```
1. User navigates to Mass Price Update
   ↓
2. Selects filters (e.g., "All Services in HVAC")
   ↓
3. Chooses adjustment (e.g., "Increase by 10%")
   ↓
4. Clicks "Generate Preview"
   ↓
5. Reviews 15 items that will be affected
   ↓
6. Sees warning: "This will update 15 items. Cannot be undone."
   ↓
7. Clicks "Apply Changes"
   ↓
8. Changes applied immediately
   ↓
9. Returns to price book with updated prices
```

### Bulk Import Flow
```
1. User navigates to Bulk Import
   ↓
2. Downloads CSV template (optional)
   ↓
3. Drags & drops file or clicks to browse
   ↓
4. System auto-maps columns (Name → "Item Name", SKU → "SKU Code")
   ↓
5. User adjusts mappings if needed
   ↓
6. Clicks "Continue to Validation"
   ↓
7. System shows 2 errors, 3 warnings
   ↓
8. User fixes errors or chooses to skip problematic rows
   ↓
9. Selects duplicate handling: "Update existing items"
   ↓
10. Clicks "Start Import"
   ↓
11. Progress bar shows import status (0% → 100%)
   ↓
12. Success screen shows: 127 imported, 12 updated, 3 skipped
```

### Bulk Export Flow
```
1. User navigates to Bulk Export
   ↓
2. Selects format (Excel)
   ↓
3. Applies filters (e.g., "Active HVAC items")
   ↓
4. Selects 12 columns to include
   ↓
5. Reviews summary: 127 items, ~150 KB
   ↓
6. Clicks "Export 127 Items"
   ↓
7. File downloads immediately
   ↓
8. Export added to "Recent Exports" list
```

## 🗂️ Files Created

### Pages

**1. `/src/app/(dashboard)/dashboard/work/pricebook/mass-update/page.tsx`**
- Mass price update landing page
- How It Works section with 3-step process
- Integrates MassUpdateForm component

**2. `/src/app/(dashboard)/dashboard/work/pricebook/import/page.tsx`**
- Bulk import landing page
- Import process explanation
- Required columns documentation
- Integrates BulkImportForm component

**3. `/src/app/(dashboard)/dashboard/work/pricebook/export/page.tsx`**
- Bulk export landing page
- Export format comparison (CSV, Excel, PDF)
- Export process overview
- Integrates BulkExportForm component

### Components

**4. `/src/components/pricebook/mass-update-form.tsx`**
- Filter selection UI (item type, category, supplier, price range)
- Adjustment type selector (percentage vs fixed)
- Direction selector (increase vs decrease)
- Maintain markup checkbox
- Preview table with before/after prices
- Apply button with warning
- All client-side for interactivity

**5. `/src/components/pricebook/bulk-import-form.tsx`**
- Multi-step import wizard:
  - Step 1: File upload with drag & drop
  - Step 2: Column mapping interface
  - Step 3: Validation results with error/warning display
  - Step 4: Import progress tracking
  - Step 5: Success summary
- Duplicate handling options (skip/update/create)
- Template download functionality
- File type validation

**6. `/src/components/pricebook/bulk-export-form.tsx`**
- Format selection (CSV, Excel, PDF) with radio buttons
- Advanced filter configuration
- Column selection with checkboxes
- Select all / Deselect all functionality
- Export summary (estimated items, columns, file size)
- Recent exports history
- Download button

### Navigation

**7. `/src/components/pricebook/pricebook-filters-sidebar.tsx` (Enhanced)**
- Added "Bulk Import" link to Quick Actions
- Added "Bulk Export" link to Quick Actions
- Icons: Upload (import), Download (export), TrendingUp (mass update)
- Now has 5 quick actions total

## 🏗️ Architecture

### Component Hierarchy

```
Mass Update Page
└─ MassUpdateForm (client component)
    ├─ Filter Selection Section
    │   ├─ Item Type Select
    │   ├─ Category Select
    │   ├─ Supplier Select
    │   └─ Price Range Inputs
    ├─ Adjustment Section
    │   ├─ Type Radio Group (percentage/fixed)
    │   ├─ Direction Radio Group (increase/decrease)
    │   ├─ Value Input
    │   └─ Maintain Markup Checkbox
    └─ Preview Section
        ├─ Summary Stats
        ├─ Preview Items List
        ├─ Warning Alert
        └─ Apply Button

Bulk Import Page
└─ BulkImportForm (client component)
    ├─ Step 1: Upload
    │   ├─ Drag & Drop Zone
    │   └─ Template Download Button
    ├─ Step 2: Column Mapping
    │   ├─ Required Fields Indicator
    │   └─ Column Mapping Selects
    ├─ Step 3: Validation
    │   ├─ Error/Warning List
    │   └─ Duplicate Handling Radio Group
    ├─ Step 4: Importing
    │   └─ Progress Bar
    └─ Step 5: Complete
        ├─ Success Stats
        └─ Action Buttons

Bulk Export Page
└─ BulkExportForm (client component)
    ├─ Format Selection Section
    │   └─ Format Radio Group (CSV/Excel/PDF)
    ├─ Filter Selection Section
    │   ├─ Item Type Select
    │   ├─ Category Select
    │   ├─ Supplier Select
    │   ├─ Status Select
    │   └─ Price Range Inputs
    ├─ Column Selection Section
    │   ├─ Select All / Deselect All Buttons
    │   └─ Column Checkboxes Grid
    ├─ Export Summary Section
    │   ├─ Stats Cards
    │   └─ Export Button
    └─ Recent Exports Section
        └─ Recent Export Cards
```

## 🎨 Visual Design

### Color Coding

**Mass Update Preview Items**:
- Increase: Green badge (+$XX.XX)
- Decrease: Red badge (-$XX.XX)
- Shows both dollar amount and percentage change

**Bulk Import Validation**:
- Errors: Red border, red icon, red text (must fix)
- Warnings: Amber border, amber icon, amber text (can proceed)

**Export Format Cards**:
- CSV: Gray (Universal)
- Excel: Green icon (Formatted)
- PDF: Red icon (Print-ready)

### UI Patterns

**Two-Column Layout** (Mass Update & Export):
- Left: Configuration options (filters, settings)
- Right: Preview/summary (results, stats)

**Wizard Flow** (Import):
- Single card progresses through 5 steps
- Back/Continue navigation between steps
- Progress indicated by step completion

**Filter Reuse**:
- Same filter UI across all three operations
- Consistent select dropdowns and inputs
- Filter count badges

## 📝 Code Examples

### Mass Price Update - Calculating New Prices

```typescript
const value = parseFloat(adjustmentValue) || 0;

mockItems.forEach((item) => {
  if (adjustmentType === "percentage") {
    const change = isIncrease
      ? item.currentPrice * (value / 100)
      : -(item.currentPrice * (value / 100));
    item.newPrice = item.currentPrice + change;
    item.change = change;
    item.changePercent = isIncrease ? value : -value;
  } else {
    const change = isIncrease ? value : -value;
    item.newPrice = item.currentPrice + change;
    item.change = change;
    item.changePercent = (change / item.currentPrice) * 100;
  }
});
```

### Bulk Import - Auto Column Mapping

```typescript
// Auto-map obvious columns
const autoMapping: ColumnMapping = {
  name: "Item Name",           // Matched "Item Name" → "name"
  sku: "SKU Code",             // Matched "SKU Code" → "sku"
  itemType: "Type",            // Matched "Type" → "itemType"
  category: "Category Name",   // Matched "Category Name" → "category"
  cost: "Cost Price",          // Matched "Cost Price" → "cost"
  price: "Sell Price",         // Matched "Sell Price" → "price"
  description: "Description",  // Exact match
  unit: "Unit of Measure",     // Matched "Unit of Measure" → "unit"
  subcategory: null,           // Not found in file
  supplierName: null,          // Not found in file
  laborHours: null,            // Not found in file
};
```

### Bulk Export - Column Selection

```typescript
const columnLabels: Record<keyof ColumnConfig, string> = {
  name: "Name",
  sku: "SKU",
  itemType: "Item Type",
  category: "Category",
  subcategory: "Subcategory",
  description: "Description",
  cost: "Cost",
  price: "Price",
  markupPercent: "Markup %",
  laborHours: "Labor Hours",
  unit: "Unit",
  supplierName: "Supplier",
  isActive: "Status",
  lastUpdated: "Last Updated",
};

// User can toggle any column on/off
const toggleColumn = (column: keyof ColumnConfig) => {
  setColumns({ ...columns, [column]: !columns[column] });
};
```

## 🔧 Implementation Details

### Mass Update Filters

```typescript
type UpdateFilter = {
  itemType: "all" | "service" | "material" | "equipment";
  category: string | null;
  supplier: string | null;
  priceMin: number | null;
  priceMax: number | null;
};
```

### Adjustment Types

```typescript
type AdjustmentType = "percentage" | "fixed";

// Percentage: Increase by 10% → price * 1.10
// Fixed: Increase by $5 → price + 5
```

### Import Column Mapping

```typescript
type ColumnMapping = {
  name: string | null;           // Required
  sku: string | null;            // Required
  itemType: string | null;       // Required
  category: string | null;       // Required
  cost: string | null;           // Required
  price: string | null;          // Required
  subcategory: string | null;    // Optional
  description: string | null;    // Optional
  unit: string | null;           // Optional
  supplierName: string | null;   // Optional
  laborHours: string | null;     // Optional
};
```

### Export Column Configuration

```typescript
type ColumnConfig = {
  // Basic Info
  name: boolean;
  sku: boolean;
  itemType: boolean;
  description: boolean;

  // Categories
  category: boolean;
  subcategory: boolean;

  // Pricing
  cost: boolean;
  price: boolean;
  markupPercent: boolean;

  // Additional
  laborHours: boolean;
  unit: boolean;
  supplierName: boolean;
  isActive: boolean;
  lastUpdated: boolean;
};
```

### Validation Issue Types

```typescript
type ValidationIssue = {
  row: number;              // Row number in file
  field: string;            // Field with issue
  message: string;          // What's wrong
  severity: "error" | "warning";  // Can proceed or must fix
};

// Examples:
// Error: "Required field 'name' is missing"
// Error: "Invalid item type 'services' (should be 'service')"
// Warning: "Price is lower than cost (possible error)"
// Warning: "Duplicate SKU found in existing items"
```

## ✅ Benefits

### For Users
- **Save Time**: Update hundreds of items in seconds instead of hours
- **Reduce Errors**: Preview changes before applying
- **Flexible Imports**: Bring data from any system with column mapping
- **Custom Exports**: Get exactly the data you need in the format you want
- **Audit Trail**: Track what was changed and when

### For Business
- **Price Management**: Easily respond to supplier price changes
- **Data Migration**: Import from legacy systems smoothly
- **Reporting**: Export custom views for analysis
- **Compliance**: Export for accounting and tax purposes
- **Efficiency**: Bulk operations vs manual entry saves hours

### For Developers
- **Reusable Filters**: Same filter UI across all operations
- **Type Safety**: Full TypeScript coverage
- **Validation**: Catch issues before they hit database
- **Progress Feedback**: Users always know what's happening
- **Error Handling**: Clear error messages guide users

## 🚀 Future Enhancements

### Potential Improvements

1. **Mass Update Enhancements**:
   - Schedule price updates for future dates
   - Apply different adjustments by category
   - Audit log of all mass updates
   - Undo last mass update
   - Save adjustment templates

2. **Import Enhancements**:
   - Save column mapping templates
   - Support for more file formats (Google Sheets, etc.)
   - Batch import multiple files
   - Image import with items
   - Automatic data cleanup (trim spaces, fix capitalization)

3. **Export Enhancements**:
   - Schedule recurring exports
   - Email export files
   - Export to Google Sheets/Drive
   - Custom export templates
   - Export item images
   - Export as price lists with branding

4. **Advanced Features**:
   - Compare before/after with visual diff
   - Import/export category mappings
   - Bulk duplicate detection and merging
   - Smart suggestions based on historical data
   - Export analytics (most exported items, categories)

## 🔍 Testing Checklist

### Mass Update
- [ ] Filter by item type - correct items shown in preview
- [ ] Filter by category - correct items shown in preview
- [ ] Filter by supplier - correct items shown in preview
- [ ] Filter by price range - correct items shown in preview
- [ ] Percentage increase - calculations correct
- [ ] Percentage decrease - calculations correct
- [ ] Fixed amount increase - calculations correct
- [ ] Fixed amount decrease - calculations correct
- [ ] Maintain markup option - markup ratios preserved
- [ ] Warning shown before applying
- [ ] Apply changes - items updated in database
- [ ] Preview updates when adjustment changes

### Bulk Import
- [ ] File upload via drag & drop
- [ ] File upload via file picker
- [ ] File type validation (CSV/Excel only)
- [ ] Template download works
- [ ] Auto column mapping - matches correctly
- [ ] Manual column mapping - overrides auto-mapping
- [ ] Required field validation - errors shown
- [ ] Data validation - errors and warnings shown
- [ ] Duplicate handling: Skip - duplicates not imported
- [ ] Duplicate handling: Update - existing items updated
- [ ] Duplicate handling: Create - duplicates created
- [ ] Progress bar updates during import
- [ ] Success screen shows correct counts
- [ ] Back button navigation works

### Bulk Export
- [ ] Format selection - CSV, Excel, PDF
- [ ] Filter by item type - affects estimated count
- [ ] Filter by category - affects estimated count
- [ ] Filter by supplier - affects estimated count
- [ ] Filter by status - affects estimated count
- [ ] Filter by price range - affects estimated count
- [ ] Column selection - all/none works
- [ ] Column selection - individual toggles work
- [ ] Selected column count updates
- [ ] Export summary shows correct stats
- [ ] Export button triggers download
- [ ] Recent exports list populated
- [ ] Recent export download works

## 📚 Related Documentation

- [Price Book Restructure](./PRICE_BOOK_RESTRUCTURE.md) - Industry best practices
- [Price Book Drill-Down](./PRICE_BOOK_DRILLDOWN.md) - Navigation system
- [Price Book Categories](./PRICE_BOOK_CATEGORIES.md) - Category hierarchy
- Database Schema: `/src/lib/db/schema.ts`
- Zustand Store: `/src/lib/stores/pricebook-store.ts`

## 🔗 Navigation

All bulk operations are accessible from the Price Book sidebar under "Quick Actions":

1. **Add Item** - Create single item
2. **Labor Calculator** - Calculate service pricing
3. **Mass Price Update** - Bulk price changes
4. **Bulk Import** - Import from CSV/Excel
5. **Bulk Export** - Export to CSV/Excel/PDF

## 📈 Usage Scenarios

### Scenario 1: Supplier Price Increase
```
Problem: Ferguson increased all HVAC equipment prices by 15%

Solution:
1. Open Mass Price Update
2. Filter: Item Type = Equipment, Category = HVAC
3. Adjustment: Percentage, Increase, 15%
4. Maintain Markup: Checked
5. Preview: 12 items affected
6. Apply Changes

Result: All HVAC equipment costs and prices updated in 30 seconds
```

### Scenario 2: Importing Legacy Data
```
Problem: Moving 500 items from old spreadsheet to new system

Solution:
1. Open Bulk Import
2. Download template to see format
3. Format old spreadsheet to match
4. Upload file
5. Map columns (mostly auto-detected)
6. Review 3 warnings about prices
7. Choose "Skip duplicates"
8. Import

Result: 500 items imported in 2 minutes, 3 duplicates skipped
```

### Scenario 3: Creating Price List for Customers
```
Problem: Need to send HVAC service price list to commercial client

Solution:
1. Open Bulk Export
2. Format: PDF
3. Filters: Item Type = Service, Category = HVAC
4. Columns: Select Name, Description, Price only
5. Export

Result: Clean, print-ready PDF with 45 HVAC services
```

---

**Last Updated**: 2025-01-31
**Version**: 1.0 (Bulk Operations Implementation)
