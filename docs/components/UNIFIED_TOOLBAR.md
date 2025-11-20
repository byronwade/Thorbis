# Unified AppToolbar - Complete Guide

## Overview

The **Unified AppToolbar** is a single, compact, minimalistic toolbar that intelligently merges all page controls into one clean row:

- **Navigation**: Sidebar trigger, back button
- **Context**: Title, breadcrumbs, subtitle
- **Data**: Inline stats (client-side with optimistic loading)
- **Controls**: Search, filters, pagination
- **Actions**: Buttons, menus, dropdowns

## Design Philosophy

✅ **Minimalistic**: No wasted space, clean separators
✅ **Flexible**: Sections auto-hide when not needed
✅ **Compact**: 56px height (h-14) maintains consistency
✅ **Responsive**: Intelligent layout adapts to screen size

## Layout Breakdown

### Desktop (≥1280px)
```
[☰] [Title] | [Stats] | [Search──────] [Pagination] | [Actions]
```

### Tablet (768px - 1279px)
```
[☰] [Search─────────────] [Pagination] | [Actions]
```
(Title hidden, stats collapsed)

### Mobile (<768px)
```
[☰] [Title] | [Actions]
```
(Search, stats, pagination hidden or in dropdown)

## Quick Start

### 1. Basic Toolbar (Title + Actions)

```tsx
// WorkSectionLayout config
"/dashboard/work/contracts": {
  toolbar: {
    show: true,
    title: "Contracts",
    subtitle: "Manage customer contracts",
    actions: <ContractToolbarActions />
  }
}
```

**Result**: `[☰] [Contracts] | [Actions]`

---

### 2. Toolbar with Stats

```tsx
// WorkSectionLayout config
"/dashboard/work/invoices": {
  toolbar: {
    show: true,
    title: "Invoices",
    subtitle: "Track and manage invoices",
    showInlineStats: true,
    stats: <WorkStatsInlineClient page="invoices" />,
    actions: <InvoicesToolbarActions />
  }
}
```

**Result**: `[☰] [Invoices] | [●●●●●] | [Actions]`

---

### 3. Toolbar with Search

```tsx
import { ToolbarSearch } from "@/components/ui/toolbar-search";

"/dashboard/work/customers": {
  toolbar: {
    show: true,
    title: "Customers",
    search: <ToolbarSearch placeholder="Search customers..." />,
    actions: <CustomersToolbarActions />
  }
}
```

**Result**: `[☰] [Customers] | [🔍 Search...] | [Actions]`

---

### 4. Full-Featured Toolbar (All Controls)

```tsx
import { ToolbarSearch } from "@/components/ui/toolbar-search";
import { ToolbarPagination } from "@/components/ui/toolbar-pagination";

"/dashboard/work/appointments": {
  toolbar: {
    show: true,
    title: "Appointments",
    subtitle: "Manage customer appointments",
    showInlineStats: true,
    stats: <WorkStatsInlineClient page="appointments" />,
    search: <ToolbarSearch placeholder="Search appointments..." />,
    pagination: <ToolbarPagination currentPage={1} pageSize={50} totalCount={10000} />,
    actions: <AppointmentsToolbarActions />
  }
}
```

**Result**: `[☰] [Appointments] | [●●●●●] | [🔍 Search...] [1-50 of 10,000 ◄►] | [Actions]`

---

## Components Reference

### ToolbarSearch

**Purpose**: Debounced search input that syncs with URL params

**Props**:
```tsx
type ToolbarSearchProps = {
  placeholder?: string;      // Search placeholder text
  defaultValue?: string;      // Initial search value
}
```

**Features**:
- ✅ 300ms debounce
- ✅ Auto-syncs with `?search=` URL param
- ✅ Resets pagination to page 1 on search
- ✅ Optimistic UI (shows pending state)
- ✅ Responsive width (w-48 sm:w-64 lg:w-96)

**Example**:
```tsx
<ToolbarSearch placeholder="Search by name, email, or phone..." />
```

---

### ToolbarPagination

**Purpose**: Compact pagination controls for large datasets

**Props**:
```tsx
type ToolbarPaginationProps = {
  currentPage: number;        // Current page number (1-indexed)
  pageSize: number;           // Items per page
  totalCount: number;         // Total number of items
}
```

**Features**:
- ✅ Shows range: "1-50 of 10,000"
- ✅ Auto-syncs with `?page=` URL param
- ✅ Optimistic navigation
- ✅ Keyboard shortcuts (arrow keys)
- ✅ Disabled state when at boundaries

**Example**:
```tsx
<ToolbarPagination
  currentPage={Number(searchParams?.page) || 1}
  pageSize={50}
  totalCount={appointments.length}
/>
```

---

### WorkStatsInlineClient

**Purpose**: Client-side stats with optimistic loading skeleton

**Props**:
```tsx
type WorkStatsInlineClientProps = {
  page: string;  // Route identifier: "appointments", "invoices", etc.
}
```

**Features**:
- ✅ Optimistic loading skeleton (5 animated placeholders)
- ✅ Fetches from `/api/work-stats/[page]`
- ✅ Smooth transition to real stats
- ✅ Auto-hides if no stats available

**Supported Pages**:
- `appointments`, `jobs`, `invoices`, `contracts`, `estimates`
- `payments`, `equipment`, `materials`, `purchase-orders`
- `team`, `vendors`

**Example**:
```tsx
<WorkStatsInlineClient page="appointments" />
```

---

## Advanced Patterns

### Pattern 1: Dynamic Search Placeholder

```tsx
const getSearchPlaceholder = (pathname: string) => {
  const placeholders: Record<string, string> = {
    "/dashboard/work/customers": "Search customers by name, email, or phone...",
    "/dashboard/work/jobs": "Search jobs by title, customer, or status...",
    "/dashboard/work/invoices": "Search invoices by number, customer, or amount...",
  };
  return placeholders[pathname] || "Search...";
};

// In WorkSectionLayout
search: <ToolbarSearch placeholder={getSearchPlaceholder(pathname)} />
```

---

### Pattern 2: Conditional Pagination

```tsx
// Only show pagination if total count is known and > page size
pagination: totalCount > pageSize ? (
  <ToolbarPagination
    currentPage={currentPage}
    pageSize={pageSize}
    totalCount={totalCount}
  />
) : null
```

---

### Pattern 3: Server-Side Search Params

```tsx
// page.tsx
export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.search || "";

  const customers = await getCustomers({
    page: currentPage,
    search: searchQuery,
  });

  // Pass to layout via WorkSectionLayout
  return <CustomersData customers={customers} />;
}
```

---

## Migration Guide

### Before (Multiple Toolbars)

```tsx
// ❌ OLD - Duplicate toolbars, inconsistent layout
<div className="sticky top-0 bg-background border-b">
  <div className="flex items-center justify-between p-4">
    <h1>Appointments</h1>
    <div className="flex gap-2">
      <Button>New</Button>
    </div>
  </div>
</div>

<div className="border-b p-4">
  <input type="text" placeholder="Search..." />
</div>

<div className="flex items-center gap-2 p-2">
  {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
</div>
```

### After (Unified Toolbar)

```tsx
// ✅ NEW - Single unified toolbar
// WorkSectionLayout config
"/dashboard/work/appointments": {
  toolbar: {
    show: true,
    title: "Appointments",
    showInlineStats: true,
    stats: <WorkStatsInlineClient page="appointments" />,
    search: <ToolbarSearch placeholder="Search appointments..." />,
    pagination: <ToolbarPagination {...paginationProps} />,
    actions: <AppointmentsToolbarActions />
  }
}
```

---

## Responsive Behavior

| Element | Desktop (≥1280px) | Tablet (768-1279px) | Mobile (<768px) |
|---------|-------------------|---------------------|-----------------|
| Sidebar Trigger | ✅ Visible | ✅ Visible | ✅ Visible |
| Title | ✅ Visible | ⚠️ Hidden if search | ✅ Visible |
| Subtitle | ✅ Visible | ⚠️ Hidden if search | ❌ Hidden |
| Stats | ✅ Visible | ❌ Hidden | ❌ Hidden |
| Search | ✅ Full width (384px) | ✅ Flexible width | ✅ Full width |
| Pagination | ✅ Visible | ✅ Visible | ❌ Hidden |
| Actions | ✅ Visible | ✅ Visible | ✅ Visible |

---

## Performance Considerations

### 1. Stats Loading
- **Skeleton First**: Instant skeleton prevents layout shift
- **Optimistic Loading**: Page remains interactive while stats load
- **API Route**: `/api/work-stats/[page]` caches stats server-side

### 2. Search Debouncing
- **300ms Debounce**: Prevents excessive URL updates
- **URL Sync**: Maintains shareable URLs
- **Reset Pagination**: Automatically resets to page 1

### 3. Pagination
- **Optimistic Navigation**: Instant UI feedback
- **URL State**: Maintains browser history
- **Scroll Preservation**: `scroll: false` prevents page jump

---

## Troubleshooting

### Issue: Stats not showing

**Solution**: Ensure both props are set:
```tsx
showInlineStats: true,  // ✅ Required
stats: <WorkStatsInlineClient page="appointments" />  // ✅ Required
```

### Issue: Search not updating URL

**Solution**: Verify Next.js routing context:
```tsx
// Must be in a client component with router
"use client";
import { useRouter, useSearchParams } from "next/navigation";
```

### Issue: Pagination shows wrong range

**Solution**: Check 1-indexed page numbers:
```tsx
// ✅ Correct
const currentPage = Number(searchParams?.page) || 1;

// ❌ Wrong
const currentPage = Number(searchParams?.page) || 0;
```

---

## Best Practices

1. **Always use ToolbarConfig** - Never create custom toolbars
2. **Keep actions minimal** - Max 3-4 buttons in toolbar
3. **Use placeholders wisely** - Be specific: "Search by name..." not "Search..."
4. **Handle empty states** - Hide pagination if `totalCount === 0`
5. **Test responsive** - Verify layout at 768px, 1024px, 1280px breakpoints

---

## Future Enhancements

- [ ] Filter dropdown component
- [ ] Bulk actions toolbar mode
- [ ] Keyboard shortcuts (Cmd+K for search)
- [ ] Export/import buttons
- [ ] View mode switcher (table/grid/kanban)

---

## Related Documentation

- [WorkStatsInlineClient](/docs/components/WORK_STATS.md)
- [WorkSectionLayout](/docs/layout/WORK_SECTION_LAYOUT.md)
- [ToolbarConfig Type](/src/lib/layout/unified-layout-config.tsx)

---

**Last Updated**: November 18, 2025
**Version**: 2.0.0
**Author**: Stratos Development Team
