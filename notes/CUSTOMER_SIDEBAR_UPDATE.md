# Customer Sidebar Update - Unified Collapsible Sections

## ✅ Changes Made

Updated the Customer Sidebar to use the **same collapsible component** as the job details pages and other detail pages throughout the application.

### Before:
- Custom Card-based collapsibles
- Manual state management with `useState`
- Manual toggle handlers
- Inconsistent styling

### After:
- Uses `CollapsibleDataSection` component (same as job details)
- Uses `Accordion` component for state management
- Automatic expand/collapse with multi-select
- Consistent styling across the application

---

## Component Used

**`CollapsibleDataSection`** from `src/components/ui/collapsible-data-section.tsx`

This is the **standardized collapsible component** used across:
- Job details pages
- Customer details pages
- Invoice details pages
- All other detail pages in the application

### Features:
✅ Consistent structure and styling  
✅ Loading states with skeletons  
✅ Empty, success, and error states  
✅ Full-width content support  
✅ Icon and badge support  
✅ Count display  
✅ Action buttons support  
✅ Persistent state (localStorage)  

---

## Sections Included

### 1. **Customer Overview**
- Icon: User
- Contains: Email, phone, address, stats
- Stats: Total revenue, active jobs, open invoices, customer since
- Default: Expanded

### 2. **Jobs**
- Icon: Briefcase
- Count badge: Number of jobs
- Shows: Job title, status, job number, total amount
- Empty state: "No jobs found"
- Default: Expanded

### 3. **Invoices**
- Icon: FileText
- Count badge: Number of invoices
- Shows: Invoice number, status, total amount, due date
- Status badges: Paid (default), Unpaid (destructive), Other (outline)
- Empty state: "No invoices found"
- Default: Expanded

### 4. **Appointments**
- Icon: Calendar
- Count badge: Number of appointments
- Shows: Title, status, scheduled date
- Empty state: "No appointments"
- Default: Collapsed

### 5. **Properties**
- Icon: Home
- Count badge: Number of properties
- Shows: Property name, address
- Empty state: "No properties"
- Default: Collapsed

### 6. **Equipment**
- Icon: Wrench
- Count badge: Number of equipment items
- Shows: Equipment name, model, serial number
- Empty state: "No equipment"
- Default: Collapsed

---

## Code Structure

```tsx
<ScrollArea className="h-full">
  <div className="p-4">
    <Accordion
      type="multiple"
      defaultValue={["overview", "jobs", "invoices"]}
      className="space-y-2"
    >
      <CollapsibleDataSection
        value="overview"
        title="Customer Overview"
        icon={<User className="h-4 w-4" />}
        isLoading={false}
      >
        {/* Content */}
      </CollapsibleDataSection>
      
      <CollapsibleDataSection
        value="jobs"
        title="Jobs"
        icon={<Briefcase className="h-4 w-4" />}
        count={jobs.length}
        isLoading={false}
        emptyState={{
          show: jobs.length === 0,
          title: "No jobs found",
          description: "This customer has no jobs yet",
        }}
      >
        {/* Jobs list */}
      </CollapsibleDataSection>
      
      {/* More sections... */}
    </Accordion>
  </div>
</ScrollArea>
```

---

## Benefits

### 1. **Consistency**
- Matches the design of job details, customer details, and invoice details pages
- Users get a familiar experience across the application
- Easier to maintain and update

### 2. **Better UX**
- Multi-select accordion (can expand multiple sections at once)
- Smooth animations
- Empty states with helpful messages
- Loading states with skeletons
- Error states with clear messages

### 3. **Cleaner Code**
- No manual state management
- No custom toggle handlers
- Reusable component
- Type-safe props

### 4. **Accessibility**
- Built-in keyboard navigation
- ARIA labels
- Focus management
- Screen reader friendly

---

## Default State

By default, these sections are **expanded**:
- Customer Overview
- Jobs
- Invoices

All other sections start **collapsed** to avoid overwhelming the user.

---

## Styling

### Item Cards
All items (jobs, invoices, appointments, etc.) use consistent styling:
```tsx
<div className="rounded-lg border bg-muted/30 p-3 text-sm">
  {/* Content */}
</div>
```

### Stats Grid
The customer overview stats use a 2-column grid:
```tsx
<div className="grid grid-cols-2 gap-2">
  <div className="rounded-lg border bg-muted/30 p-2">
    <p className="text-muted-foreground text-xs">Label</p>
    <p className="font-semibold text-sm">Value</p>
  </div>
</div>
```

### Badges
Status badges use semantic variants:
- `default` - Paid, Active, Completed
- `destructive` - Unpaid, Overdue, Cancelled
- `outline` - Pending, Scheduled, Other

---

## Files Modified

- ✅ `src/components/call-window/customer-sidebar.tsx` - Complete rewrite

---

## Files Deleted

- ❌ `src/components/call-window/customer-sidebar-old.tsx` - Old backup removed

---

## Testing Checklist

- [ ] Customer overview displays correctly
- [ ] All sections expand/collapse
- [ ] Multiple sections can be expanded at once
- [ ] Empty states show when no data
- [ ] Counts display correctly in badges
- [ ] Jobs list displays with status badges
- [ ] Invoices list displays with payment status
- [ ] Appointments list displays with dates
- [ ] Properties list displays with addresses
- [ ] Equipment list displays with details
- [ ] Scrolling works smoothly
- [ ] Responsive on different screen sizes

---

## Status

✅ **Complete** - No linter errors  
✅ **Consistent** - Matches job details pages  
✅ **Ready** - For testing  

---

## Next Steps

1. **Test in browser** - Verify all sections work
2. **Test with data** - Make sure real customer data displays
3. **Test empty states** - Verify empty states show correctly
4. **Test responsive** - Check on different screen sizes
5. **Verify consistency** - Compare with job details page

---

**Last Updated:** 2025-01-15  
**Component:** `customer-sidebar.tsx`  
**Pattern:** `CollapsibleDataSection` (unified across app)

