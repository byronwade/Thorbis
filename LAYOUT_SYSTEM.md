# Layout System Documentation

The Stratos dashboard uses a flexible layout system that allows pages to control their container width, padding, gap, and toolbar visibility.

## Quick Start

### Basic Usage (Default Layout)

By default, all dashboard pages use the following layout:
- **Max Width**: `7xl` (1280px)
- **Padding**: `md` (1rem / 16px)
- **Gap**: `md` (1rem / 16px)
- **Toolbar**: Visible

```tsx
export default function MyPage() {
  return (
    <div>
      {/* Your content */}
    </div>
  );
}
```

### Full-Width Page (No Container)

For pages that need the full viewport width (like communications, analytics, etc.):

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CommunicationPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  return (
    <div className="h-full">
      {/* Full-width content */}
    </div>
  );
}
```

### Custom Width Container

For pages that need a specific max-width:

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function SettingsPage() {
  usePageLayout({
    maxWidth: "4xl", // 896px
    padding: "lg",   // 1.5rem / 24px
    gap: "md",       // 1rem / 16px
    showToolbar: true,
  });

  return (
    <div>
      {/* Centered content with 4xl max-width */}
    </div>
  );
}
```

## Configuration Options

### `maxWidth`

Controls the maximum width of the content container:

| Value | Max Width | Use Case |
|-------|-----------|----------|
| `"full"` | No limit | Full-width dashboards, communication tools, data tables |
| `"7xl"` | 1280px | **Default** - Most dashboard pages |
| `"6xl"` | 1152px | Wide content pages |
| `"5xl"` | 1024px | Standard content pages |
| `"4xl"` | 896px | Settings, forms |
| `"3xl"` | 768px | Narrow forms, documentation |
| `"2xl"` | 672px | Articles, blog posts |
| `"xl"` | 576px | Small forms |
| `"lg"` | 512px | Login, registration |
| `"md"` | 448px | Minimal forms |
| `"sm"` | 384px | Compact forms |

### `padding`

Controls the padding around the content:

| Value | Padding | CSS Class |
|-------|---------|-----------|
| `"none"` | 0 | `p-0` |
| `"sm"` | 0.5rem (8px) | `p-2` |
| `"md"` | 1rem (16px) | `p-4` |
| `"lg"` | 1.5rem (24px) | `p-6` |

### `gap`

Controls the gap between child elements (when using flex-col):

| Value | Gap | CSS Class |
|-------|-----|-----------|
| `"none"` | 0 | `gap-0` |
| `"sm"` | 0.5rem (8px) | `gap-2` |
| `"md"` | 1rem (16px) | `gap-4` |
| `"lg"` | 1.5rem (24px) | `gap-6` |

### `showToolbar`

Controls whether the AppToolbar (breadcrumbs/navigation) is visible:

- `true`: Show toolbar (default)
- `false`: Hide toolbar (useful for full-screen apps)

## Common Patterns

### Full-Width Dashboard

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function AnalyticsDashboard() {
  usePageLayout({
    maxWidth: "full",
    padding: "md",
    gap: "md",
    showToolbar: true,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dashboard widgets */}
    </div>
  );
}
```

### Settings Form Page

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function AccountSettings() {
  usePageLayout({
    maxWidth: "4xl",
    padding: "lg",
    gap: "lg",
    showToolbar: true,
  });

  return (
    <div className="space-y-6">
      {/* Settings sections */}
    </div>
  );
}
```

### Communication/Email Interface

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function EmailPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  return (
    <div className="h-full flex">
      {/* Split pane interface */}
    </div>
  );
}
```

### Centered Documentation

```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function DocumentationPage() {
  usePageLayout({
    maxWidth: "3xl",
    padding: "lg",
    gap: "md",
    showToolbar: true,
  });

  return (
    <article className="prose prose-gray dark:prose-invert">
      {/* Documentation content */}
    </article>
  );
}
```

## Implementation Details

### Architecture

The layout system consists of:

1. **LayoutConfigProvider** ([src/components/layout/layout-config-provider.tsx](src/components/layout/layout-config-provider.tsx))
   - React Context provider that holds layout configuration
   - Provides `useLayoutConfig()` hook for accessing/updating config

2. **usePageLayout Hook** ([src/hooks/use-page-layout.ts](src/hooks/use-page-layout.ts))
   - Convenient hook for pages to set their layout config
   - Automatically resets to defaults on unmount

3. **DashboardLayout** ([src/app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx))
   - Wraps all dashboard pages
   - Applies layout configuration dynamically
   - Handles sidebar, toolbar, and content wrapper

### How It Works

```
┌─────────────────────────────────────────────────┐
│ LayoutConfigProvider (Context)                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ DashboardLayout                             │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ AppHeader (always shown)                │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ DashboardContent                        │ │ │
│ │ │ ┌─────────┬─────────────────────────────┤ │ │
│ │ │ │Sidebar  │ SidebarInset                │ │ │
│ │ │ │         │ ┌─────────────────────────┐ │ │ │
│ │ │ │         │ │ AppToolbar (optional)   │ │ │ │
│ │ │ │         │ └─────────────────────────┘ │ │ │
│ │ │ │         │ ┌─────────────────────────┐ │ │ │
│ │ │ │         │ │ Content Wrapper         │ │ │ │
│ │ │ │         │ │ (with padding/gap)      │ │ │ │
│ │ │ │         │ │ ┌─────────────────────┐ │ │ │ │
│ │ │ │         │ │ │ Max-width Container │ │ │ │ │
│ │ │ │         │ │ │ (page content)      │ │ │ │ │
│ │ │ │         │ │ └─────────────────────┘ │ │ │ │
│ │ │ │         │ └─────────────────────────┘ │ │ │
│ │ │ └─────────┴─────────────────────────────┘ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Migration Guide

### Converting Existing Pages

**Before:**
```tsx
export default function MyPage() {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      {/* Content */}
    </div>
  );
}
```

**After:**
```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function MyPage() {
  usePageLayout({
    maxWidth: "7xl",
    padding: "md",
    gap: "md",
    showToolbar: true,
  });

  return (
    <div>
      {/* Content - no need for container classes */}
    </div>
  );
}
```

### When to Use Each Width

- **Use `full`**: When your page has its own internal layout/columns (email, kanban, calendar)
- **Use `7xl`**: Default for most dashboard pages with cards and grids
- **Use `6xl`/`5xl`**: Content-heavy pages that need some constraint
- **Use `4xl`**: Settings pages and long forms
- **Use `3xl` and below**: Narrow forms, login pages, documentation

## Best Practices

1. **Always use `"use client"`** directive when using `usePageLayout()`
2. **Place `usePageLayout()` at the top** of your component (before other hooks)
3. **Use `"none"` padding** for full-width layouts that manage their own spacing
4. **Hide toolbar** (`showToolbar: false`) for app-like interfaces
5. **Be consistent** - similar pages should use similar layout configs

## Troubleshooting

### Content not full-width despite `maxWidth: "full"`

Make sure you're also setting `padding: "none"` to remove the default padding:

```tsx
usePageLayout({
  maxWidth: "full",
  padding: "none", // Add this
  gap: "none",
  showToolbar: false,
});
```

### Layout config not applying

Ensure you've added `"use client"` directive at the top of your file:

```tsx
"use client"; // Must be at the very top

import { usePageLayout } from "@/hooks/use-page-layout";
// ...
```

### Toolbar still showing when `showToolbar: false`

Check that the config is being set before the component renders. The hook runs on mount, so it should work. If not, verify you're inside a dashboard layout route.

## Examples

See these pages for reference implementations:

- **Full-width**: [src/app/(dashboard)/dashboard/communication/page.tsx](src/app/(dashboard)/dashboard/communication/page.tsx)
- **Default 7xl**: Most pages under `/dashboard/*`
- **Custom width**: Settings pages under `/dashboard/settings/*`

## Future Enhancements

Potential future additions to the layout system:

- [ ] Per-route layout presets (auto-apply configs based on route patterns)
- [ ] Persistent layout preferences (save user's preferred widths)
- [ ] Animation transitions when switching layouts
- [ ] Responsive max-width adjustments (different widths per breakpoint)
- [ ] Layout variants (sidebar left/right/hidden)
