# Customer Sidebar - Unified Accordion Update

## ✅ Changes Made

Updated the Customer Sidebar to use **`UnifiedAccordion`** - the exact same component used on job details, customer details, invoice details, and all other detail pages throughout the application.

---

## Before vs After

### Before:
- Used `Accordion` + `CollapsibleDataSection`
- Simple collapsibles without advanced features
- No drag handles
- No keyboard shortcuts
- Different styling from detail pages

### After:
- Uses `UnifiedAccordion`
- **Drag handles** for reordering (disabled in call window)
- **Keyboard shortcuts** (Ctrl+1, Ctrl+2, etc.)
- **Proper border styling** (`border-border/60`)
- **Background colors** (`bg-muted/60` for open, `bg-background/80` for closed)
- **Chevron rotation** animation
- **Exact same structure** as detail pages

---

## New Features

### 1. **Keyboard Shortcuts**
- `Ctrl+1` - Toggle Customer Overview
- `Ctrl+2` - Toggle Jobs
- `Ctrl+3` - Toggle Invoices
- `Ctrl+4` - Toggle Appointments
- `Ctrl+5` - Toggle Properties
- `Ctrl+6` - Toggle Equipment

### 2. **Drag Handles** (Disabled)
- Drag handles are present but reordering is disabled (`enableReordering={false}`)
- Can be enabled in the future if needed
- Handles appear on hover with opacity transition

### 3. **Proper Structure**
```html
<section class="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
  <div class="flex flex-col gap-4 p-0">
    <div class="overflow-visible rounded-md bg-muted/50 shadow-sm">
      <!-- Sections with drag handles, keyboard shortcuts, etc. -->
    </div>
  </div>
</section>
```

### 4. **Consistent Styling**
- **Open sections**: `bg-muted/60` header background
- **Closed sections**: `bg-background/80 hover:bg-muted/40` header background
- **Borders**: `border-border/60` throughout
- **Chevron**: Rotates 90deg when open
- **Icons**: Consistent sizing and colors

---

## Sections Included

1. **Customer Overview** (Ctrl+1)
   - Email, phone, address
   - Stats grid (revenue, jobs, invoices, customer since)
   - Default: Open

2. **Jobs** (Ctrl+2)
   - Job title, status, job number, amount
   - Count badge
   - Empty state with icon

3. **Invoices** (Ctrl+3)
   - Invoice number, status, amount, due date
   - Status badges (paid/unpaid)
   - Count badge
   - Empty state

4. **Appointments** (Ctrl+4)
   - Title, status, scheduled date
   - Count badge
   - Empty state

5. **Properties** (Ctrl+5)
   - Property name, address
   - Count badge
   - Empty state

6. **Equipment** (Ctrl+6)
   - Equipment name, model, serial number
   - Count badge
   - Empty state

---

## Component Structure

```tsx
const sections: UnifiedAccordionSection[] = [
  {
    id: "overview",
    title: "Customer Overview",
    icon: <User className="h-4 w-4" />,
    content: (
      <div className="space-y-6 p-6">
        {/* Content */}
      </div>
    ),
  },
  // ... more sections
];

return (
  <ScrollArea className="h-full">
    <div className="flex flex-col gap-4 p-4">
      <section className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 p-0">
          <UnifiedAccordion
            sections={sections}
            defaultOpenSection="overview"
            storageKey="call-window-customer-sidebar"
            enableReordering={false}
          />
        </div>
      </section>
    </div>
  </ScrollArea>
);
```

---

## Props Used

```tsx
<UnifiedAccordion
  sections={sections}              // Array of sections
  defaultOpenSection="overview"    // First section open by default
  storageKey="call-window-customer-sidebar"  // LocalStorage key for state
  enableReordering={false}         // Disable drag-and-drop reordering
/>
```

---

## Benefits

### 1. **Consistency**
✅ Matches job details, customer details, invoice details pages exactly  
✅ Users get familiar experience across the application  
✅ Same keyboard shortcuts everywhere  

### 2. **Better UX**
✅ Keyboard shortcuts for power users  
✅ Smooth animations and transitions  
✅ Proper hover states  
✅ Visual feedback on interaction  

### 3. **Maintainability**
✅ Single source of truth for accordion behavior  
✅ Easier to update styling globally  
✅ Reusable component  
✅ Type-safe props  

### 4. **Accessibility**
✅ Built-in keyboard navigation  
✅ ARIA labels and roles  
✅ Focus management  
✅ Screen reader friendly  

---

## Files Modified

- ✅ `src/components/call-window/customer-sidebar.tsx` - Complete rewrite with UnifiedAccordion

---

## Testing Checklist

- [ ] All sections expand/collapse correctly
- [ ] Keyboard shortcuts work (Ctrl+1 through Ctrl+6)
- [ ] Chevron rotates when opening/closing
- [ ] Hover states work on section headers
- [ ] Count badges display correctly
- [ ] Empty states show when no data
- [ ] Customer overview stats display
- [ ] Jobs list displays with status badges
- [ ] Invoices list displays with payment status
- [ ] Appointments list displays with dates
- [ ] Properties list displays with addresses
- [ ] Equipment list displays with details
- [ ] Scrolling works smoothly
- [ ] Responsive on different screen sizes
- [ ] Matches styling of job details pages

---

## Comparison with Detail Pages

### Job Details Page:
```html
<section class="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
  <div class="flex flex-col gap-4 p-0">
    <UnifiedAccordion sections={jobSections} />
  </div>
</section>
```

### Call Window Customer Sidebar:
```html
<section class="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
  <div class="flex flex-col gap-4 p-0">
    <UnifiedAccordion sections={customerSections} />
  </div>
</section>
```

**Identical structure!** ✅

---

## Status

✅ **Complete** - No linter errors  
✅ **Consistent** - Matches detail pages exactly  
✅ **Ready** - For testing  

---

## Next Steps

1. **Test in browser** - Verify all sections work
2. **Test keyboard shortcuts** - Ctrl+1 through Ctrl+6
3. **Compare with job details** - Ensure styling matches
4. **Test with real data** - Verify all data displays correctly
5. **Test responsive** - Check on different screen sizes

---

**Last Updated:** 2025-01-15  
**Component:** `customer-sidebar.tsx`  
**Pattern:** `UnifiedAccordion` (same as all detail pages)  
**Keyboard Shortcuts:** ✅ Enabled  
**Drag & Drop:** ❌ Disabled (can be enabled if needed)

