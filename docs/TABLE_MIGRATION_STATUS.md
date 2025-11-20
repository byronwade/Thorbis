# Table Migration Status

**Date:** 2025-11-18
**Scope:** Migrate work route tables to use new utility hooks
**Goal:** Reduce code duplication and improve maintainability

---

## ✅ Completed Migrations

### 1. jobs-table.tsx
- **Before:** 335 lines
- **After:** 295 lines
- **Saved:** 40 lines (-12%)
- **Changes:**
  - ✅ Replaced manual AlertDialog state with `useArchiveDialog` hook
  - ✅ Integrated `useTableActions` hook for refresh handling
  - ✅ Removed 60+ lines of boilerplate dialog JSX
  - ✅ Cleaner, more maintainable code structure

---

## 📋 Remaining Migrations

The following tables still have duplicate archive dialog code that can be migrated using the same pattern:

### High Priority (Have Archive Dialogs)
1. **invoices-table.tsx** - Similar structure to jobs-table
2. **estimates-table.tsx** - Similar structure to jobs-table
3. **payments-table.tsx** - Has archive functionality
4. **properties-table.tsx** - Has archive functionality

### Medium Priority (No Archive Dialogs, but can benefit from table actions)
- contracts-table.tsx
- maintenance-plans-table.tsx
- service-agreements-table.tsx
- purchase-orders-table.tsx
- materials-table.tsx
- teams-table.tsx
- equipment-table.tsx

---

## 🔧 Migration Pattern

### Step 1: Add New Imports
```typescript
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
import { useTableActions } from "@/hooks/use-table-actions";
import { archiveEntity } from "@/actions/entity"; // Adjust for each table
```

### Step 2: Remove Old Imports
```typescript
// REMOVE:
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
```

### Step 3: Replace State Management
```typescript
// BEFORE:
const router = useRouter();
const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
const [itemToArchive, setItemToArchive] = useState<string | null>(null);

const handleRefresh = () => {
  router.refresh();
};

// AFTER:
const { handleRefresh } = useTableActions({ entityType: "invoices" });

const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
  onConfirm: async (id) => {
    const result = await archiveInvoice(id);
    if (result.success) {
      handleRefresh();
    }
  },
  title: "Archive Invoice?",
  description: "This invoice will be archived and can be restored later.",
});
```

### Step 4: Update Row Actions
```typescript
// BEFORE:
onClick: () => {
  setItemToArchive(invoice.id);
  setIsArchiveDialogOpen(true);
}

// AFTER:
onClick: () => openArchiveDialog(invoice.id)
```

### Step 5: Replace Dialog JSX
```typescript
// BEFORE: (60+ lines)
<AlertDialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Archive Invoice?</AlertDialogTitle>
      <AlertDialogDescription>
        This invoice will be archived...
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          if (itemToArchive) {
            const result = await archiveInvoice(itemToArchive);
            if (result.success) {
              router.refresh();
            }
          }
        }}
      >
        Archive
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// AFTER: (1 line)
<ArchiveDialogComponent />
```

---

## 📊 Projected Impact

### Code Reduction
- **4 tables with archive dialogs:** ~160 lines saved (40 lines each)
- **11 tables with table actions:** ~220 lines saved (20 lines each)
- **Total projected savings:** ~380 lines

### Maintainability Improvements
- **Consistency:** All tables use same patterns
- **Bug Fixes:** Fix once in hook, benefits all tables
- **Features:** Add features to hook, all tables get them
- **Testing:** Test hooks once, confidence in all tables

### Developer Experience
- **Faster Development:** No need to copy/paste dialog code
- **Clearer Intent:** Hook names make purpose obvious
- **Less Cognitive Load:** Less code to understand
- **Better Onboarding:** New devs see patterns immediately

---

## 🚦 Verification Checklist

For each migrated table, verify:
- [ ] TypeScript compiles without errors
- [ ] Archive dialog opens on button click
- [ ] Archive action executes successfully
- [ ] Page refreshes after archive
- [ ] Toast notifications appear
- [ ] Bulk archive works (if applicable)
- [ ] No console errors in browser
- [ ] UI looks identical to before

---

## 📝 Notes

### For Bulk Archive
If a table has bulk archive functionality, create a second dialog instance:

```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const {
  openArchiveDialog: openBulkDialog,
  ArchiveDialogComponent: BulkDialogComponent
} = useArchiveDialog({
  onConfirm: async () => {
    let archived = 0;
    for (const id of selectedIds) {
      const result = await archiveInvoice(id);
      if (result.success) archived++;
    }
    if (archived > 0) handleRefresh();
  },
  title: `Archive ${selectedIds.size} Items?`,
  description: `${selectedIds.size} items will be archived.`,
});
```

### Entity Types Supported
The `useTableActions` hook supports these entity types:
- jobs
- invoices
- estimates
- payments
- contracts
- appointments
- equipment
- maintenance-plans
- service-agreements
- purchase-orders
- properties
- customers

---

## 🎯 Next Steps

1. **Migrate invoices-table.tsx** (highest traffic after jobs)
2. **Migrate estimates-table.tsx**
3. **Migrate payments-table.tsx**
4. **Migrate properties-table.tsx**
5. **Migrate remaining tables** (as time permits)
6. **Run full test suite** after each migration
7. **Deploy to staging** after all migrations complete
8. **Monitor for issues** in production

---

## 📚 Related Documentation

- `/docs/WORK_ROUTES_CLEANUP_REPORT.md` - Initial cleanup analysis
- `/docs/WORK_ROUTES_REFACTORING_GUIDE.md` - Comprehensive refactoring guide
- `/src/components/ui/archive-dialog-manager.tsx` - Archive dialog hook implementation
- `/src/hooks/use-table-actions.ts` - Table actions hook implementation

---

**Status:** ✅ Foundation Complete - Ready for Incremental Migration
**Next Migration:** invoices-table.tsx
**Last Updated:** 2025-11-18
