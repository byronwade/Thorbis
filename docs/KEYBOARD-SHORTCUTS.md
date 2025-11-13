# Keyboard Shortcuts

## Detail Page Accordion Navigation

All detail pages now support keyboard shortcuts for quick navigation between sections.

### How to Use

Press **Ctrl + [Number]** to toggle accordion sections (cross-platform - works on Windows, Mac, and Linux):

| Shortcut | Action |
|----------|--------|
| Ctrl + 1 | Toggle first section |
| Ctrl + 2 | Toggle second section |
| Ctrl + 3 | Toggle third section |
| Ctrl + 4 | Toggle fourth section |
| Ctrl + 5 | Toggle fifth section |
| Ctrl + 6 | Toggle sixth section |
| Ctrl + 7 | Toggle seventh section |
| Ctrl + 8 | Toggle eighth section |
| Ctrl + 9 | Toggle ninth section |
| Ctrl + 0 | Toggle tenth section |

### Visual Indicators

Each accordion section header displays a keyboard shortcut badge:
- **Desktop**: Badge shows as semi-transparent (`Ctrl+1`, `Ctrl+2`, etc.)
- **On Hover**: Badge becomes fully opaque for better visibility
- **Mobile**: Hidden to save space (< 640px)
- **Tooltip**: Hover over the badge for a description
- **Cross-platform**: Always shows `Ctrl` for consistency

### Supported Pages

Keyboard shortcuts work on all detail pages:
- ✅ Jobs
- ✅ Customers
- ✅ Properties
- ✅ Equipment
- ✅ Purchase Orders
- ✅ Service Agreements
- ✅ Team Members
- ✅ Maintenance Plans
- ✅ Estimates
- ✅ Appointments
- ✅ Payments
- ✅ Invoices

### Implementation Details

**Component**: `src/components/ui/unified-accordion.tsx`

**Features**:
- Cross-platform: Uses Ctrl consistently on all operating systems
- Automatic numbering from top to bottom
- First 10 sections get shortcuts (Ctrl+1-9, Ctrl+0)
- Prevents browser default behavior for used shortcuts
- Event listeners automatically cleaned up on unmount

**Example Section Order** (Job Details):
1. Ctrl+1 - Customer & Property
2. Ctrl+2 - Appointments
3. Ctrl+3 - Job Tasks & Checklist
4. Ctrl+4 - Team Assignments
5. Ctrl+5 - Labor & Time Tracking
6. Ctrl+6 - Materials & Inventory
7. Ctrl+7 - Photos & Documentation
8. Ctrl+8 - Invoices & Payments
9. Ctrl+9 - Estimates
10. Ctrl+0 - Additional section (if present)

### User Experience

**Power User Benefits**:
- Rapid navigation without mouse
- Consistent shortcuts across all pages and platforms
- Visual feedback shows available shortcuts
- No need to memorize - badges display the shortcuts
- Cross-platform consistency (same Ctrl key on all OS)

**Discoverability**:
- Keyboard shortcut badges visible on every section
- Tooltips explain functionality
- Consistent placement (right side of section header)
- Monospace font for technical appearance
- Always shows `Ctrl` regardless of platform

### Developer Notes

To add keyboard shortcuts to a new page using accordions:
1. Use `UnifiedAccordion` component from `@/components/ui/unified-accordion`
2. Define sections in order (top to bottom = 1 to 9)
3. Shortcuts automatically assigned based on array order
4. No additional configuration needed

**Code Example**:
```typescript
import { UnifiedAccordion, UnifiedAccordionSection } from "@/components/ui/unified-accordion";

const sections: UnifiedAccordionSection[] = [
  { id: "details", title: "Details", content: <YourContent /> },      // Gets Ctrl+1
  { id: "tasks", title: "Tasks", content: <YourContent /> },          // Gets Ctrl+2
  { id: "attachments", title: "Attachments", content: <YourContent /> }, // Gets Ctrl+3
];

<UnifiedAccordion sections={sections} />
```

### Accessibility

- Keyboard shortcuts work with screen readers
- Focus management maintained
- Tooltips provide context
- Visual indicators are decorative (don't interfere with screen readers)

### Future Enhancements

Potential additions:
- [ ] Customizable shortcuts
- [ ] Keyboard shortcut cheat sheet modal
- [x] Support for 0 key (10th section) - **Completed**
- [x] Cross-platform consistency - **Completed** (uses Ctrl on all platforms)
- [ ] Global keyboard shortcut help (Ctrl+?)

