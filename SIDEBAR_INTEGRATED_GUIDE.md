# Integrated Sidebar System Guide

The sidebar configuration is **part of the page layout system** using `usePageLayout()`. This ensures that sidebar behavior and page layout are configured together, creating a cohesive and type-safe system.

## Overview

Instead of configuring the sidebar separately, you declare everything in one place:

```tsx
usePageLayout({
  // Layout options
  maxWidth: "full",
  padding: "none",
  showToolbar: false,

  // Sidebar configuration
  sidebar: {
    items: [
      { mode: "filter", title: "Inbox", value: "inbox", count: 10 },
      { mode: "filter", title: "Sent", value: "sent", count: 5 },
    ],
    activeValue: currentFilter,
    onValueChange: setCurrentFilter,
  },
});
```

## Three Interaction Modes

### 1. Links (Navigation)

Use `mode: "link"` for traditional page navigation:

```tsx
usePageLayout({
  sidebar: {
    items: [
      { mode: "link", title: "Dashboard", url: "/dashboard", icon: Home },
      { mode: "link", title: "Settings", url: "/settings", icon: Settings },
    ],
  },
});
```

**Features:**
- Uses Next.js routing
- Auto-highlights based on current pathname
- Supports nested items
- Can include badges

### 2. Tabs (View Switching)

Use `mode: "tab"` for switching views without routing:

```tsx
const [view, setView] = useState("calendar");

usePageLayout({
  sidebar: {
    items: [
      { mode: "tab", title: "Calendar", value: "calendar", icon: Calendar },
      { mode: "tab", title: "List", value: "list", icon: List },
    ],
    activeValue: view,
    onValueChange: setView,
  },
});

// In your JSX
{view === "calendar" && <CalendarView />}
{view === "list" && <ListView />}
```

**Features:**
- State-based view switching
- No URL changes
- Perfect for different representations of same data

### 3. Filters (Data Filtering)

Use `mode: "filter"` for filtering data (like email folders):

```tsx
const [folder, setFolder] = useState("inbox");
const messages = getMessages();

usePageLayout({
  sidebar: {
    items: [
      {
        mode: "filter",
        title: "Inbox",
        value: "inbox",
        count: messages.filter(m => m.folder === "inbox").length,
      },
      {
        mode: "filter",
        title: "Sent",
        value: "sent",
        count: messages.filter(m => m.folder === "sent").length,
      },
    ],
    activeValue: folder,
    onValueChange: setFolder,
  },
});

// Filter your data
const filteredMessages = messages.filter(m => m.folder === folder);
```

**Features:**
- Shows dynamic counts
- Perfect for categorization
- Updates in real-time

## Complete Example: Email/Communications Page

See [page-integrated.tsx.example](/src/app/(dashboard)/dashboard/communication/page-integrated.tsx.example) for a full implementation showing:

- Multi-level filtering (folders, types, tags)
- Dynamic count updates
- Proper state management
- Integration with search
- Message list + detail view

### Key Highlights

```tsx
export default function CommunicationPage() {
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "starred">("inbox");
  const [activeType, setActiveType] = useState<"all" | "email" | "sms">("all");

  usePageLayout({
    maxWidth: "full",
    padding: "none",
    showToolbar: false,

    sidebar: {
      groups: [
        {
          label: "Folders",
          items: [
            { mode: "filter", title: "Inbox", value: "inbox", count: 10 },
            { mode: "filter", title: "Sent", value: "sent", count: 5 },
          ],
        },
        {
          label: "Message Type",
          items: [
            { mode: "filter", title: "All", value: "type:all", count: 15 },
            { mode: "filter", title: "Email", value: "type:email", count: 8 },
            { mode: "filter", title: "SMS", value: "type:sms", count: 7 },
          ],
        },
      ],
      activeValue: activeType !== "all" ? `type:${activeType}` : activeFolder,
      onValueChange: (value) => {
        if (value.startsWith("type:")) {
          setActiveType(value.replace("type:", ""));
        } else {
          setActiveFolder(value);
          setActiveType("all");
        }
      },
    },
  });

  // Your filtering logic
  const filteredMessages = messages.filter(m => {
    const folderMatch = m.folder === activeFolder;
    const typeMatch = activeType === "all" || m.type === activeType;
    return folderMatch && typeMatch;
  });

  return <MessageList messages={filteredMessages} />;
}
```

## API Reference

### `usePageLayout(config)`

| Property | Type | Description |
|----------|------|-------------|
| `sidebar` | `SidebarConfig` | Sidebar configuration (see below) |
| `maxWidth` | `"full" \| "7xl" \| ...` | Content max width |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | Content padding |
| `gap` | `"none" \| "sm" \| "md" \| "lg"` | Content gap |
| `showToolbar` | `boolean` | Show page toolbar |
| `showSidebar` | `boolean` | Show sidebar |

### `SidebarConfig`

| Property | Type | Description |
|----------|------|-------------|
| `items` | `SidebarItem[]` | Flat list of items |
| `groups` | `SidebarGroup[]` | Grouped items (use this OR `items`) |
| `activeValue` | `string` | Current active value (for tabs/filters) |
| `onValueChange` | `(value: string) => void` | Callback when value changes |
| `defaultValue` | `string` | Default active value |

### `SidebarItem`

**All modes share:**
| Property | Type | Description |
|----------|------|-------------|
| `mode` | `"link" \| "tab" \| "filter"` | Interaction mode |
| `title` | `string` | Display title |
| `icon` | `LucideIcon` | Icon component (optional) |
| `badge` | `string \| number` | Badge (optional) |
| `disabled` | `boolean` | Disable item (optional) |

**Link mode specific:**
| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Navigation URL |
| `items` | `LinkSidebarItem[]` | Nested items (optional) |

**Tab/Filter mode specific:**
| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Value identifier |
| `count` | `number` | Count to display (filter mode only) |

### `SidebarGroup`

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Group label (optional) |
| `items` | `SidebarItem[]` | Items in this group |

## Patterns & Best Practices

### Pattern: Multi-Level Filtering

Use value prefixes to distinguish filter types:

```tsx
onValueChange: (value) => {
  if (value.startsWith("folder:")) {
    setFolder(value.replace("folder:", ""));
  } else if (value.startsWith("type:")) {
    setType(value.replace("type:", ""));
  } else if (value.startsWith("tag:")) {
    setTag(value.replace("tag:", ""));
  }
}
```

### Pattern: Dynamic Counts

Recalculate counts when data changes:

```tsx
const inboxCount = messages.filter(m => m.folder === "inbox").length;

usePageLayout({
  sidebar: {
    items: [
      { mode: "filter", title: "Inbox", value: "inbox", count: inboxCount },
    ],
  },
});
```

### Pattern: Grouped Navigation

Organize related items:

```tsx
sidebar: {
  groups: [
    {
      label: "Main",
      items: [/* main items */],
    },
    {
      label: "Categories",
      items: [/* category filters */],
    },
  ],
}
```

### Pattern: Persistent State

Save filter state to localStorage:

```tsx
const [filter, setFilter] = useState(() =>
  localStorage.getItem("filter") ?? "inbox"
);

usePageLayout({
  sidebar: {
    onValueChange: (value) => {
      setFilter(value);
      localStorage.setItem("filter", value);
    },
  },
});
```

## Migration from Old System

**Before** (separate hooks):
```tsx
useSidebar({ items: [...] });
usePageLayout({ maxWidth: "full" });
```

**After** (integrated):
```tsx
usePageLayout({
  maxWidth: "full",
  sidebar: { items: [...] },
});
```

## Common Patterns

### Email/Messaging App
- **Folders** (Inbox, Sent, Archive) as filters
- **Message types** (Email, SMS, Calls) as filters
- **Tags** (Customer, Sales, Support) as filters
- Dynamic counts for each category

### Dashboard with Views
- **View modes** (Cards, Table, Chart) as tabs
- **Time periods** (Today, Week, Month) as filters
- **Categories** (Revenue, Expenses, Profit) as filters

### Settings Page
- **Section navigation** (Profile, Security, Billing) as links
- **Nested settings** under each section as sub-links

## Troubleshooting

### Counts not updating
Ensure you're recalculating counts when data changes. Use memoization for expensive calculations:

```tsx
const inboxCount = useMemo(
  () => messages.filter(m => m.folder === "inbox").length,
  [messages]
);
```

### Active state not highlighting
Make sure `activeValue` matches the item's `value`:

```tsx
// This won't work
activeValue: "inbox",
items: [{ value: "folder:inbox" }]

// This works
activeValue: "folder:inbox",
items: [{ value: "folder:inbox" }]
```

### Callback not firing
Verify you're using the correct mode and providing `onValueChange`:

```tsx
// Won't work - links don't use callbacks
{ mode: "link", onValueChange: ... }

// Works - filters use callbacks
{ mode: "filter", onValueChange: ... }
```

## Benefits of Integration

1. **Type Safety** - All configuration in one typed object
2. **Single Source of Truth** - Layout and sidebar configured together
3. **Cleaner Code** - One hook instead of two
4. **Better DX** - IDE autocomplete for all options
5. **Explicit Communication** - Clear how sidebar affects page content

## See Also

- [page-integrated.tsx.example](/src/app/(dashboard)/dashboard/communication/page-integrated.tsx.example) - Complete working example
- [use-page-layout.ts](/src/hooks/use-page-layout.ts) - Hook implementation
- [sidebar/types.ts](/src/lib/sidebar/types.ts) - TypeScript definitions
