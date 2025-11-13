# Archive Buttons - Red Styling Update

## ✅ Complete

All archive buttons across the application now display in red (destructive variant) for consistency and clear visual indication of the action.

---

## Changes Summary

### Files Updated

#### 1. **Appointment Detail Toolbar**
**File**: `src/components/work/appointments/appointment-detail-toolbar-actions.tsx`

```typescript
<Button
  className="h-8 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
  onClick={() => setIsArchiveDialogOpen(true)}
  size="sm"
  variant="outline"
>
  <Archive className="size-3.5" />
  <span className="hidden lg:inline">Archive</span>
</Button>
```

**Styling**: Red border, red text, red hover background

---

#### 2. **Service Agreements Table**
**File**: `src/components/work/service-agreements-table.tsx`

```typescript
{
  label: "Archive",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds) => console.log("Archive:", selectedIds),
}
```

**Change**: Added `variant: "destructive"`

---

#### 3. **Materials Table**
**File**: `src/components/work/materials-table.tsx`

```typescript
{
  label: "Archive",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds) => console.log("Archive:", selectedIds),
}
```

**Change**: Added `variant: "destructive"`

---

#### 4. **Job Purchase Orders Table**
**File**: `src/components/work/job-details/job-purchase-orders-table.tsx`

```typescript
{
  label: "Archive Selected",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds: Set<string>) => {
    setSelectedIds(selectedIds);
    setShowArchiveDialog(true);
  },
}
```

**Change**: Added `variant: "destructive"`, removed duplicate `variant: "default"`

---

#### 5. **Job Estimates Table**
**File**: `src/components/work/job-details/job-estimates-table.tsx`

```typescript
{
  label: "Archive Selected",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds: Set<string>) => {
    setSelectedIds(selectedIds);
    setShowArchiveDialog(true);
  },
}
```

**Change**: Added `variant: "destructive"`, removed duplicate `variant: "default"`

---

#### 6. **Equipment Table**
**File**: `src/components/work/equipment-table.tsx`

```typescript
{
  label: "Archive",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds) => console.log("Archive:", selectedIds),
}
```

**Change**: Added `variant: "destructive"`

---

#### 7. **Maintenance Plans Table**
**File**: `src/components/work/maintenance-plans-table.tsx`

```typescript
{
  label: "Archive",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds) => console.log("Archive:", selectedIds),
}
```

**Change**: Added `variant: "destructive"`

---

#### 8. **Purchase Orders Table**
**File**: `src/components/work/purchase-orders-table.tsx`

```typescript
{
  label: "Archive",
  icon: <Archive className="h-4 w-4" />,
  variant: "destructive",
  onClick: (selectedIds) => console.log("Archive:", selectedIds),
}
```

**Change**: Added `variant: "destructive"`

---

#### 9. **Email View**
**File**: `src/components/communication/email-view.tsx`

```typescript
<Button className="text-destructive hover:text-destructive" size="sm" variant="ghost">
  <Archive className="mr-2 size-4" />
  Archive
</Button>
```

**Change**: Added `className="text-destructive hover:text-destructive"`

---

#### 10. **Import/Export Dropdown**
**File**: `src/components/data/import-export-dropdown.tsx`

```typescript
<DropdownMenuItem
  className="text-destructive focus:text-destructive"
  disabled={!hasSelection}
  onClick={() => handleBulkAction("archive")}
>
  <Archive className="mr-2 size-4" />
  <span>Archive Selected</span>
</DropdownMenuItem>
```

**Change**: Added `className="text-destructive focus:text-destructive"`

---

## Already Styled (No Changes Needed)

These components already had red/destructive styling:

### 1. **Job Detail Toolbar**
**File**: `src/components/work/job-details/job-detail-toolbar.tsx`

```typescript
<DropdownMenuItem
  className="text-destructive focus:text-destructive"
  onClick={() => setIsArchiveDialogOpen(true)}
>
  <Archive className="mr-2 size-3.5" />
  Archive Job
</DropdownMenuItem>
```

---

### 2. **Team Member Page Content**
**File**: `src/components/work/team-details/team-member-page-content.tsx`

```typescript
<Button
  aria-label={isArchived ? "Unarchive" : "Archive"}
  className="border-destructive/40 text-destructive hover:bg-destructive/10"
  disabled={isArchiving}
  onClick={() => setIsArchiveDialogOpen(true)}
  size="sm"
  variant="outline"
>
  <Archive className="size-4" />
  <span className="hidden sm:inline">
    {isArchived ? "Unarchive" : "Archive"}
  </span>
</Button>
```

---

### 3. **All Detail Page Toolbar Presets**
**File**: `src/components/layout/detail-page-toolbar-presets.tsx`

All archive actions already had `variant: "destructive"`:
- Job Detail Toolbar
- Customer Detail Toolbar
- Estimate Detail Toolbar
- Invoice Detail Toolbar
- Property Detail Toolbar
- Team Member Detail Toolbar
- Equipment Detail Toolbar
- Contract Detail Toolbar
- Purchase Order Detail Toolbar
- Payment Detail Toolbar
- Maintenance Plan Detail Toolbar
- Service Agreement Detail Toolbar

---

### 4. **Common Actions**
**File**: `src/components/layout/detail-page-toolbar.tsx`

```typescript
archive: (onClick: () => void): DetailToolbarContextAction => ({
  id: "archive",
  label: "Archive",
  icon: Archive,
  onClick,
  variant: "destructive",
  separatorBefore: true,
}),
```

---

### 5. **Tables with Destructive Variant**
These tables already had `variant: "destructive"` on their archive actions:
- `src/components/work/teams-table.tsx`
- `src/components/work/invoices-table.tsx`
- `src/components/work/jobs-table.tsx`
- `src/components/customers/properties-table.tsx`

---

### 6. **Job Notes Table**
**File**: `src/components/work/job-details/job-notes-table.tsx`

Archive icon already has red color:
```typescript
<Button
  className="size-8 p-0"
  onClick={() => handleArchiveNote(note.id)}
  size="sm"
  title="Archive note"
  variant="ghost"
>
  <Archive className="size-4 text-destructive" />
</Button>
```

---

## Visual Examples

### Before ❌
Archive buttons had inconsistent colors:
- Some grey (default/ghost variant)
- Some outline (default border color)
- Mixed styling across different components

### After ✅
All archive buttons are now red:

**Outline Button**:
```
┌─────────────────────┐
│ [Archive Icon] Archive │  ← Red text, red border
└─────────────────────┘
```

**Ghost Button**:
```
[Archive Icon] Archive  ← Red text, red hover background
```

**Dropdown Menu Item**:
```
[Archive Icon] Archive Job  ← Red text
```

**Bulk Action**:
```
[Archive Icon] Archive Selected  ← Red text in dropdown
```

---

## Destructive Variant Styling

The `destructive` variant from `src/components/ui/button.tsx`:

```typescript
destructive:
  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
```

For outline buttons with custom red styling:
```typescript
className="border-destructive/40 text-destructive hover:bg-destructive/10"
```

For ghost buttons with red text:
```typescript
className="text-destructive hover:text-destructive"
```

For dropdown items:
```typescript
className="text-destructive focus:text-destructive"
```

---

## Consistency Achieved

### Archive Actions Now All Use:

1. **Variant**: `destructive` (for bulk actions)
2. **className**: `text-destructive` (for buttons and menu items)
3. **Border**: `border-destructive/40` (for outline buttons)
4. **Hover**: `hover:bg-destructive/10` or `hover:text-destructive`

### Benefits

✅ **Visual Consistency** - All archive buttons look the same  
✅ **Clear Intent** - Red color signals destructive/cautionary action  
✅ **User Awareness** - Users understand this is a significant action  
✅ **Brand Alignment** - Follows destructive action patterns  
✅ **Better UX** - No confusion about what archive does  

---

## Testing Checklist

- [x] Appointment detail toolbar - Archive button is red
- [x] Service agreements table - Archive action is red
- [x] Materials table - Archive action is red
- [x] Job purchase orders table - Archive action is red
- [x] Job estimates table - Archive action is red
- [x] Equipment table - Archive action is red
- [x] Maintenance plans table - Archive action is red
- [x] Purchase orders table - Archive action is red
- [x] Email view - Archive button is red
- [x] Import/export dropdown - Archive menu item is red
- [x] Job detail toolbar - Archive already red
- [x] Team member page - Archive already red
- [x] All detail page presets - Archive already red
- [x] No linter errors

---

## Summary

**Total Files Updated**: 10  
**Total Archive Buttons Styled**: All  
**Variant Used**: `destructive` or custom red classes  
**Visual Result**: Consistent red coloring across all archive buttons  

**Result**: Archive buttons are now visually consistent and clearly communicate their destructive/cautionary nature! 🔴✅

