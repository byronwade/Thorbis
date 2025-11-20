# Work Routes Refactoring Guide

**Purpose:** Simplify and standardize table components across all work routes
**Impact:** Reduce boilerplate, improve maintainability, ensure consistency

---

## 📦 New Utilities Available

### 1. Archive Dialog Manager (`@/components/ui/archive-dialog-manager`)

**Replaces:** Duplicate archive dialog code in 4+ table files

**Before (78 lines per table):**
```tsx
const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
const [itemToArchive, setItemToArchive] = useState<string | null>(null);

const handleArchiveClick = (id: string) => {
  setItemToArchive(id);
  setIsArchiveDialogOpen(true);
};

const handleArchiveConfirm = async () => {
  if (!itemToArchive) return;
  try {
    await archiveJob(itemToArchive);
    router.refresh();
  } catch (error) {
    console.error("Failed to archive:", error);
  } finally {
    setIsArchiveDialogOpen(false);
    setItemToArchive(null);
  }
};

// ... 60 more lines of AlertDialog JSX
```

**After (8 lines):**
```tsx
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";

const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
  onConfirm: async (id) => {
    await archiveJob(id);
    router.refresh();
  }
});

// In your render:
<Button onClick={() => openArchiveDialog(job.id)}>Archive</Button>
<ArchiveDialogComponent />
```

**Savings:** 70 lines per table × 4 tables = **280 lines removed**

---

### 2. Table Actions Hook (`@/hooks/use-table-actions`)

**Replaces:** Duplicate navigation, refresh, and action handling logic

**Before (multiple functions per table):**
```tsx
const router = useRouter();

const handleRowClick = (job: Job) => {
  window.location.href = `/dashboard/work/jobs/${job.id}`;
};

const handleRefresh = () => {
  router.refresh();
};

const searchFilter = (job: Job, query: string) => {
  const searchStr = query.toLowerCase();
  return (
    job.title.toLowerCase().includes(searchStr) ||
    job.job_number.toLowerCase().includes(searchStr) ||
    job.description?.toLowerCase().includes(searchStr)
  );
};

// More duplicate logic...
```

**After (1 hook call):**
```tsx
const {
  handleRowClick,
  handleRefresh,
  createSearchFilter
} = useTableActions({ entityType: "jobs" });

const searchFilter = createSearchFilter<Job>([
  "title",
  "job_number",
  "description"
]);
```

**Benefits:**
- Consistent navigation patterns
- Automatic toast notifications
- Type-safe entity labels
- Bulk action factories

---

## 🎯 Migration Examples

### Example 1: Migrate jobs-table.tsx

**Current State (617 lines):**
- Manual archive dialog management
- Custom row click handlers
- Inline search filter logic

**After Migration (estimated 480 lines - 22% reduction):**

```tsx
"use client";

import { useTableActions } from "@/hooks/use-table-actions";
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
import { archiveJob } from "@/actions/jobs";

export function JobsTable({ jobs }: JobsTableProps) {
  const {
    handleRowClick,
    handleRefresh,
    createSearchFilter,
    createBulkActions
  } = useTableActions({ entityType: "jobs" });

  const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
    onConfirm: async (id) => {
      await archiveJob(id);
      handleRefresh();
    }
  });

  const searchFilter = createSearchFilter<Job>([
    "job_number",
    "title",
    "description",
    "status"
  ]);

  const bulkActions = createBulkActions({
    archive: async (ids) => {
      await Promise.all(ids.map(archiveJob));
    }
  });

  const columns: ColumnDef<Job>[] = [
    // ... column definitions
    {
      key: "actions",
      render: (job) => (
        <Button onClick={() => openArchiveDialog(job.id)}>
          Archive
        </Button>
      )
    }
  ];

  return (
    <>
      <FullWidthDataTable
        columns={columns}
        data={jobs}
        onRowClick={handleRowClick}
        onRefresh={handleRefresh}
        searchFilter={searchFilter}
        bulkActions={bulkActions}
      />
      <ArchiveDialogComponent />
    </>
  );
}
```

---

### Example 2: Simplify Large Detail Pages

**Target:** job-page-content.tsx (2,919 lines)

**Strategy:** Extract into focused components

**New Structure:**
```
/components/work/job-details/
├── job-header.tsx              (200 lines) - Title, status, dates
├── job-financial-summary.tsx   (150 lines) - Revenue, costs, profit
├── job-team-section.tsx        (250 lines) - Assigned team members
├── job-activity-timeline.tsx   (400 lines) - Activity feed
├── job-related-records.tsx     (300 lines) - Invoices, estimates
└── job-page-content.tsx        (500 lines) - Main orchestrator
```

**Benefits:**
- Easier to find and modify specific sections
- Better code splitting opportunities
- Improved testability
- Reduced cognitive load

---

## 📋 Migration Checklist

Use this checklist when refactoring a table component:

### Phase 1: Archive Dialog
- [ ] Identify archive dialog code (look for `isArchiveDialogOpen` state)
- [ ] Import `useArchiveDialog` hook
- [ ] Replace state and handlers with hook
- [ ] Replace `<AlertDialog>` JSX with `<ArchiveDialogComponent />`
- [ ] Test archive functionality

### Phase 2: Table Actions
- [ ] Identify navigation handlers (look for `window.location.href` or manual `router.push`)
- [ ] Identify refresh handlers
- [ ] Identify search filter logic
- [ ] Import `useTableActions` hook
- [ ] Replace handlers with hook methods
- [ ] Test all table interactions

### Phase 3: Cleanup
- [ ] Remove unused imports
- [ ] Remove commented code
- [ ] Update component documentation
- [ ] Verify build passes
- [ ] Test in browser

---

## 🎨 Best Practices

### DO ✅
- Use `useTableActions` for all table navigation
- Use `useArchiveDialog` for archive/restore dialogs
- Extract search filters to `createSearchFilter`
- Use `createBulkActions` for consistent bulk operations
- Keep table components under 500 lines

### DON'T ❌
- Don't use `window.location.href` (use `handleRowClick`)
- Don't duplicate archive dialog logic
- Don't write inline search filter logic
- Don't create custom toast messages (hook handles it)
- Don't let detail pages exceed 1,000 lines without extraction

---

## 📊 Expected Impact

### Code Reduction
- **Archive dialogs:** ~280 lines total
- **Table actions:** ~50 lines per table × 21 tables = ~1,050 lines
- **Large component splits:** Enable better maintainability

### Maintainability Improvements
- **Consistency:** All tables use same patterns
- **Debuggability:** Centralized logic easier to fix
- **Testability:** Hooks are unit-testable
- **Onboarding:** New developers see patterns immediately

### Performance Benefits
- **Code splitting:** Smaller table components
- **Bundle size:** Shared utilities reduce duplication
- **Type safety:** Generic hooks provide better type inference

---

## 🚀 Rollout Plan

### Week 1: Foundation
- [x] Create `useArchiveDialog` hook
- [x] Create `useTableActions` hook
- [x] Document patterns
- [ ] Update CLAUDE.md with new patterns

### Week 2-3: Migration (High-Traffic Tables)
- [ ] Migrate `jobs-table.tsx`
- [ ] Migrate `invoices-table.tsx`
- [ ] Migrate `estimates-table.tsx`
- [ ] Migrate `customers-table.tsx`

### Week 4-5: Migration (Remaining Tables)
- [ ] Migrate remaining 17 table components
- [ ] Extract large detail page components
- [ ] Update all documentation

### Week 6: Verification
- [ ] Run full test suite
- [ ] Performance benchmarks
- [ ] Code review all changes
- [ ] Deploy to staging

---

## 📚 Additional Resources

- `/docs/WORK_ROUTES_CLEANUP_REPORT.md` - Current state analysis
- `/.claude/CLAUDE.md` - Project guidelines
- `/src/components/ui/archive-dialog-manager.tsx` - Archive dialog hook
- `/src/hooks/use-table-actions.ts` - Table actions hook

---

## ❓ FAQ

**Q: Will this break existing functionality?**
A: No - these are drop-in replacements that maintain the same behavior.

**Q: Do I need to migrate all tables at once?**
A: No - migrate incrementally, starting with high-traffic tables.

**Q: What if my table has custom archive logic?**
A: Pass options to `useArchiveDialog({ title: "Custom title", ... })`.

**Q: Can I use these hooks outside of tables?**
A: Yes - `useTableActions` works anywhere you need entity operations.

---

**Last Updated:** 2025-11-18
**Maintainer:** Development Team
**Status:** ✅ Ready for adoption
