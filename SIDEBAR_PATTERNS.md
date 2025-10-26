# Sidebar Patterns by Page Type

Each page can configure its own sidebar content using `usePageLayout()`. Here are the common patterns:

## Pattern 1: Data Filters (Communications Page)

**Use case:** Filtering and organizing data
**Mode:** `filter`
**Features:** Dynamic counts, multi-level filtering

```tsx
// src/app/(dashboard)/dashboard/communication/page.tsx
usePageLayout({
  maxWidth: "full",
  padding: "none",
  showToolbar: false,
  sidebar: {
    groups: [
      {
        label: "Status",
        items: [
          { mode: "filter", title: "All Messages", value: "status:all", count: 6 },
          { mode: "filter", title: "Unread", value: "status:unread", count: 3 },
        ],
      },
      {
        label: "Message Type",
        items: [
          { mode: "filter", title: "All Types", value: "type:all", count: 6 },
          { mode: "filter", title: "Email", value: "type:email", count: 2 },
        ],
      },
    ],
    activeValue: currentFilter,
    onValueChange: (value) => {
      // Update filter state
      setFilter(value);
    },
  },
});
```

**Key features:**
- Shows counts for each filter
- Multiple filter groups (Status, Type, Tags)
- Callback updates page state
- Counts update automatically

---

## Pattern 2: Navigation Links (AI Page)

**Use case:** Navigate between related pages
**Mode:** `link`
**Features:** Standard navigation, active state highlighting

```tsx
// src/app/(dashboard)/dashboard/ai/page.tsx
usePageLayout({
  maxWidth: "full",
  padding: "none",
  showToolbar: false,
  sidebar: {
    groups: [
      {
        label: "AI Assistant",
        items: [
          { mode: "link", title: "Stratos Assistant", url: "/dashboard/ai", icon: Sparkles },
          { mode: "link", title: "Search Chats", url: "/dashboard/ai/search", icon: Search },
          { mode: "link", title: "AI Library", url: "/dashboard/ai/library", icon: BookOpen },
        ],
      },
      {
        label: "AI Tools",
        items: [
          { mode: "link", title: "Smart Suggestions", url: "/dashboard/ai/suggestions", icon: Lightbulb },
          { mode: "link", title: "Automation Rules", url: "/dashboard/ai/automation", icon: Zap },
        ],
      },
    ],
  },
});
```

**Key features:**
- Next.js navigation (uses `<Link>`)
- Auto-highlights based on current pathname
- Grouped by category
- Icons for visual clarity

---

## Pattern 3: Navigation Links with Sections (Settings Page)

**Use case:** Deep navigation hierarchy for settings
**Mode:** `link`
**Features:** Multiple groups, badges, comprehensive navigation

```tsx
// src/app/(dashboard)/dashboard/settings/page.tsx
usePageLayout({
  sidebar: {
    groups: [
      {
        label: "Settings",
        items: [
          { mode: "link", title: "Overview", url: "/dashboard/settings", icon: Settings2 },
        ],
      },
      {
        label: "Account",
        items: [
          { mode: "link", title: "Personal Info", url: "/dashboard/settings/profile/personal", icon: User },
          { mode: "link", title: "Security", url: "/dashboard/settings/profile/security", icon: Shield },
          { mode: "link", title: "Notifications", url: "/dashboard/settings/profile/notifications", icon: Bell },
        ],
      },
      {
        label: "Company",
        items: [
          { mode: "link", title: "Company Profile", url: "/dashboard/settings/company", icon: Building2 },
          { mode: "link", title: "Billing", url: "/dashboard/settings/billing", icon: CreditCard },
        ],
      },
      // ... more groups
      {
        label: "Integrations",
        items: [
          {
            mode: "link",
            title: "QuickBooks",
            url: "/dashboard/settings/quickbooks",
            icon: FileText,
            badge: "Popular"
          },
        ],
      },
    ],
  },
});
```

**Key features:**
- Many grouped sections
- Badges for special items
- Comprehensive navigation tree
- All settings accessible from sidebar

---

## Pattern 4: Tabs (View Switching)

**Use case:** Switch between different views of the same data
**Mode:** `tab`
**Features:** No routing, state-based

```tsx
// Example: Schedule page with Calendar/List views
const [view, setView] = useState("calendar");

usePageLayout({
  sidebar: {
    groups: [
      {
        label: "View",
        items: [
          { mode: "tab", title: "Calendar View", value: "calendar", icon: Calendar },
          { mode: "tab", title: "List View", value: "list", icon: List },
          { mode: "tab", title: "Timeline View", value: "timeline", icon: Clock },
        ],
      },
    ],
    activeValue: view,
    onValueChange: setView,
  },
});

// In JSX
{view === "calendar" && <CalendarView />}
{view === "list" && <ListView />}
{view === "timeline" && <TimelineView />}
```

**Key features:**
- No URL changes
- Instant view switching
- Perfect for different data representations

---

## Pattern 5: Mixed Links + Tabs

**Use case:** Navigation with view options
**Modes:** `link` + `tab`

```tsx
// Example: Reports page with navigation + view modes
const [chartType, setChartType] = useState("bar");

usePageLayout({
  sidebar: {
    groups: [
      {
        label: "Reports",
        items: [
          { mode: "link", title: "Revenue", url: "/dashboard/reports/revenue", icon: DollarSign },
          { mode: "link", title: "Customers", url: "/dashboard/reports/customers", icon: Users },
        ],
      },
      {
        label: "Chart Type",
        items: [
          { mode: "tab", title: "Bar Chart", value: "bar", icon: BarChart },
          { mode: "tab", title: "Line Chart", value: "line", icon: LineChart },
          { mode: "tab", title: "Pie Chart", value: "pie", icon: PieChart },
        ],
      },
    ],
    activeValue: chartType,
    onValueChange: setChartType,
  },
});
```

**Key features:**
- Combines navigation and view switching
- Different groups for different purposes
- Flexible and powerful

---

## Pattern 6: No Custom Sidebar (Uses Default)

**Use case:** Simple pages that use section default navigation
**Mode:** Falls back to default

```tsx
// Example: Dashboard home page
usePageLayout({
  maxWidth: "7xl",
  padding: "md",
  // No sidebar config - uses default navigation
});
```

**Key features:**
- Uses default navigation from AppSidebar
- No configuration needed
- Good for simple pages

---

## Implementation Checklist

When adding sidebar configuration to a page:

1. **Import the hook:**
   ```tsx
   import { usePageLayout } from "@/hooks/use-page-layout";
   ```

2. **Import icons:**
   ```tsx
   import { Icon1, Icon2, Icon3 } from "lucide-react";
   ```

3. **Add state (if using filters/tabs):**
   ```tsx
   const [filter, setFilter] = useState("default");
   ```

4. **Call usePageLayout:**
   ```tsx
   usePageLayout({
     sidebar: { /* config */ }
   });
   ```

5. **Use the state in your component:**
   ```tsx
   const filteredData = data.filter(item => item.status === filter);
   ```

---

## Best Practices

### For Filters:
- Always show counts
- Update counts when data changes
- Use value prefixes (`status:`, `type:`, `tag:`) for multi-level filtering
- Reset dependent filters when changing categories

### For Links:
- Group related items
- Use clear, concise labels
- Add icons for visual clarity
- Consider adding badges for special items

### For Tabs:
- Use for different views of the same data
- Keep tab labels short
- Don't use tabs for navigation between pages

### General:
- Pages define their own sidebar content
- Configuration is part of `usePageLayout()`
- Default navigation only for pages without custom config
- Sidebar content should match page purpose

---

## Examples in Codebase

- **Filters:** [communication/page.tsx](/src/app/(dashboard)/dashboard/communication/page.tsx)
- **Links:** [ai/page.tsx](/src/app/(dashboard)/dashboard/ai/page.tsx)
- **Links (Deep):** [settings/page.tsx](/src/app/(dashboard)/dashboard/settings/page.tsx)
- **Integrated Example:** [page-integrated.tsx.example](/src/app/(dashboard)/dashboard/communication/page-integrated.tsx.example)

---

## Migration Path

Pages still using default sidebar navigation should be updated to define their own:

1. Identify the page's purpose (filtering, navigation, views)
2. Choose the appropriate pattern
3. Add `usePageLayout()` with sidebar config
4. Test that sidebar reflects page content
5. Remove reliance on default navigation

The goal: **Every page explicitly defines its sidebar content** to match its specific needs.
