# Accordion Reordering - Quick Reference

## ✅ Feature Complete

All collapsible sections on detail pages can now be reordered via drag-and-drop, with per-user persistence.

---

## Quick Overview

### What It Does
- Users can drag and drop accordion sections to reorder them
- Order is automatically saved per-user (localStorage)
- Drag handle (⋮⋮) appears on hover
- Works on desktop, mobile, and keyboard

### Where It Works
- ✅ Job Details (`job-details`)
- ✅ Customer Details (`customer-details`)
- ✅ Property Details (`property-details`)

---

## User Experience

### How to Reorder

1. **Hover** over a section header
2. **Click and hold** the drag handle (⋮⋮) on the left
3. **Drag** the section up or down
4. **Release** to drop
5. **Auto-saved** instantly

### Visual Feedback

- **Hidden**: Drag handle invisible by default
- **Hover**: Drag handle appears (⋮⋮)
- **Dragging**: Section becomes semi-transparent with shadow
- **Cursor**: `grab` → `grabbing`

---

## Technical Quick Start

### Updated Components

#### 1. UnifiedAccordion
```typescript
<UnifiedAccordion
  sections={sections}
  storageKey="job-details" // Required for persistence
  enableReordering={true}  // Default: true
/>
```

#### 2. DetailPageContentLayout
```typescript
<DetailPageContentLayout
  customSections={sections}
  storageKey="job-details"
  enableReordering={true}
/>
```

### New Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `undefined` | Unique key for saving order |
| `enableReordering` | `boolean` | `true` | Enable drag-and-drop |

### Storage Format

**localStorage key**: `accordion-order-{storageKey}`

**Example**:
```json
{
  "accordion-order-job-details": [
    "customer",
    "appointments",
    "invoices",
    "estimates"
  ]
}
```

---

## Implementation Details

### Drag Handle
```typescript
<button
  {...attributes}
  {...listeners}
  className="touch-target flex cursor-grab items-center justify-center rounded px-1 opacity-0 transition-opacity hover:bg-muted active:cursor-grabbing group-hover:opacity-100"
  title="Drag to reorder"
  type="button"
>
  <GripVertical className="size-4 text-muted-foreground" />
</button>
```

### Features
- Uses `@dnd-kit` for drag-and-drop
- 8px activation distance (prevents accidental drags)
- Saves to localStorage immediately on drop
- Loads saved order on mount

---

## Accessibility

✅ Keyboard navigation (Tab, Arrow keys, Enter, Escape)  
✅ Screen reader friendly  
✅ Touch device support  
✅ 44px touch targets  
✅ Clear visual feedback  

---

## Key Files Modified

1. **`src/components/ui/unified-accordion.tsx`**
   - Added drag-and-drop support
   - Added `SortableSection` component
   - Added storage functions

2. **`src/components/layout/detail-page-content-layout.tsx`**
   - Added `storageKey` and `enableReordering` props
   - Passes props to `UnifiedAccordion`

3. **Detail Page Components**
   - `src/components/work/job-details/job-page-content.tsx`
   - `src/components/customers/customer-page-content.tsx`
   - `src/components/properties/property-details/property-page-content.tsx`

---

## Dependencies

Already installed (used by other components):
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

---

## Testing

### Manual Tests
- [x] Drag handle appears on hover
- [x] Sections reorder smoothly
- [x] Order persists on refresh
- [x] Keyboard navigation works
- [x] Touch devices work
- [x] No linter errors

### Browser Support
- [x] Chrome, Firefox, Safari, Edge (desktop)
- [x] Safari (iOS), Chrome (Android)

---

## Usage Examples

### Enable Reordering
```typescript
<DetailPageContentLayout
  customSections={sections}
  storageKey="my-page"
  enableReordering={true}
/>
```

### Disable Reordering
```typescript
<DetailPageContentLayout
  customSections={sections}
  enableReordering={false} // No drag handles
/>
```

### Reset Order (Future Enhancement)
```typescript
localStorage.removeItem('accordion-order-job-details');
window.location.reload();
```

---

## Future Enhancements

- [ ] Database storage for cross-device sync
- [ ] "Reset to default" button
- [ ] Preset layouts
- [ ] Drag preview indicator
- [ ] Animation on load

---

## Summary

**Before** ❌:
- Fixed section order
- No customization
- Same for all users

**After** ✅:
- Drag-and-drop reordering
- Per-user customization
- Auto-saved preferences
- Smooth, intuitive UX

**Result**: Users can organize detail pages to match their workflow! 🎯

For full documentation, see [ACCORDION-REORDERING.md](./ACCORDION-REORDERING.md)

