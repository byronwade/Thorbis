# Route-Based Toolbar Configuration System

## Overview

The toolbar system automatically configures itself based on the current route, displaying page-specific titles and action buttons without requiring individual pages to manage their own toolbar content.

## Architecture

### Key Components

1. **[toolbar-config.tsx](src/lib/toolbar-config.tsx)** - Central configuration file
   - Defines toolbar content for each route
   - Uses React components for actions
   - Supports hierarchical route matching

2. **[app-toolbar.tsx](src/components/layout/app-toolbar.tsx)** - Toolbar component
   - Reads current route via `usePathname()`
   - Automatically fetches configuration
   - Renders consistent toolbar layout

3. **[layout.tsx](src/app/(dashboard)/layout.tsx)** - Dashboard layout
   - Renders AppToolbar once for all pages
   - Controlled by `showToolbar` in layout config

## How It Works

### 1. Define Toolbar Configuration

In [toolbar-config.tsx](src/lib/toolbar-config.tsx):

```tsx
export const toolbarConfigs: Record<string, ToolbarConfig> = {
  "/dashboard/communication": {
    title: "Communications",
    actions: (
      <>
        <Button size="sm" variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <Button size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </>
    ),
  },
  // Add more routes...
};
```

### 2. Route Matching Logic

The `getToolbarConfig()` function matches routes hierarchically:

```tsx
// Exact match first
"/dashboard/communication" → Returns communication config

// Falls back to parent routes
"/dashboard/communication/email" → Tries exact match, then "/dashboard/communication"

// No match returns undefined → Shows minimal toolbar (just SidebarTrigger)
"/dashboard/unknown" → undefined
```

### 3. Automatic Rendering

AppToolbar automatically:
- Detects current route
- Fetches matching config
- Renders title and actions
- Shows minimal version if no config found

## Configuration Format

```tsx
type ToolbarConfig = {
  title: string;           // Page title (required)
  actions?: ReactNode;     // Action buttons (optional)
  showSearch?: boolean;    // Reserved for future use
};
```

## Pre-configured Routes

### Communication Routes

| Route | Title | Actions |
|-------|-------|---------|
| `/dashboard/communication` | Communications | Filters, Compose |
| `/dashboard/communication/email` | Company Email | Filters, Compose |
| `/dashboard/communication/calls` | Phone System | New Call |
| `/dashboard/communication/sms` | Text Messages | Search, New Message |
| `/dashboard/communication/tickets` | Support Tickets | New Ticket |

### Main Dashboard Routes

| Route | Title | Actions |
|-------|-------|---------|
| `/dashboard` | Dashboard | None |
| `/dashboard/work` | Work | None |
| `/dashboard/schedule` | Schedule | None |
| `/dashboard/customers` | Customers | None |
| `/dashboard/finances` | Finances | None |
| `/dashboard/marketing` | Marketing | None |
| `/dashboard/automation` | Automation | None |
| `/dashboard/reports` | Reports | None |
| `/dashboard/ai` | AI Assistant | None |
| `/dashboard/settings` | Settings | None |

## Adding New Routes

### Step 1: Add Configuration

Edit [toolbar-config.tsx](src/lib/toolbar-config.tsx):

```tsx
export const toolbarConfigs: Record<string, ToolbarConfig> = {
  // ... existing configs

  "/dashboard/invoices": {
    title: "Invoices",
    actions: (
      <>
        <Button size="sm" variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </>
    ),
  },
};
```

### Step 2: Import Required Icons

At the top of [toolbar-config.tsx](src/lib/toolbar-config.tsx):

```tsx
import { Filter, Mail, Plus, Search } from "lucide-react";
```

### Step 3: Test

Navigate to `/dashboard/invoices` - toolbar should automatically update.

## Page Configuration

Pages only need to configure layout properties (width, padding, etc.):

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function InvoicesPage() {
  usePageLayout({
    maxWidth: "full",     // Full width for data tables
    padding: "none",      // No padding
    gap: "none",          // No gap
    showToolbar: true,    // Show toolbar (default)
  });

  return (
    <div>
      {/* Page content - no toolbar code needed */}
    </div>
  );
}
```

**Note**: Toolbar content is automatically configured via route matching, not page config.

## Hiding the Toolbar

If a page needs no toolbar:

```tsx
usePageLayout({
  showToolbar: false,  // Hides toolbar completely
});
```

## Design Patterns

### Pattern 1: Action Buttons Only

```tsx
{
  title: "Page Title",
  actions: (
    <Button size="sm">
      <Plus className="mr-2 h-4 w-4" />
      New Item
    </Button>
  ),
}
```

### Pattern 2: Multiple Action Buttons

```tsx
{
  title: "Page Title",
  actions: (
    <>
      <Button size="sm" variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
    </>
  ),
}
```

### Pattern 3: No Actions

```tsx
{
  title: "Page Title",
  // actions omitted
}
```

## Benefits

1. **Centralized Configuration** - All toolbar configs in one file
2. **Automatic Updates** - Toolbar changes as user navigates
3. **Type Safety** - TypeScript ensures correct configuration
4. **Consistent UI** - All toolbars follow same design pattern
5. **Easy Maintenance** - Add/update routes in single location
6. **No Duplication** - Pages don't manage toolbar content

## HTML Structure

### With Configuration

```html
<header class="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur">
  <div class="flex h-14 items-center gap-4 px-6">
    <SidebarTrigger class="-ml-1" />
    <h1 class="font-semibold text-lg">Communications</h1>
    <div class="ml-auto flex items-center gap-2">
      <!-- Action buttons here -->
    </div>
  </div>
</header>
```

### Without Configuration (Minimal)

```html
<header class="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur">
  <div class="flex h-14 items-center gap-4 px-6">
    <SidebarTrigger class="-ml-1" />
    <!-- No title or actions -->
  </div>
</header>
```

## Migration from Old System

### Before (Props-based)

```tsx
// Old system - passed props from page to toolbar
usePageLayout({
  toolbarTitle: "Communications",
  toolbarActions: <Button>...</Button>,
});
```

### After (Route-based)

```tsx
// New system - configured in toolbar-config.tsx
// Page only configures layout, not toolbar content
usePageLayout({
  maxWidth: "full",
  padding: "none",
});
```

## Troubleshooting

### Toolbar not showing expected content

1. Check route path matches exactly in `toolbarConfigs`
2. Verify route starts with `/dashboard`
3. Check parent route config (hierarchical matching)
4. Ensure `showToolbar: true` in page's `usePageLayout()`

### Action buttons not appearing

1. Verify `actions` property is defined in config
2. Check for JSX syntax errors in action buttons
3. Ensure required icons are imported
4. Check console for React errors

### Toolbar showing on wrong pages

1. Check route matching logic in `getToolbarConfig()`
2. Verify exact vs. hierarchical matching behavior
3. Consider using more specific route paths

## Future Enhancements

- Search functionality (`showSearch` flag)
- Breadcrumbs integration
- Dynamic action button states
- Route-based toolbar variants (compact, full)
- Animation transitions between toolbars
- Toolbar extension points for plugins

## Related Documentation

- [Layout System](LAYOUT_IMPLEMENTATION.md) - Overall layout architecture
- [Sidebar Configuration](SIDEBAR_SUBMENU_GUIDE.md) - Sidebar setup
- [Component Patterns](CLAUDE.md) - UI component guidelines
