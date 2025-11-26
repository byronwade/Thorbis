# DataTables in Collapsible Sections

## Overview

DataTables inside collapsible accordion sections should be full-width with no padding for optimal space utilization and visual consistency.

## Standard Pattern

### ✅ Correct Implementation

```typescript
{
  id: "jobs",
  title: "Job History",
  icon: <Briefcase className="size-4" />,
  count: jobs.length,
  actions: (
    <Button size="sm" variant="outline">
      <Plus className="mr-2 h-4 w-4" /> Create Job
    </Button>
  ),
  content: (
    <UnifiedAccordionContent className="p-0">
      {/* Optional: Description bar with border */}
      <div className="border-b px-6 py-4 text-muted-foreground text-sm">
        Description or helpful context for this section.
      </div>
      {/* Full-width datatable */}
      <JobsTable jobs={jobs} />
    </UnifiedAccordionContent>
  ),
}
```

### ❌ Incorrect Implementation

```typescript
// BAD: Default padding creates unnecessary space
content: (
  <UnifiedAccordionContent>
    <div className="space-y-4">
      <JobsTable jobs={jobs} />
    </div>
  </UnifiedAccordionContent>
),

// BAD: Manual padding around table
content: (
  <UnifiedAccordionContent className="p-6">
    <JobsTable jobs={jobs} />
  </UnifiedAccordionContent>
),
```

## Key Requirements

### 1. Remove Default Padding

**Always use `className="p-0"`** on `UnifiedAccordionContent` when wrapping a datatable:

```typescript
<UnifiedAccordionContent className="p-0">
  <DataTable />
</UnifiedAccordionContent>
```

### 2. Add Description Bar (Optional)

If you need to provide context or description, add it as a bordered section **inside** the `p-0` wrapper:

```typescript
<UnifiedAccordionContent className="p-0">
  <div className="border-b px-6 py-4 text-muted-foreground text-sm">
    Your description here
  </div>
  <DataTable />
</UnifiedAccordionContent>
```

### 3. Full-Width Tables

DataTables should:
- ✅ Span full width of the accordion
- ✅ Have no horizontal padding
- ✅ Use their internal padding for cell spacing
- ✅ Align seamlessly with section edges

## Examples Across Pages

### Job Details Page

```typescript
sections.push({
  id: "invoices",
  title: "Invoices",
  icon: <FileText className="size-4" />,
  count: invoices.length,
  actions: (
    <Button size="sm" variant="outline">
      <Plus className="mr-2 h-4 w-4" /> Create Invoice
    </Button>
  ),
  content: (
    <UnifiedAccordionContent className="p-0">
      <div className="border-b px-6 py-4 text-muted-foreground text-sm">
        Billing history and outstanding invoices for this job.
      </div>
      <div className="overflow-x-auto">
        <JobInvoicesTable invoices={invoices} />
      </div>
    </UnifiedAccordionContent>
  ),
});
```

### Property Details Page

```typescript
{
  id: "jobs",
  title: "Job History",
  icon: <Briefcase className="size-4" />,
  count: jobs.length,
  actions: (
    <Button asChild size="sm" variant="outline">
      <Link href={`/dashboard/work/new?propertyId=${property.id}`}>
        <Briefcase className="mr-2 size-4" />
        Create Job
      </Link>
    </Button>
  ),
  content: jobs.length === 0 ? (
    <UnifiedAccordionContent>
      {/* Empty state with padding */}
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Briefcase className="mb-4 size-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          No jobs found for this property
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link href={`/dashboard/work/new?propertyId=${property.id}`}>
            Create First Job
          </Link>
        </Button>
      </div>
    </UnifiedAccordionContent>
  ) : (
    <UnifiedAccordionContent className="p-0">
      {/* Full-width table when data exists */}
      <PropertyJobsTable jobs={jobs} />
    </UnifiedAccordionContent>
  ),
}
```

### Customer Details Page

```typescript
{
  id: "properties",
  title: "Properties",
  icon: <Building2 className="size-4" />,
  count: properties.length,
  actions: (
    <Button size="sm" variant="outline">
      <Plus className="mr-2 h-4 w-4" /> Add Property
    </Button>
  ),
  content: (
    <UnifiedAccordionContent className="p-0">
      <div className="border-b px-6 py-4 text-muted-foreground text-sm">
        Manage service locations for this customer.
      </div>
      <PropertiesTable
        customerId={customer.id}
        itemsPerPage={10}
        properties={properties}
      />
    </UnifiedAccordionContent>
  ),
}
```

## Conditional Rendering Pattern

When you have an empty state, use conditional rendering:

```typescript
content: data.length === 0 ? (
  // Empty state WITH padding
  <UnifiedAccordionContent>
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="mb-4 size-12 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">No data yet</p>
      <Button asChild className="mt-4" size="sm">
        <Link href="/create">Create First Item</Link>
      </Button>
    </div>
  </UnifiedAccordionContent>
) : (
  // DataTable WITHOUT padding
  <UnifiedAccordionContent className="p-0">
    <DataTable data={data} />
  </UnifiedAccordionContent>
),
```

## Visual Hierarchy

### With Description Bar

```
┌─────────────────────────────────────┐
│ ▾ Section Title (3)       [Button]  │ ← Section Header
├─────────────────────────────────────┤
│ Description text here               │ ← Description bar (border-b, px-6 py-4)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [✓] Search...  1-10 of 50   ⟨ ⟩ │ │ ← Table Toolbar
│ ├─────────────────────────────────┤ │
│ │ Column 1    Column 2    Column 3│ │ ← Table Header
│ ├─────────────────────────────────┤ │
│ │ Data row 1                      │ │
│ │ Data row 2                      │ │ ← Table Rows (full width)
│ │ Data row 3                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Without Description Bar

```
┌─────────────────────────────────────┐
│ ▾ Section Title (3)       [Button]  │ ← Section Header
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [✓] Search...  1-10 of 50   ⟨ ⟩ │ │ ← Table Toolbar (flush with edges)
│ ├─────────────────────────────────┤ │
│ │ Column 1    Column 2    Column 3│ │ ← Table Header
│ ├─────────────────────────────────┤ │
│ │ Data row 1                      │ │
│ │ Data row 2                      │ │ ← Table Rows (full width)
│ │ Data row 3                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Component Compatibility

### Works With

- ✅ `FullWidthDataTable` (recommended)
- ✅ `JobsTable`
- ✅ `PropertyJobsTable`
- ✅ `PropertyEquipmentTable`
- ✅ `PropertiesTable`
- ✅ `CustomerInvoicesTable`
- ✅ `JobInvoicesTable`
- ✅ `JobEstimatesTable`
- ✅ `JobPurchaseOrdersTable`
- ✅ `JobAppointmentsTable`
- ✅ Any table using `FullWidthDataTable` internally

### Table Component Requirements

Tables must be designed to work edge-to-edge:

1. **No wrapper padding**: Don't add `p-4` or `p-6` to table wrappers
2. **Internal cell padding**: Use cell padding for spacing (built into components)
3. **Responsive design**: Tables should handle mobile/desktop breakpoints
4. **Overflow handling**: Add `overflow-x-auto` if needed for horizontal scroll

## Migration Checklist

When updating existing accordion sections with tables:

- [ ] Add `className="p-0"` to `UnifiedAccordionContent`
- [ ] Move any description text into a bordered div inside `UnifiedAccordionContent`
- [ ] Remove any wrapper divs with padding around the table
- [ ] Test on mobile to ensure horizontal scroll works
- [ ] Verify the table toolbar is flush with section edges
- [ ] Check that empty states still have padding when shown

## Updated Pages

### Completed ✅

- ✅ Job Details Page - All table sections
- ✅ Property Details Page - Job History, Equipment
- ✅ Customer Details Page - Properties, Jobs

### Pending

- [ ] Equipment Details Page (if applicable)
- [ ] Estimate Details Page (if applicable)
- [ ] Invoice Details Page (if applicable)
- [ ] Other detail pages with embedded tables

## Benefits

### Visual

- ✅ More space for data columns
- ✅ Clean, professional appearance
- ✅ Consistent with modern SaaS applications
- ✅ Better alignment and visual flow

### Functional

- ✅ More horizontal space for columns
- ✅ Better mobile experience
- ✅ Easier to scan rows
- ✅ Less visual clutter

### Technical

- ✅ Consistent pattern across codebase
- ✅ Easier to maintain
- ✅ Predictable rendering
- ✅ Better performance (less DOM nesting)

## Related Documentation

- [Full Width DataTable Component](../src/components/ui/full-width-datatable.tsx)
- [Unified Accordion Component](../src/components/ui/unified-accordion.tsx)
- [Section Actions Standardization](./SECTION-ACTIONS-STANDARDIZATION.md)
- [Keyboard Shortcuts](./KEYBOARD-SHORTCUTS.md)

## Best Practices

1. **Always use `p-0`** when wrapping tables
2. **Add description bars** for context (optional but helpful)
3. **Use conditional rendering** for empty states
4. **Test on mobile** to verify horizontal scroll
5. **Keep tables full-width** for maximum data visibility
6. **Use consistent button styling** in actions
7. **Leverage keyboard shortcuts** (Ctrl+1-9, Ctrl+0) for quick access

