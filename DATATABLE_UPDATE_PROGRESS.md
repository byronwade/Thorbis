# Datatable Standardization Progress Report

## ✅ Completed Pages (5/13 - 38%)

### 1. **Appointments** ✅
- Archive filter: ✅ Working
- Column visibility: ✅ 4 columns
- Sortable columns: ✅ All enabled
- Kanban view: ✅ Enabled
- Archived styling: ✅ Greyed out

### 2. **Invoices** ✅
- Archive filter: ✅ Working  
- Column visibility: ✅ 5 columns
- Sortable columns: ✅ All enabled
- Kanban view: ❌ Disabled (by request)
- Archived styling: ✅ Greyed out

### 3. **Estimates** ✅
- Archive filter: ✅ Working
- Column visibility: ✅ 6 columns
- Sortable columns: ✅ All enabled
- Kanban view: ✅ Enabled
- Archived styling: ✅ Greyed out

### 4. **Payments** ✅
- Archive filter: ✅ Working
- Column visibility: ✅ 6 columns
- Sortable columns: ✅ Just added (all 6 columns)
- Kanban view: ✅ Enabled
- Archived styling: ✅ Just added

### 5. **Contracts** ✅
- Archive filter: ✅ Working
- Column visibility: ✅ 5 columns
- Sortable columns: ✅ Already enabled
- Kanban view: ❌ Disabled
- Archived styling: ✅ Greyed out

---

## 🚧 Remaining Pages (8/13 - 62%)

###  6. Purchase Orders (toolbar ✅, table needs sortable)
- Archive filter: ✅ Toolbar has it
- Column visibility: ✅ Toolbar has it
- Sortable columns: ❌ NEEDS sortable: true on columns
- Archive filtering: ❌ NEEDS filtering logic in table

### 7. Teams
- Archive filter: ✅ Toolbar has it
- Column visibility: ✅ Toolbar has it
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 8. Properties
- Archive filter: ❓ Need to check toolbar
- Column visibility: ❓ Need to check toolbar
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 9. Equipment
- Archive filter: ❓ Need to check toolbar
- Column visibility: ❓ Need to check toolbar
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 10. Customers
- Archive filter: ❓ Need to check toolbar
- Column visibility: ❓ Need to check toolbar
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 11. Maintenance Plans
- Archive filter: ✅ Toolbar has it
- Column visibility: ✅ Toolbar has it
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 12. Service Agreements
- Archive filter: ❓ Need to check toolbar
- Column visibility: ❓ Need to check toolbar
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 13. Materials Inventory
- Archive filter: ❌ No toolbar component yet
- Column visibility: ❌ No toolbar component yet
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

### 14. Price Book
- Archive filter: ❓ Need to check toolbar
- Column visibility: ❓ Need to check toolbar
- Sortable columns: ❓ Need to check
- Archive filtering: ❓ Need to check

---

## 📋 Standard Update Checklist (Per Page)

For each remaining page, these steps are needed:

### Toolbar Component (`*-toolbar-actions.tsx`)
```typescript
// Should have:
- ✅ ArchiveFilterSelect
- ✅ ColumnVisibilityMenu  
- ✅ Column definitions array
- ✅ BaseToolbarActions wrapper
```

### Table Component (`*-table.tsx`)
```typescript
// 1. Add archive filtering
const archiveFilter = useArchiveStore((state) => state.filters.entityName);
const filteredItems = items.filter((item) => {
  const isArchived = !!(item.archived_at || item.deleted_at);
  if (archiveFilter === "active") return !isArchived;
  if (archiveFilter === "archived") return isArchived;
  return true;
});

// 2. Add sortable: true to all columns
{
  key: "columnName",
  header: "Column Header",
  sortable: true, // ← ADD THIS
  // ... other props
}

// 3. Update FullWidthDataTable
<FullWidthDataTable
  data={filteredItems} // ← Use filtered
  entity="entityName"
  isArchived={(item) => !!(item.archived_at || item.deleted_at)}
  showArchived={archiveFilter !== "active"}
  // ... other props
/>
```

---

## ⚡ Batch Update Strategy

To efficiently complete remaining pages:

1. **Check each toolbar** - Most already have archive filter & column menu
2. **Update tables** - Add sortable: true to columns (quick batch edit)
3. **Add filtering** - Copy/paste archive filter logic
4. **Update FullWidthDataTable** - Add entity, isArchived, showArchived props

---

## 🎯 Expected Final State

Once all 13 pages are complete:
- ✅ Every datatable has archive filtering
- ✅ Every datatable has column visibility menu
- ✅ Every datatable has sortable columns
- ✅ Consistent header toolbar across all pages
- ✅ Greyed out archived items everywhere
- ✅ Same user experience on every page

---

## 🚀 Next Actions

Priority order for remaining pages:
1. **Purchase Orders** - Simple: just add sortable & filtering
2. **Teams** - Check and update if needed
3. **Properties** - Check toolbar, add features
4. **Equipment** - Check toolbar, add features
5. **Customers** - Check and update
6. **Maintenance Plans** - Check table features
7. **Service Agreements** - Check all components
8. **Materials Inventory** - Create toolbar, update table
9. **Price Book** - Check and update

**Progress: 5/13 complete (38%)**
**Remaining work: ~8 pages, ~30-40 tool calls**

*Last updated: Current session*

