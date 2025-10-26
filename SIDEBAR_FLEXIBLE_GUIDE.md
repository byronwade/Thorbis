# Flexible Sidebar System Guide

The Stratos sidebar supports three interaction patterns: **links** (traditional routing), **tabs** (view switching), and **filters** (data filtering). This guide shows you how to use each pattern.

## Table of Contents

- [Quick Start](#quick-start)
- [Pattern 1: Links (Traditional Navigation)](#pattern-1-links-traditional-navigation)
- [Pattern 2: Tabs (View Switching)](#pattern-2-tabs-view-switching)
- [Pattern 3: Filters (Data Filtering)](#pattern-3-filters-data-filtering)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)

---

## Quick Start

1. **Import the hook** in your page component:

```tsx
import { useSidebar } from "@/lib/sidebar";
```

2. **Configure the sidebar** with your desired pattern:

```tsx
useSidebar({
  items: [
    { mode: "link", title: "Dashboard", url: "/dashboard", icon: Home },
  ],
});
```

3. **The sidebar automatically updates** based on your configuration.

---

## Pattern 1: Links (Traditional Navigation)

Use this pattern for **traditional page navigation** using Next.js routing.

### Basic Example

```tsx
"use client";

import { Home, Settings, Users } from "lucide-react";
import { useSidebar } from "@/lib/sidebar";

export default function MyPage() {
  useSidebar({
    items: [
      { mode: "link", title: "Dashboard", url: "/dashboard", icon: Home },
      { mode: "link", title: "Users", url: "/users", icon: Users },
      { mode: "link", title: "Settings", url: "/settings", icon: Settings },
    ],
  });

  return <div>My page content</div>;
}
```

### With Nested Items

```tsx
useSidebar({
  items: [
    {
      mode: "link",
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { mode: "link", title: "Profile", url: "/settings/profile" },
        { mode: "link", title: "Security", url: "/settings/security" },
        { mode: "link", title: "Billing", url: "/settings/billing" },
      ],
    },
  ],
});
```

### With Badges

```tsx
useSidebar({
  items: [
    {
      mode: "link",
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
      badge: 5, // Shows "5" badge
    },
  ],
});
```

### With Groups

```tsx
useSidebar({
  groups: [
    {
      label: "Main",
      items: [
        { mode: "link", title: "Dashboard", url: "/dashboard", icon: Home },
      ],
    },
    {
      label: "Settings",
      items: [
        { mode: "link", title: "Profile", url: "/settings", icon: Settings },
      ],
    },
  ],
});
```

---

## Pattern 2: Tabs (View Switching)

Use this pattern for **switching between different views on the same page** without routing.

### Basic Example

```tsx
"use client";

import { Calendar, List } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/lib/sidebar";

export default function SchedulePage() {
  const [view, setView] = useState("calendar");

  useSidebar({
    activeValue: view,
    onValueChange: setView,
    items: [
      { mode: "tab", title: "Calendar View", value: "calendar", icon: Calendar },
      { mode: "tab", title: "List View", value: "list", icon: List },
    ],
  });

  return (
    <div>
      {view === "calendar" && <CalendarView />}
      {view === "list" && <ListView />}
    </div>
  );
}
```

### With Default Value

```tsx
useSidebar({
  defaultValue: "calendar",
  activeValue: view,
  onValueChange: setView,
  items: [
    { mode: "tab", title: "Calendar", value: "calendar", icon: Calendar },
    { mode: "tab", title: "List", value: "list", icon: List },
  ],
});
```

### Multi-Section Tabs

```tsx
const [section, setSection] = useState("overview");
const [period, setPeriod] = useState("today");

useSidebar({
  groups: [
    {
      label: "View",
      items: [
        { mode: "tab", title: "Overview", value: "overview" },
        { mode: "tab", title: "Analytics", value: "analytics" },
      ],
    },
    {
      label: "Time Period",
      items: [
        { mode: "tab", title: "Today", value: "today" },
        { mode: "tab", title: "This Week", value: "week" },
        { mode: "tab", title: "This Month", value: "month" },
      ],
    },
  ],
  activeValue: section,
  onValueChange: (value) => {
    // Handle both section and period changes
    if (["overview", "analytics"].includes(value)) {
      setSection(value);
    } else {
      setPeriod(value);
    }
  },
});
```

---

## Pattern 3: Filters (Data Filtering)

Use this pattern for **filtering data** based on sidebar selections (like email folders).

### Basic Example

```tsx
"use client";

import { Archive, Inbox, Send, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/lib/sidebar";

export default function EmailPage() {
  const [folder, setFolder] = useState("inbox");
  const emails = getEmails(); // Your data source

  useSidebar({
    activeValue: folder,
    onValueChange: setFolder,
    items: [
      {
        mode: "filter",
        title: "Inbox",
        value: "inbox",
        icon: Inbox,
        count: emails.filter((e) => e.folder === "inbox").length,
      },
      {
        mode: "filter",
        title: "Sent",
        value: "sent",
        icon: Send,
        count: emails.filter((e) => e.folder === "sent").length,
      },
      {
        mode: "filter",
        title: "Starred",
        value: "starred",
        icon: Star,
        count: emails.filter((e) => e.starred).length,
      },
      {
        mode: "filter",
        title: "Archive",
        value: "archived",
        icon: Archive,
        count: emails.filter((e) => e.folder === "archived").length,
      },
      {
        mode: "filter",
        title: "Trash",
        value: "trash",
        icon: Trash2,
        count: emails.filter((e) => e.folder === "trash").length,
      },
    ],
  });

  const filteredEmails = emails.filter((email) => email.folder === folder);

  return <EmailList emails={filteredEmails} />;
}
```

### Multi-Level Filtering

```tsx
const [folder, setFolder] = useState("inbox");
const [type, setType] = useState("all");
const [tag, setTag] = useState<string | null>(null);

useSidebar({
  groups: [
    {
      label: "Folders",
      items: [
        { mode: "filter", title: "Inbox", value: "folder:inbox", count: 12 },
        { mode: "filter", title: "Sent", value: "folder:sent", count: 45 },
        { mode: "filter", title: "Archive", value: "folder:archive", count: 203 },
      ],
    },
    {
      label: "Type",
      items: [
        { mode: "filter", title: "All", value: "type:all", count: 260 },
        { mode: "filter", title: "Email", value: "type:email", count: 150 },
        { mode: "filter", title: "SMS", value: "type:sms", count: 80 },
        { mode: "filter", title: "Calls", value: "type:phone", count: 30 },
      ],
    },
    {
      label: "Tags",
      items: [
        { mode: "filter", title: "Customer", value: "tag:customer", count: 85 },
        { mode: "filter", title: "Sales", value: "tag:sales", count: 42 },
        { mode: "filter", title: "Support", value: "tag:support", count: 28 },
      ],
    },
  ],
  onValueChange: (value) => {
    // Parse filter type from value
    if (value.startsWith("folder:")) {
      setFolder(value.replace("folder:", ""));
    } else if (value.startsWith("type:")) {
      setType(value.replace("type:", ""));
    } else if (value.startsWith("tag:")) {
      setTag(value.replace("tag:", ""));
    }
  },
});
```

### Real-World Example: Communication Page

See the complete example at:
[`/src/app/(dashboard)/dashboard/communication/page-new.tsx.example`](/src/app/(dashboard)/dashboard/communication/page-new.tsx.example)

This example shows:
- Folder filtering (Inbox, Sent, Archive, Trash)
- Message type filtering (Email, SMS, Calls, Tickets)
- Tag filtering with dynamic counts
- Search integration
- Real-time count updates

---

## Advanced Usage

### Combining Patterns

You can mix different modes in the same sidebar:

```tsx
useSidebar({
  groups: [
    {
      label: "Navigation",
      items: [
        { mode: "link", title: "Dashboard", url: "/dashboard", icon: Home },
        { mode: "link", title: "Settings", url: "/settings", icon: Settings },
      ],
    },
    {
      label: "Views",
      items: [
        { mode: "tab", title: "Calendar", value: "calendar", icon: Calendar },
        { mode: "tab", title: "List", value: "list", icon: List },
      ],
    },
  ],
});
```

### Conditional Sidebar Configuration

```tsx
const isEmailPage = pathname === "/email";

useSidebar(
  isEmailPage
    ? {
        items: [
          { mode: "filter", title: "Inbox", value: "inbox", count: 10 },
          { mode: "filter", title: "Sent", value: "sent", count: 5 },
        ],
      }
    : null // Falls back to default navigation
);
```

### Dynamic Counts

```tsx
const { data: emails } = useQuery({ queryKey: ["emails"], queryFn: getEmails });

useSidebar({
  items: [
    {
      mode: "filter",
      title: "Inbox",
      value: "inbox",
      count: emails?.filter((e) => e.folder === "inbox").length ?? 0,
    },
  ],
});
```

### Persisting State

```tsx
const [folder, setFolder] = useState(() => {
  // Load from localStorage
  return localStorage.getItem("email-folder") ?? "inbox";
});

useSidebar({
  activeValue: folder,
  onValueChange: (value) => {
    setFolder(value);
    localStorage.setItem("email-folder", value);
  },
  items: [
    { mode: "filter", title: "Inbox", value: "inbox" },
    { mode: "filter", title: "Sent", value: "sent" },
  ],
});
```

---

## API Reference

### `useSidebar(config)`

Configures the sidebar for the current page.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `SidebarConfig \| null` | Configuration object or `null` to use default navigation |

#### SidebarConfig

| Property | Type | Description |
|----------|------|-------------|
| `items` | `SidebarItem[]` | Array of sidebar items (use this OR `groups`) |
| `groups` | `SidebarGroup[]` | Array of grouped sidebar items (use this OR `items`) |
| `mode` | `"link" \| "tab" \| "filter"` | Default mode for items (optional, items can override) |
| `activeValue` | `string` | Current active value (for tabs/filters) |
| `onValueChange` | `(value: string) => void` | Callback when value changes (for tabs/filters) |
| `defaultValue` | `string` | Default value (for tabs/filters) |

#### SidebarItem

**Base properties (all modes):**

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `"link" \| "tab" \| "filter"` | Interaction mode |
| `title` | `string` | Display title |
| `icon` | `LucideIcon` | Icon component (optional) |
| `badge` | `string \| number` | Badge to display (optional) |
| `disabled` | `boolean` | Disable the item (optional) |

**Link mode specific:**

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Navigation URL |
| `items` | `LinkSidebarItem[]` | Nested items (optional) |

**Tab mode specific:**

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Tab value identifier |

**Filter mode specific:**

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Filter value identifier |
| `count` | `number` | Count to display (optional) |

#### SidebarGroup

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Group label (optional, can be undefined for unlabeled group) |
| `items` | `SidebarItem[]` | Array of items in this group |

#### Return Value

```tsx
{
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
}
```

---

## Migration Guide

### From Old Navigation

**Before:**
```tsx
// Hardcoded in AppSidebar component
const navigationSections = {
  communication: [
    { title: "Inbox", url: "/communication/inbox" },
    { title: "Sent", url: "/communication/sent" },
  ],
};
```

**After:**
```tsx
// In your page component
useSidebar({
  items: [
    { mode: "link", title: "Inbox", url: "/communication/inbox" },
    { mode: "link", title: "Sent", url: "/communication/sent" },
  ],
});
```

### From Select/Dropdown Filters

**Before:**
```tsx
<Select onValueChange={setFolder}>
  <SelectItem value="inbox">Inbox</SelectItem>
  <SelectItem value="sent">Sent</SelectItem>
</Select>
```

**After:**
```tsx
useSidebar({
  activeValue: folder,
  onValueChange: setFolder,
  items: [
    { mode: "filter", title: "Inbox", value: "inbox", count: 10 },
    { mode: "filter", title: "Sent", value: "sent", count: 5 },
  ],
});
```

---

## Best Practices

1. **Choose the right mode:**
   - Use `link` for navigation between pages
   - Use `tab` for switching views on the same page
   - Use `filter` for filtering data

2. **Keep filters reactive:**
   - Always show current counts in filter mode
   - Update counts when data changes
   - Use `count: 0` instead of hiding items

3. **Persist important state:**
   - Save active tab/filter to localStorage
   - Restore on page reload
   - Use URL params for shareable filters

4. **Group related items:**
   - Use groups to organize many items
   - Give groups descriptive labels
   - Keep groups focused (3-7 items each)

5. **Handle edge cases:**
   - Provide default values
   - Handle empty states
   - Disable items when appropriate

6. **Performance:**
   - Memoize expensive count calculations
   - Use React Query for data fetching
   - Debounce rapid filter changes

---

## TypeScript Support

All types are fully typed and exported:

```tsx
import type {
  SidebarConfig,
  SidebarItem,
  SidebarGroup,
  LinkSidebarItem,
  TabSidebarItem,
  FilterSidebarItem,
} from "@/lib/sidebar";
```

---

## Troubleshooting

### Sidebar not updating

Make sure your page is inside the `(dashboard)` layout:

```
src/app/(dashboard)/
  └── your-page/
      └── page.tsx  ← useSidebar() works here
```

### "useSidebar must be used within a SidebarProvider"

The `SidebarProvider` is automatically included in the dashboard layout. If you see this error, check that your page is in the correct location.

### Active state not working for tabs/filters

Ensure you're passing both `activeValue` and `onValueChange`:

```tsx
const [active, setActive] = useState("inbox");

useSidebar({
  activeValue: active,        // ← Required
  onValueChange: setActive,   // ← Required
  items: [/* ... */],
});
```

### Counts not updating

Make sure you're recalculating counts when data changes:

```tsx
// ✅ Good - recalculates on data change
const inboxCount = emails.filter((e) => e.folder === "inbox").length;

useSidebar({
  items: [
    { mode: "filter", title: "Inbox", value: "inbox", count: inboxCount },
  ],
});

// ❌ Bad - static count
useSidebar({
  items: [
    { mode: "filter", title: "Inbox", value: "inbox", count: 10 },
  ],
});
```

---

## Examples

See the [`page-new.tsx.example`](/src/app/(dashboard)/dashboard/communication/page-new.tsx.example) file for a complete real-world implementation.

---

## Support

For questions or issues:
1. Check this guide first
2. Review the example implementation
3. Check the TypeScript types for API details
4. Open a GitHub issue if needed
