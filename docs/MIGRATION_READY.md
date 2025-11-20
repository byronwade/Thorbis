# Tables Ready for Migration

**Status:** Backups Created - Ready for Manual Migration
**Date:** 2025-11-18

---

## ✅ Migration Backups Created

The following table files have backup copies and are ready for migration:

### 1. invoices-table.tsx
- **Current size:** 535 lines
- **Backup:** `invoices-table.tsx.pre-migration-backup`
- **Entity:** invoices
- **Action:** archiveInvoice (from `/src/actions/invoices.ts`)
- **Estimated savings:** ~50 lines

### 2. estimates-table.tsx
- **Current size:** 561 lines
- **Backup:** `estimates-table.tsx.pre-migration-backup`
- **Entity:** estimates
- **Action:** archiveEstimate
- **Estimated savings:** ~55 lines

### 3. payments-table.tsx
- **Current size:** 429 lines
- **Backup:** `payments-table.tsx.pre-migration-backup`
- **Entity:** payments
- **Action:** archivePayment (from `/src/actions/payments.ts`)
- **Estimated savings:** ~40 lines

---

## 📋 Migration Checklist (Per Table)

For each table above, follow these steps:

### Step 1: Update Imports (Top of File)

**Remove:**
```typescript
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

**Add:**
```typescript
import { archiveInvoice } from "@/actions/invoices"; // Adjust for each table
import { useArchiveDialog } from "@/components/ui/archive-dialog-manager";
import { useTableActions } from "@/hooks/use-table-actions";
```

### Step 2: Replace State Management

**Find and remove:**
```typescript
const router = useRouter();
const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
const [itemToArchive, setItemToArchive] = useState<string | null>(null);
const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);

const handleRefresh = () => {
  router.refresh();
};
```

**Replace with:**
```typescript
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

// For bulk archive:
const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

const {
  openArchiveDialog: openBulkArchiveDialog,
  ArchiveDialogComponent: BulkArchiveDialogComponent
} = useArchiveDialog({
  onConfirm: async () => {
    let archived = 0;
    for (const id of selectedItemIds) {
      const result = await archiveInvoice(id);
      if (result.success) archived++;
    }
    if (archived > 0) handleRefresh();
  },
  title: `Archive ${selectedItemIds.size} Invoice(s)?`,
  description: `${selectedItemIds.size} invoice(s) will be archived.`,
});
```

### Step 3: Update Row Actions

**Find:**
```typescript
onClick: () => {
  setItemToArchive(invoice.id);
  setIsArchiveDialogOpen(true);
}
```

**Replace with:**
```typescript
onClick: () => openArchiveDialog(invoice.id)
```

### Step 4: Replace Dialog JSX (At Bottom)

**Find and remove (~60 lines):**
```typescript
<AlertDialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
  <AlertDialogContent>
    {/* ... all the dialog content ... */}
  </AlertDialogContent>
</AlertDialog>

<AlertDialog onOpenChange={setIsBulkArchiveOpen} open={isBulkArchiveOpen}>
  <AlertDialogContent>
    {/* ... all the bulk dialog content ... */}
  </AlertDialogContent>
</AlertDialog>
```

**Replace with (~2 lines):**
```typescript
<ArchiveDialogComponent />
<BulkArchiveDialogComponent />
```

### Step 5: Verify

```bash
# Check TypeScript
npx tsc --noEmit src/components/work/invoices-table.tsx

# Build
pnpm build

# Test in browser
npm run dev
# Navigate to the table and test archive functionality
```

---

## 🎯 Quick Reference

### Entity Type Mapping
| Table File | Entity Type | Archive Action | Import From |
|-----------|-------------|----------------|-------------|
| invoices-table.tsx | "invoices" | archiveInvoice | @/actions/invoices |
| estimates-table.tsx | "estimates" | archiveEstimate | @/actions/estimates |
| payments-table.tsx | "payments" | archivePayment | @/actions/payments |

### Example: Complete Migration (invoices-table.tsx)

**Before (69-71):**
```typescript
const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
const [itemToArchive, setItemToArchive] = useState<string | null>(null);
const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
```

**After:**
```typescript
const { handleRefresh } = useTableActions({ entityType: "invoices" });
const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

const { openArchiveDialog, ArchiveDialogComponent } = useArchiveDialog({
  onConfirm: async (id) => {
    const result = await archiveInvoice(id);
    if (result.success) handleRefresh();
  },
  title: "Archive Invoice?",
  description: "This invoice will be archived and can be restored later.",
});

const {
  openArchiveDialog: openBulkArchiveDialog,
  ArchiveDialogComponent: BulkArchiveDialogComponent
} = useArchiveDialog({
  onConfirm: async () => {
    let archived = 0;
    for (const id of selectedItemIds) {
      const result = await archiveInvoice(id);
      if (result.success) archived++;
    }
    if (archived > 0) handleRefresh();
  },
  title: `Archive ${selectedItemIds.size} Invoice(s)?`,
  description: `${selectedItemIds.size} invoice(s) will be archived.`,
});
```

---

## 📊 Expected Results

After migrating all 3 tables:

| Table | Before | After | Saved | % Reduction |
|-------|--------|-------|-------|-------------|
| jobs-table.tsx | 335 | 295 | 40 | 12% |
| invoices-table.tsx | 535 | ~485 | ~50 | ~9% |
| estimates-table.tsx | 561 | ~506 | ~55 | ~10% |
| payments-table.tsx | 429 | ~389 | ~40 | ~9% |
| **Total** | **1,860** | **~1,675** | **~185** | **~10%** |

---

## 🔍 Verification Steps

After each migration:

1. **TypeScript Check:**
   ```bash
   npx tsc --noEmit src/components/work/TABLENAME.tsx
   ```

2. **Build Verification:**
   ```bash
   pnpm build
   ```

3. **Runtime Testing:**
   - Start dev server
   - Navigate to the table
   - Test archive single item
   - Test bulk archive
   - Verify toast notifications
   - Check page refresh

4. **Restore from Backup if Needed:**
   ```bash
   cp invoices-table.tsx.pre-migration-backup invoices-table.tsx
   ```

---

## 📚 Reference Files

- **Pattern Example:** `/src/components/work/jobs-table.tsx` (already migrated)
- **Archive Hook:** `/src/components/ui/archive-dialog-manager.tsx`
- **Table Actions:** `/src/hooks/use-table-actions.ts`
- **Full Guide:** `/docs/WORK_ROUTES_REFACTORING_GUIDE.md`

---

## ⚡ Quick Start

```bash
# 1. Open the first table
code src/components/work/invoices-table.tsx

# 2. Open the reference (migrated example)
code src/components/work/jobs-table.tsx

# 3. Follow the checklist above

# 4. Verify
pnpm build
```

---

**Status:** Ready for migration - backups created, pattern proven
**Next Table:** invoices-table.tsx
**Estimated Time:** 5-10 minutes per table
**Risk:** Low (backups created, pattern proven with jobs-table)
