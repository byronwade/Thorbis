# Detail Page Toolbar System

**Comprehensive, feature-rich toolbar system for all detail pages with back navigation, status indicators, contextual actions, and perfect mobile responsiveness.**

---

## 📋 Overview

The Detail Page Toolbar System provides a unified, consistent toolbar for all entity detail pages (jobs, customers, estimates, invoices, properties, team members, equipment, etc.).

### Key Features

✅ **Back Button Navigation** - Always present, accessible
✅ **Entity Status Badge** - Visual status indicator
✅ **Primary Actions** - 1-3 most important actions, always visible
✅ **Secondary Actions** - Grouped buttons, hidden on mobile
✅ **Context Menu** - Ellipsis dropdown with entity-specific actions
✅ **Mobile-Responsive** - Progressive disclosure on small screens
✅ **Perfect Typography** - Consistent font sizes and weights
✅ **Proper Spacing** - Tailwind-based, visually balanced
✅ **Accessible** - Keyboard navigation, ARIA labels, tooltips
✅ **Type-Safe** - Full TypeScript support

---

## 🎨 Design System

### Typography

```
Title: font-semibold text-base md:text-lg (16px → 18px)
Subtitle: text-muted-foreground text-sm (14px)
Button Labels: font-medium text-sm (14px)
Badge: font-medium text-xs (12px)
Menu Items: text-sm (14px)
Menu Labels: font-medium text-xs uppercase (12px)
```

### Spacing

```
Container Padding: px-4 py-3 md:px-6 (16px/12px → 24px/12px)
Gap Between Elements: gap-1.5 (6px) for buttons
Gap Between Groups: gap-2 (8px) or gap-3 (12px)
Separators: h-6 (24px height)
Icon Size: size-4 (16px) for buttons, size-3.5 (14px) for menu
```

### Colors

```
Primary: bg-primary text-primary-foreground
Destructive: text-destructive border-destructive/20 hover:bg-destructive/10
Success: bg-green-500/5 text-green-700 border-green-500/20
Warning: bg-yellow-500/5 text-yellow-700 border-yellow-500/20
Muted Group: bg-muted/30 border
```

### Responsive Behavior

```
Mobile (<768px):
- Title truncates if too long
- Subtitle hidden if very long
- Secondary actions hidden (moved to context menu if needed)
- Button labels may be icon-only

Desktop (≥768px):
- Full title + subtitle
- All actions visible
- Button labels always shown
- More spacing and padding
```

---

## 📦 Components

### 1. DetailPageToolbar (Base Component)

**Location**: `src/components/layout/detail-page-toolbar.tsx`

The core toolbar component that renders the entire toolbar structure.

**Props**:
```typescript
{
  back: { href: string; label: string };
  title: string;
  subtitle?: string;
  status?: { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" };
  primaryActions?: DetailToolbarAction[];
  secondaryActions?: DetailToolbarAction[];
  contextActions?: DetailToolbarContextAction[];
  customContent?: ReactNode;
  className?: string;
}
```

### 2. Toolbar Presets (Entity-Specific Configurations)

**Location**: `src/components/layout/detail-page-toolbar-presets.tsx`

Pre-configured toolbar setups for each entity type:

- `getJobDetailToolbar()` - Jobs
- `getCustomerDetailToolbar()` - Customers
- `getEstimateDetailToolbar()` - Estimates
- `getInvoiceDetailToolbar()` - Invoices
- `getPropertyDetailToolbar()` - Properties
- `getTeamMemberDetailToolbar()` - Team Members
- `getEquipmentDetailToolbar()` - Equipment

### 3. Common Actions (Reusable Building Blocks)

**Included in base component** as `COMMON_ACTIONS`:

```typescript
COMMON_ACTIONS.edit(onClick)
COMMON_ACTIONS.send(onClick)
COMMON_ACTIONS.viewMode(onClick)
COMMON_ACTIONS.duplicate(onClick)
COMMON_ACTIONS.print(onClick)
COMMON_ACTIONS.download(onClick)
COMMON_ACTIONS.share(onClick)
COMMON_ACTIONS.email(onClick)
COMMON_ACTIONS.archive(onClick)
COMMON_ACTIONS.delete(onClick)
```

---

## 🚀 Usage

### Basic Example (Using Preset)

```typescript
"use client";

import { DetailPageToolbar } from "@/components/layout/detail-page-toolbar";
import { getJobDetailToolbar } from "@/components/layout/detail-page-toolbar-presets";

export function JobDetailsPage({ job }: { job: Job }) {
  const handleArchive = async () => {
    // Archive logic
  };

  const handleClone = () => {
    // Clone logic
  };

  const handleViewStatistics = () => {
    // Open statistics sheet
  };

  const toolbarConfig = getJobDetailToolbar({
    jobId: job.id,
    jobNumber: job.job_number,
    jobTitle: job.title,
    status: job.status,
    onArchive: handleArchive,
    onClone: handleClone,
    onViewStatistics: handleViewStatistics,
  });

  return (
    <div>
      <DetailPageToolbar {...toolbarConfig} />
      {/* Page content */}
    </div>
  );
}
```

### Advanced Example (Custom Configuration)

```typescript
"use client";

import { DetailPageToolbar } from "@/components/layout/detail-page-toolbar";
import { Send, Edit3, Archive, Mail, Download } from "lucide-react";

export function CustomDetailPage() {
  return (
    <DetailPageToolbar
      back={{
        href: "/dashboard/my-entities",
        label: "Back to My Entities",
      }}
      title="Entity #123"
      subtitle="Custom Entity Type"
      status={{
        label: "Active",
        variant: "success",
      }}
      primaryActions={[
        {
          id: "send",
          label: "Send",
          icon: Send,
          onClick: () => {},
          variant: "primary",
          tooltip: "Send to customer",
        },
        {
          id: "edit",
          label: "Edit",
          icon: Edit3,
          onClick: () => {},
          tooltip: "Edit details",
        },
      ]}
      secondaryActions={[
        {
          id: "download",
          label: "PDF",
          icon: Download,
          onClick: () => {},
          tooltip: "Download PDF",
        },
      ]}
      contextActions={[
        {
          id: "email",
          label: "Send Email",
          icon: Mail,
          onClick: () => {},
        },
        {
          id: "archive",
          label: "Archive",
          icon: Archive,
          onClick: () => {},
          variant: "destructive",
          separatorBefore: true,
        },
      ]}
    />
  );
}
```

### Integration with Unified Layout Config

Update your detail page breadcrumbs configuration:

```typescript
// In unified-layout-config.tsx
import { JobDetailBreadcrumbs } from "@/components/work/job-details/job-detail-breadcrumbs";

{
  pattern: ROUTE_PATTERNS.JOB_DETAILS,
  config: {
    structure: DETAIL_PAGE_STRUCTURE,
    header: DEFAULT_HEADER,
    toolbar: {
      show: true,
      breadcrumbs: <JobDetailBreadcrumbs />, // Your custom breadcrumbs
      // Actions are now handled by DetailPageToolbar inside the page component
    },
    sidebar: { show: false },
  },
  priority: 89,
}
```

---

## 🎯 Entity-Specific Configurations

### Jobs

**Primary Actions**:
- Statistics (view analytics)

**Secondary Actions**:
- Invoice (create from job)
- Estimate (create from job)
- Clone (duplicate job)

**Context Menu**:
- Export to CSV
- Print Job Details
- Share Job Link
- Archive Job
- Delete Job (optional)

**Status Variants**:
- Draft → secondary
- Scheduled → default
- In Progress → warning
- Completed → success
- Cancelled → destructive

---

### Customers

**Primary Actions**:
- Edit/View Mode Toggle

**Secondary Actions** (view mode only):
- Job (create new)
- Invoice (create new)
- Estimate (create new)

**Context Menu**:
- Send Email
- Export Customer Data
- Archive Customer
- Delete Customer (optional)

---

### Estimates

**Primary Actions**:
- Send (if draft/viewed)
- Convert to Invoice (if accepted)

**Secondary Actions**:
- PDF (download)
- Print

**Context Menu**:
- Duplicate Estimate
- Share Link
- Archive Estimate

**Status Variants**:
- Draft → secondary
- Sent → default
- Viewed → warning
- Accepted → success
- Declined → destructive
- Expired → destructive

---

### Invoices

**Primary Actions**:
- Send (if draft/sent/viewed)
- Record Payment (if not paid/void)

**Secondary Actions**:
- PDF (download)
- Print

**Context Menu**:
- Duplicate Invoice
- Share Payment Link
- Archive Invoice

**Status Variants**:
- Draft → secondary
- Sent → default
- Viewed → warning
- Partially Paid → warning
- Paid → success
- Overdue → destructive
- Void → destructive

---

### Properties

**Primary Actions**:
- New Job (create for property)

**Secondary Actions**:
- Schedule (view calendar)
- Equipment (view installed)

**Context Menu**:
- View on Map
- Export Property Data
- Archive Property

---

### Team Members

**Primary Actions**:
- Activate (if not active)

**Secondary Actions**:
- Email (send message)
- Schedule (view calendar)

**Context Menu**:
- Send Password Reset (managers only)
- Suspend Member
- Archive Member (managers only)

**Status Variants**:
- Active → success
- Invited → warning
- Suspended → destructive

---

### Equipment

**Primary Actions**:
- Create Service Job

**Secondary Actions**:
- Maintenance Log
- Parts (replacement parts)

**Context Menu**:
- Generate QR Code
- Export Equipment Data
- Archive Equipment

---

## 📱 Mobile Responsive Behavior

### Breakpoints

- **Mobile**: < 768px
- **Desktop**: ≥ 768px

### Mobile Optimizations

1. **Title/Subtitle**:
   - Title truncates with ellipsis if too long
   - Subtitle may be hidden on very small screens

2. **Primary Actions**:
   - Always visible
   - Labels may be icon-only on very small screens

3. **Secondary Actions**:
   - Hidden on mobile
   - Important secondary actions should be duplicated in context menu

4. **Context Menu**:
   - Always visible
   - Contains all actions including hidden secondary actions

5. **Spacing**:
   - Reduced padding on mobile (px-4 vs px-6)
   - Tighter gaps (gap-1.5)

---

## ♿ Accessibility

### Keyboard Navigation

- **Back Button**: `Tab` to focus, `Enter` to activate
- **All Buttons**: `Tab` to focus, `Enter`/`Space` to activate
- **Context Menu**: `Tab` to trigger, `Enter` to open, `Arrow Keys` to navigate, `Enter` to select

### ARIA Labels

- Back button has `sr-only` label with descriptive text
- Context menu trigger has `sr-only` label: "More actions"
- All icon-only buttons have tooltips for clarity

### Screen Reader Support

- Semantic HTML elements (`<header>`, `<nav>`, `<button>`)
- Proper heading hierarchy (`<h1>` for title)
- Status badges announced with role and variant

---

## 🎨 Customization

### Custom Actions

Create custom actions matching the type:

```typescript
const customAction: DetailToolbarAction = {
  id: "custom",
  label: "Custom Action",
  icon: MyIcon,
  onClick: handleCustom,
  variant: "primary",
  tooltip: "Do something custom",
  desktopOnly: false,
  disabled: false,
  loading: false,
};
```

### Custom Status Badge

```typescript
status: {
  label: "Custom Status",
  variant: "default" | "success" | "warning" | "destructive" | "secondary",
}
```

### Custom Context Menu Items

```typescript
const customContextAction: DetailToolbarContextAction = {
  id: "custom",
  label: "Custom Menu Item",
  icon: MyIcon,
  onClick: handleCustom,
  variant: "default" | "destructive",
  separatorBefore: true, // Add separator before this item
  disabled: false,
};
```

---

## 🧪 Testing Checklist

### Visual Testing

- [ ] Back button aligned correctly
- [ ] Title/subtitle hierarchy clear
- [ ] Status badge visible and correct color
- [ ] Primary actions prominent
- [ ] Secondary actions grouped properly
- [ ] Context menu icon visible
- [ ] Proper spacing between all elements
- [ ] No overlapping on mobile
- [ ] Tooltips appear on hover

### Functional Testing

- [ ] Back button navigates correctly
- [ ] All primary actions work
- [ ] All secondary actions work
- [ ] Context menu opens/closes
- [ ] All menu items work
- [ ] Loading states display correctly
- [ ] Disabled states prevent interaction
- [ ] Mobile menu shows hidden actions

### Responsive Testing

- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (desktop)
- [ ] Test at 1920px (large desktop)
- [ ] Title truncates properly
- [ ] Secondary actions hide on mobile
- [ ] Context menu always accessible

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces elements correctly
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Tooltips readable

---

## 📚 Examples

### Example 1: Job Detail Page

```typescript
const toolbarConfig = getJobDetailToolbar({
  jobId: "job-123",
  jobNumber: "J-2024-001",
  jobTitle: "HVAC Installation",
  status: "in-progress",
  onArchive: async () => {
    await archiveJob("job-123");
    router.push("/dashboard/work");
  },
  onClone: () => {
    router.push("/dashboard/work/new?cloneFrom=job-123");
  },
  onViewStatistics: () => {
    setStatisticsOpen(true);
  },
});

<DetailPageToolbar {...toolbarConfig} />
```

### Example 2: Customer Detail Page with Edit Mode

```typescript
const [isEditMode, setIsEditMode] = useState(false);

const toolbarConfig = getCustomerDetailToolbar({
  customerId: "cust-456",
  customerName: "John's Plumbing",
  isEditMode,
  onToggleEditMode: () => setIsEditMode(!isEditMode),
  onArchive: async () => {
    await archiveCustomer("cust-456");
    router.push("/dashboard/customers");
  },
});

<DetailPageToolbar {...toolbarConfig} />
```

### Example 3: Estimate with Conditional Actions

```typescript
const toolbarConfig = getEstimateDetailToolbar({
  estimateId: "est-789",
  estimateNumber: "E-2024-042",
  status: "accepted", // Determines which actions are shown
  onSend: async () => {
    await sendEstimate("est-789");
    toast.success("Estimate sent!");
  },
  onConvertToInvoice: () => {
    router.push(`/dashboard/work/invoices/new?estimateId=est-789`);
  },
  onArchive: async () => {
    await archiveEstimate("est-789");
  },
});

<DetailPageToolbar {...toolbarConfig} />
```

---

## 🔄 Migration Guide

### Before (Old Custom Toolbar)

```typescript
<div className="flex items-center justify-between p-4">
  <div className="flex items-center gap-2">
    <Link href="/back">
      <Button size="icon" variant="ghost">
        <ArrowLeft />
      </Button>
    </Link>
    <h1>{title}</h1>
    <Badge>{status}</Badge>
  </div>
  <div className="flex gap-2">
    <Button onClick={handleEdit}>Edit</Button>
    <Button onClick={handleSend}>Send</Button>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>{/* actions */}</DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
```

### After (Unified Toolbar)

```typescript
<DetailPageToolbar
  {...getJobDetailToolbar({
    jobId,
    jobNumber,
    status,
    onArchive: handleArchive,
    onClone: handleClone,
    onViewStatistics: handleViewStatistics,
  })}
/>
```

**Benefits**:
- 90% less code
- Consistent design across all pages
- Mobile-responsive automatically
- Accessible by default
- Type-safe configuration

---

## 🛠️ Development Tips

### Adding a New Entity Type

1. Create preset function in `detail-page-toolbar-presets.tsx`
2. Define entity-specific config type
3. Map status strings to badge variants
4. Determine primary actions (1-3 max)
5. List secondary actions (grouped)
6. Define context menu actions
7. Export preset function

### Testing New Toolbars

1. Test with all status values
2. Test with missing optional actions
3. Test mobile responsive behavior
4. Test keyboard navigation
5. Test screen reader announcements
6. Test with very long titles
7. Test loading/disabled states

---

## 📦 File Structure

```
src/components/layout/
├── detail-page-toolbar.tsx         # Base component (430 lines)
└── detail-page-toolbar-presets.tsx # Entity presets (520 lines)

docs/
└── DETAIL-PAGE-TOOLBAR-SYSTEM.md   # This documentation
```

---

## Version History

- **v1.0** (2025-01-11) - Initial unified detail page toolbar system
  - Base DetailPageToolbar component
  - 7 entity-specific presets
  - Mobile-responsive design
  - Full accessibility support
  - Comprehensive documentation
