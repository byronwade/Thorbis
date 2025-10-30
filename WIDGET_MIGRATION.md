# Widget Layout Migration

## What Changed

The job details page now includes **11 default widgets** instead of 5, showcasing all the newly implemented Priority 1 widgets.

**Note**: The Process Timeline widget was removed as it's redundant - `JobProcessIndicatorEditable` is already built into all job pages.

## Automatic Migration

The system now includes automatic migration logic:
- **Version tracking**: Layout version is now tracked (current: v2)
- **Auto-migration**: When you visit a job details page, the system automatically detects old layouts and migrates to the new one
- **No manual action needed**: Just refresh the page and you'll see all 12 widgets

## New Default Widgets (11 total)

### Overview
1. **Job Information** - Core job details

### Financials
2. **Financial Summary** - Quick financial overview
3. **Profitability Analysis** - Profit margins and analysis
4. **Payment Tracker** - Payment progress milestones

### Project Management
5. **Schedule** - Job scheduling and dates
6. **Team Assignments** - Assigned technicians
7. **Materials List** - Required materials with stock status

### Documentation
8. **Permits** - Permit tracking and compliance
9. **Photo Gallery** - Before/during/after photos
10. **Activity Log** - Complete activity timeline

### Customer/Property
11. **Customer Information** - Customer contact details
12. **Property Details** - Property information

## Manual Reset (if needed)

If automatic migration doesn't work:

### Option 1: Use Reset Button
1. Go to job details page
2. Open layout customizer (⚙️ button)
3. Click "Reset to Default"

### Option 2: Clear Browser Storage
Open browser console (F12) and run:
```javascript
localStorage.removeItem('job-details-layout-storage-v2')
```
Then refresh the page.

## For Developers

### Layout Version
Current version: `LAYOUT_VERSION = 3`

Location: `/src/lib/stores/job-details-layout-store.ts`

### Incrementing Version
When making breaking changes to `initialWidgets`:
1. Increment `LAYOUT_VERSION` constant
2. Update this file with migration notes
3. The migrate function will automatically reset old layouts

### Migration Logic
```typescript
migrate: (persistedState: any, version: number) => {
  if (version < LAYOUT_VERSION) {
    // Reset to new layout
    return {
      widgets: initialWidgets,
      industry: "general_contractor",
      version: LAYOUT_VERSION,
    };
  }
  return persistedState;
}
```

## Troubleshooting

### Widgets Not Showing
1. Check browser console for errors
2. Verify you're on a job details page: `/dashboard/work/[id]`
3. Try manual reset options above

### Sidebar Empty
- The sidebar is **dynamic** and shows only visible widgets
- If no widgets are visible, use "Add Widget" button to add them
- Or use "Reset to Default" to restore all 11 widgets

### Old Layout Persists
- Ensure you're running latest code
- Check `LAYOUT_VERSION` is set to 3
- Clear browser cache and localStorage
- Hard refresh (Cmd+Shift+R / Ctrl+F5)

## Version History

- **v3** (Current): Removed job-timeline widget (redundant - built into page) - 11 widgets
- **v2**: Added new Priority 1 widgets - 12 widgets
- **v1**: Original layout - 5 widgets
