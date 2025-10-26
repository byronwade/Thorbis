# Layout System Implementation Guide

## Overview

The Stratos dashboard uses a flexible, context-based layout system that allows each page to control its container width, padding, spacing, and toolbar visibility. This eliminates the need for wrapper divs and inline styles while maintaining consistency.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ LayoutConfigProvider (React Context)                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ DashboardLayout                                     │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ AppHeader (always visible)                      │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ │                                                       │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ DashboardContent                                │ │ │
│ │ │                                                   │ │ │
│ │ │ If maxWidth === "full":                          │ │ │
│ │ │   SidebarInset > children (no wrapper)          │ │ │
│ │ │                                                   │ │ │
│ │ │ If maxWidth !== "full":                          │ │ │
│ │ │   SidebarInset > wrapper + container > children │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Key Files

### 1. Layout Configuration Provider
**Location**: `src/components/layout/layout-config-provider.tsx`

Provides React Context for layout configuration:

```tsx
type LayoutConfig = {
  maxWidth?: "full" | "7xl" | "6xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "md" | "sm";
  padding?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "sm" | "md" | "lg";
  showToolbar?: boolean;
  showSidebar?: boolean;
  showHeader?: boolean;
  toolbarTitle?: string;
  toolbarActions?: ReactNode;
  toolbarChildren?: ReactNode;
};
```

**Default values** (applied when no config is set):
- `maxWidth: "7xl"` - 1280px centered container
- `padding: "md"` - 16px padding
- `gap: "md"` - 16px gap between children
- `showToolbar: true` - Show toolbar
- `showSidebar: true` - Show sidebar
- `showHeader: true` - Show header
- `toolbarTitle: undefined` - No title (shows only SidebarTrigger)
- `toolbarActions: undefined` - No action buttons
- `toolbarChildren: undefined` - No custom content

### 2. usePageLayout Hook
**Location**: `src/hooks/use-page-layout.ts`

Convenient hook for pages to set their layout configuration:

```tsx
export function usePageLayout(config: PageLayoutConfig) {
  const { setConfig } = useLayoutConfig();

  useEffect(() => {
    setConfig(config);

    // Reset to defaults when component unmounts
    return () => {
      setConfig({
        maxWidth: "7xl",
        padding: "md",
        gap: "md",
        showToolbar: true,
      });
    };
  }, []);
}
```

**Important**: This hook only runs once on mount (empty dependency array) to prevent infinite re-renders.

### 3. Dashboard Layout
**Location**: `src/app/(dashboard)/layout.tsx`

Wraps all dashboard pages and applies layout configuration:

```tsx
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { config } = useLayoutConfig();
  const isFullWidth = config.maxWidth === "full";

  return (
    <SidebarProvider>
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
        <AppSidebar />
        <SidebarInset className="w-full">
          {config.showToolbar && <AppToolbar />}
          {isFullWidth ? (
            // Full-width: no wrapper, children render directly
            children
          ) : (
            // Constrained: wrapper with padding/gap + max-width container
            <div className={`flex w-full flex-1 flex-col ${gapClass} ${paddingClass}`}>
              <div className={maxWidthClass}>{children}</div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
```

## Usage Patterns

### Pattern 1: Default Layout (No Configuration)

**When to use**: Most dashboard pages - settings, lists, forms, standard content

**Behavior**:
- Content centered with 1280px max-width
- 16px padding on all sides
- 16px gap between child elements
- Toolbar visible

**Example**:
```tsx
export default function SettingsPage() {
  // No usePageLayout() call = uses defaults

  return (
    <div className="space-y-6">
      <h1>Settings</h1>
      {/* Content automatically constrained to 7xl width */}
    </div>
  );
}
```

**Result**:
```html
<SidebarInset>
  <AppToolbar />
  <div class="flex w-full flex-1 flex-col gap-4 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Your page content -->
    </div>
  </div>
</SidebarInset>
```

### Pattern 2: Full-Width Layout with Custom Toolbar

**When to use**: Apps with custom layouts that still need a toolbar - email, chat, dashboards, data tables

**Behavior**:
- No width constraint (100% width)
- No padding (page manages its own)
- No gap (page manages its own)
- Toolbar visible with custom title and actions

**Example**:
```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Filter, Mail } from "lucide-react";
import { usePageLayout } from "@/hooks/use-page-layout";

export default function CommunicationPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: true,
    toolbarTitle: "Communications",
    toolbarActions: (
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
  });

  return (
    <div className="flex h-full flex-col">
      {/* Full-width content - no custom header needed */}
      <div className="flex flex-1">
        {/* Your split-pane or custom layout */}
      </div>
    </div>
  );
}
```

**Result**:
```html
<SidebarInset>
  <AppToolbar>
    <SidebarTrigger />
    <h1>Communications</h1>
    <div class="ml-auto">
      <!-- Your custom action buttons -->
    </div>
  </AppToolbar>
  <!-- Your page content renders directly below toolbar -->
</SidebarInset>
```

### Pattern 3: Full-Width Layout without Toolbar

**When to use**: Full-screen experiences with completely custom headers

**Behavior**:
- No width constraint (100% width)
- No padding (page manages its own)
- No gap (page manages its own)
- Toolbar hidden

**Example**:
```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function CustomPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  return (
    <div className="flex h-full flex-col">
      {/* Custom header */}
      <div className="border-b px-6 py-4">
        <h1>Custom Page</h1>
      </div>

      {/* Full-width content */}
      <div className="flex flex-1">
        {/* Your custom layout */}
      </div>
    </div>
  );
}
```

**Result**:
```html
<SidebarInset>
  <!-- No AppToolbar -->
  <!-- No wrapper divs -->
  <!-- Your page content renders directly -->
</SidebarInset>
```

### Pattern 3: Custom Width Container

**When to use**: Narrow forms, documentation, centered content

**Example**:
```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function DocumentationPage() {
  usePageLayout({
    maxWidth: "3xl",  // 768px
    padding: "lg",    // 24px
    gap: "lg",        // 24px
    showToolbar: true,
  });

  return (
    <article className="prose">
      {/* Content constrained to 768px */}
    </article>
  );
}
```

## Width Options

| Value | Max Width | Typical Use Case |
|-------|-----------|------------------|
| `"full"` | No limit | Communication tools, dashboards, data grids |
| `"7xl"` | 1280px | **Default** - Most dashboard pages |
| `"6xl"` | 1152px | Wide content pages |
| `"5xl"` | 1024px | Standard content |
| `"4xl"` | 896px | Settings, long forms |
| `"3xl"` | 768px | Documentation, narrow forms |
| `"2xl"` | 672px | Articles |
| `"xl"` | 576px | Small forms |
| `"lg"` | 512px | Login pages |
| `"md"` | 448px | Minimal forms |
| `"sm"` | 384px | Compact forms |

## Testing the Layout System

Two test pages are available:

### 1. Default Layout Test
**URL**: `/dashboard/test-layout`

Tests the default 7xl layout with standard padding and gap. Shows:
- Centered content container
- Proper padding application
- Toolbar visibility
- Responsive grid behavior

### 2. Full-Width Layout Test
**URL**: `/dashboard/test-full-width`

Tests full-width layout with no constraints. Shows:
- Edge-to-edge content
- No padding/gap from layout
- Hidden toolbar
- Custom split-pane layout

## Common Issues & Solutions

### Issue: Content not full-width despite `maxWidth: "full"`

**Cause**: Missing `padding: "none"` or `gap: "none"`

**Solution**:
```tsx
usePageLayout({
  maxWidth: "full",
  padding: "none",  // Add this
  gap: "none",      // Add this
  showToolbar: false,
});
```

### Issue: Layout config not applying

**Cause**: Missing `"use client"` directive

**Solution**:
```tsx
"use client";  // Must be at the very top

import { usePageLayout } from "@/hooks/use-page-layout";
```

### Issue: Extra padding or max-width still applied

**Cause**: Page has its own container classes

**Solution**: Remove any `container`, `max-w-*`, or `mx-auto` classes from your page - the layout handles this.

```tsx
// ❌ Don't do this
<div className="container mx-auto max-w-7xl p-4">
  {content}
</div>

// ✅ Do this instead
<div>
  {content}
</div>
```

### Issue: Toolbar showing when it shouldn't

**Cause**: Config not set or page is the Today page

**Solution**: Ensure you're calling `usePageLayout()` with `showToolbar: false`

## Migration Guide

### Before (Old Pattern)
```tsx
export default function MyPage() {
  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="space-y-6">
        {/* Content */}
      </div>
    </div>
  );
}
```

### After (New Pattern - Default)
```tsx
export default function MyPage() {
  // No layout config needed - defaults to 7xl

  return (
    <div className="space-y-6">
      {/* Content - automatically centered and padded */}
    </div>
  );
}
```

### After (New Pattern - Full Width)
```tsx
"use client";

import { usePageLayout } from "@/hooks/use-page-layout";

export default function MyPage() {
  usePageLayout({
    maxWidth: "full",
    padding: "none",
    gap: "none",
    showToolbar: false,
  });

  return (
    <div className="h-full">
      {/* Full-width content - manages own layout */}
    </div>
  );
}
```

## Best Practices

1. **Always use "use client" directive** when calling `usePageLayout()`
2. **Place usePageLayout() at the top** of your component (before other hooks)
3. **Use full-width sparingly** - only for pages that need custom layouts
4. **Remove container classes** - let the layout system handle it
5. **Be consistent** - similar pages should use similar configs
6. **Test on different screens** - verify responsive behavior
7. **Document your choice** - comment why you chose a specific width

## Performance Considerations

- The layout provider uses `useCallback` to prevent unnecessary re-renders
- The hook uses an empty dependency array to run only once on mount
- Config changes are applied immediately via context (no page reload needed)
- The layout system adds minimal overhead (single context provider)

## Future Enhancements

Potential additions to the layout system:

- [ ] Per-route presets (auto-apply configs based on URL patterns)
- [ ] Persistent user preferences (remember preferred widths)
- [ ] Smooth transitions between layout changes
- [ ] Responsive max-width (different widths per breakpoint)
- [ ] Layout variants (sidebar positions, collapsed states)
- [ ] TypeScript strict mode for config validation
- [ ] Dev tools overlay showing current config

## Support

For questions or issues with the layout system:
1. Check this documentation first
2. Look at test pages for reference implementations
3. Review the communications page for a full-width example
4. Check the settings page for a default layout example
