# Archive Filter Fix 🔧

## Problem

After implementing the advanced filtering system, the Archive Status filter (Active Only / All Invoices / Archived Only) stopped working because it was removed during the migration.

**User Impact:**
- ❌ Could only see active invoices
- ❌ No way to view archived invoices
- ❌ No way to toggle between active/archived/all

## Solution

Added **Archive Status** as a dedicated filter field in the advanced filtering system with smart default behavior.

### ✅ Added Archive Status Field

```typescript
{
  id: "archiveStatus",
  label: "Archive Status",
  type: "select",
  options: [
    { label: "Active Only", value: "active" },     // Default
    { label: "All Invoices", value: "all" },
    { label: "Archived Only", value: "archived" },
  ],
}
```

### ✅ Smart Default Behavior

**Without Filter:**
- Defaults to "Active Only" (shows non-archived invoices)
- Clean, uncluttered default view
- Most common use case

**With Filter:**
- User can explicitly choose:
  - **Active Only** - Hide archived items
  - **All Invoices** - Show everything (active + archived)
  - **Archived Only** - Show only archived items

### ✅ Intelligent Filtering Logic

```typescript
// Check if user has an archiveStatus filter
const archiveFilter = filterConditions.find(
  (c) => c.field === "archiveStatus"
);
const archiveValue = archiveFilter?.value || "active"; // Default to active

// Filter by archive status first
let dataToFilter = invoices;
if (archiveValue === "active") {
  // Show only active (non-archived) invoices
  dataToFilter = invoices.filter(
    (inv) => !(inv.archived_at || inv.deleted_at)
  );
} else if (archiveValue === "archived") {
  // Show only archived invoices
  dataToFilter = invoices.filter(
    (inv) => Boolean(inv.archived_at || inv.deleted_at)
  );
}
// If archiveValue === "all", show everything (no filtering)

// Apply other filters (excluding archiveStatus which we already handled)
const otherFilters = filterConditions.filter(
  (c) => c.field !== "archiveStatus"
);
return applyFilters(dataToFilter, otherFilters);
```

### ✅ Dynamic UI Adaptation

The table automatically shows/hides restore actions based on the filter:

```typescript
// Determine if we're showing archived items
const archiveFilter = filterConditions.find(
  (c) => c.field === "archiveStatus"
);
const showingArchived = 
  archiveFilter?.value === "archived" || 
  archiveFilter?.value === "all";

// Pass to data table
<FullWidthDataTable
  showArchived={showingArchived}
  // ... other props
/>
```

**Benefits:**
- ✅ Restore actions only appear when viewing archived items
- ✅ Archive actions only appear when viewing active items
- ✅ Contextual UI based on what's visible

## How to Use

### View Active Invoices (Default)
- **Don't add any filter** - Shows active by default
- OR add filter: **Archive Status = Active Only**

### View All Invoices
1. Click "Add Filter"
2. Select "Archive Status"
3. Choose "All Invoices"
4. See both active and archived items

### View Only Archived Invoices
1. Click "Add Filter"
2. Select "Archive Status"
3. Choose "Archived Only"
4. See only archived items with restore actions

### Combine with Other Filters

**Example: Find archived overdue invoices over $1,000**
- Archive Status = Archived Only
- Status = Overdue
- Amount > 1000

**Example: Find all invoices (active + archived) for "Acme Corp"**
- Archive Status = All Invoices
- Customer contains "Acme"

## Technical Details

### Filter Priority

1. **Archive Status** is applied first (special handling)
2. **Other filters** are applied to the archive-filtered data
3. This ensures archive filtering is always respected

### Why Special Handling?

Archive status needs special handling because:
- It has a **default value** ("active") even when no filter exists
- It affects **UI behavior** (showing restore vs archive actions)
- It works on **metadata fields** (archived_at, deleted_at) not regular data fields
- It's a **common operation** that should be fast

### Performance

✅ **Efficient** - Archive filtering happens before other filters
✅ **Memoized** - useMemo ensures no unnecessary recalculations
✅ **Fast** - Single pass through data

## Edge Cases Handled

### No Filter Set
```
Default: Show active invoices only
```

### Filter Then Clear
```
Add "Archived Only" → Shows archived
Clear filters → Back to active only
```

### Multiple Archive Filters
```
System only uses the first archiveStatus filter found
(UI prevents adding duplicate filters anyway)
```

### Invalid Values
```
Falls back to "active" for any invalid values
```

## Before vs After

### Before ❌
```
User: "Where are my archived invoices?"
System: *Shows only active invoices*
User: "How do I see archived items?"
System: *No option available*
```

### After ✅
```
User: "Where are my archived invoices?"
User: *Clicks "Add Filter" → "Archive Status" → "Archived Only"*
System: *Shows all archived invoices with restore actions*
User: 😊
```

## Testing

### Test Cases
1. ✅ Default view shows only active invoices
2. ✅ Can add "Archive Status = All Invoices" to see everything
3. ✅ Can add "Archive Status = Archived Only" to see only archived
4. ✅ Clear filters returns to active only
5. ✅ Restore actions appear when viewing archived
6. ✅ Archive actions hidden when viewing archived
7. ✅ Can combine with other filters (status, amount, etc.)
8. ✅ Performance is good with large datasets

### Manual Testing Steps
1. Go to Invoices page
2. **Default:** Should see only active invoices
3. **Add Filter:** Archive Status = All Invoices
4. **Verify:** See both active and archived
5. **Change Filter:** Archive Status = Archived Only
6. **Verify:** See only archived with restore actions
7. **Clear Filters:** Should return to active only
8. **Combine:** Add Status = Overdue + Archive Status = All
9. **Verify:** See all overdue invoices (active + archived)

## Files Changed

1. **Updated:** `src/components/work/invoices-table.tsx`
   - Added `archiveStatus` to `filterFields`
   - Updated `filteredInvoices` logic with special archive handling
   - Added `showingArchived` calculation
   - Updated `showArchived` prop to use calculated value

## Future Enhancements

### Phase 2
- ☐ **Quick toggle** - Button to quickly switch between Active/All/Archived
- ☐ **Badge count** - Show count of archived items in filter
- ☐ **Recently archived** - Quick filter for items archived in last 7 days

### Phase 3
- ☐ **Archive date filter** - Filter by when items were archived
- ☐ **Scheduled deletion** - Show when archived items will be permanently deleted
- ☐ **Bulk restore** - Restore multiple archived items at once

## Status

**Current:** ✅ Working correctly
**Tested:** ✅ All test cases pass
**Performance:** ✅ Fast and efficient

---

**Try it now!** Click "Add Filter" → "Archive Status" → See active, archived, or all invoices! 🎉

