# Section Actions Button Standardization

## Overview

All collapsible sections across detail pages now have consistent action button styling and placement.

## Standard Button Format

### Design Specifications

```typescript
<Button
  size="sm"
  variant="outline"
  onClick={handleAction}
>
  <Plus className="mr-2 h-4 w-4" /> Action Label
</Button>
```

### Key Standards

1. **Size**: Always `size="sm"`
2. **Variant**: Always `variant="outline"`
3. **Icon**: 
   - Use `<Plus />` for add/create actions
   - Size: `className="mr-2 h-4 w-4"`
   - Position: Before label text
   - Spacing: `mr-2` (0.5rem margin-right)
4. **Placement**: In the `actions` prop of `UnifiedAccordionSection`, NOT inside content
5. **Label**: Clear action verb + noun (e.g., "Add Task", "Create Invoice", "Upload", "Add Note")

## ❌ Deprecated Patterns

### Non-Standard Styles (Don't Use)

```typescript
// ❌ BAD: Custom height/padding classes
<Button className="h-8 px-3 text-xs" size="sm" variant="secondary">

// ❌ BAD: Wrong icon size
<Plus className="mr-1.5 h-3.5 w-3.5" />

// ❌ BAD: Wrong variant
<Button size="sm" variant="secondary">

// ❌ BAD: Button inside content instead of actions prop
content: (
  <UnifiedAccordionContent>
    <div className="flex justify-between">
      <p>Description</p>
      <Button>Add Item</Button> // ❌ Wrong placement
    </div>
  </UnifiedAccordionContent>
)
```

### Correct Pattern

```typescript
// ✅ GOOD: Standard button in actions prop
{
  id: "section-name",
  title: "Section Title",
  icon: <Icon className="size-4" />,
  count: items.length,
  actions: (
    <Button
      onClick={handleAction}
      size="sm"
      variant="outline"
    >
      <Plus className="mr-2 h-4 w-4" /> Add Item
    </Button>
  ),
  content: (
    <UnifiedAccordionContent>
      {/* Section content */}
    </UnifiedAccordionContent>
  ),
}
```

## Updated Pages

### Job Details Page
✅ **File**: `src/components/work/job-details/job-page-content.tsx`

Sections with action buttons:
1. Ctrl+2 - **Appointments**: "Add Appointment"
2. Ctrl+3 - **Job Tasks & Checklist**: "Add Task" + "Load Template"
3. Ctrl+4 - **Invoices**: "Create Invoice"
4. Ctrl+5 - **Estimates**: "Create Estimate"
5. Ctrl+6 - **Purchase Orders**: "Create PO"
6. Ctrl+7 - **Photos & Documents**: "Upload"
7. Ctrl+8 - **Activity & Communications**: "Add Note"
8. Ctrl+9 - **Equipment Serviced**: "Add Equipment"

### Customer Details Page
✅ **File**: `src/components/customers/customer-page-content.tsx`

Sections with action buttons:
1. Ctrl+2 - **Properties**: "Add Property"
2. Ctrl+3 - **Jobs**: "New Job"
3. Ctrl+4 - **Invoices**: "New Invoice"
4. Ctrl+5 - **Equipment**: "Add Equipment"
5. Ctrl+6 - **Payment Methods**: "Add Payment Method"

## Multiple Actions Pattern

When a section needs multiple actions:

```typescript
actions: (
  <div className="flex items-center gap-2">
    <Button size="sm" variant="outline">
      <Plus className="mr-2 h-4 w-4" /> Primary Action
    </Button>
    <Button size="sm" variant="outline">
      Secondary Action
    </Button>
  </div>
),
```

**Example**: Job Tasks section has both "Add Task" and "Load Template"

## Visual Hierarchy

### Action Button Visibility

1. **Desktop**: Buttons visible on section header right side
2. **Mobile**: Buttons stack above section content (still accessible)
3. **Keyboard Navigation**: Works with ⌘+Number shortcuts

### Consistent Spacing

```typescript
// Gap between multiple buttons
<div className="flex items-center gap-2">

// Icon spacing within button
<Plus className="mr-2 h-4 w-4" />
```

## Button Labels

### Naming Conventions

| Action Type | Label Pattern | Examples |
|-------------|--------------|----------|
| Create New | "Create [Noun]" | "Create Invoice", "Create PO" |
| Add Item | "Add [Noun]" | "Add Task", "Add Equipment", "Add Note" |
| Upload | "Upload" | "Upload" (for photos/documents) |
| Generate | "[Verb] [Noun]" | "Load Template" |

### Label Guidelines

- **Be Specific**: "Add Appointment" not just "Add"
- **Use Action Verbs**: Create, Add, Upload, Generate
- **Keep Short**: 1-3 words maximum
- **Match Context**: Use terminology consistent with section title

## Implementation Checklist

When adding action buttons to a new section:

- [ ] Place in `actions` prop (not inside content)
- [ ] Use `size="sm"` and `variant="outline"`
- [ ] Include `<Plus />` icon with `className="mr-2 h-4 w-4"`
- [ ] Use clear, action-oriented label
- [ ] Wire up onClick handler
- [ ] Test keyboard shortcut works
- [ ] Verify mobile layout
- [ ] Check hover states

## Future Enhancements

Potential improvements:
- [ ] Dropdown menus for sections with many actions
- [ ] Bulk action support
- [ ] Quick action templates
- [ ] Permission-based button visibility
- [ ] Loading states for async actions

## Related Documentation

- [Keyboard Shortcuts](./KEYBOARD-SHORTCUTS.md) - ⌘+Number navigation
- [Unified Accordion](../src/components/ui/unified-accordion.tsx) - Component source
- [Detail Page Content Layout](./DETAIL-PAGE-TOOLBAR-SYSTEM.md) - Page structure

## Developer Notes

### Migration Path

To update existing sections:

1. Find button inside content
2. Move to `actions` prop
3. Update styling to standard format
4. Remove wrapper divs if no longer needed
5. Test all states (default, hover, focus, disabled)

### Code Review Checklist

When reviewing PRs with section actions:
- ✅ Buttons use standard styling
- ✅ Icons are correct size
- ✅ Buttons in actions prop, not content
- ✅ Labels are clear and concise
- ✅ onClick handlers are wired up
- ✅ No custom size/variant classes

