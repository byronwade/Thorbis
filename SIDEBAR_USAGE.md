# Sidebar Usage Guide

## How Sidebars Work in Stratos

The sidebar system has **two modes of operation**:

### 1. Default Section Navigation (Most Pages)

**90% of pages use this mode** - The sidebar shows contextual navigation for the current section.

- Defined in [app-sidebar.tsx](/src/components/layout/app-sidebar.tsx)
- Automatically shows based on current pathname
- Each major section (AI, Settings, Communication, etc.) has its navigation
- **No configuration needed in individual pages**

#### Sections with Default Navigation:

- **Today** (`/dashboard`) - Dashboard home
- **Communication** (`/dashboard/communication/*`) - Unified Inbox, Email, Phone, SMS, Tickets
- **Work** (`/dashboard/work/*`) - Jobs, Estimates, Service Tickets
- **Schedule** (`/dashboard/schedule/*`) - Dispatch Board, Technicians, Routes, Time Tracking
- **Customers** (`/dashboard/customers/*`) - Profiles, Service History, Portal
- **Finance** (`/dashboard/finance/*`) - Invoicing, Payments, Expenses, Payroll, Accounting
- **Reports** (`/dashboard/reports/*`) - Performance, Financial, Operational Reports
- **Marketing** (`/dashboard/marketing/*`) - Lead Management, Reviews, Campaigns
- **Automation** (`/dashboard/automation/*`) - Workflows, Rules, Templates
- **AI** (`/dashboard/ai/*`) - Stratos Assistant, Search Chats, AI Library, Tools
- **Settings** (`/dashboard/settings/*`) - All settings categories and sub-pages

**Example - AI Page:**
```tsx
// No sidebar config needed - automatically shows AI section navigation
export default function AIPage() {
  return <div>AI Assistant Content</div>;
}
```

---

### 2. Custom Page-Specific Sidebar (Special Cases Only)

**~10% of pages use this mode** - When a page needs special filtering or unique navigation.

Use custom sidebar configuration ONLY when:
- ✅ You need **data filtering** with dynamic counts (like email folders)
- ✅ You need **view tabs** that change display without routing
- ✅ The page has **unique interaction** not covered by section navigation

#### When to Use Custom Sidebar

**✅ DO use custom sidebar for:**
- **Data filtering pages** (e.g., Communications Inbox with status/type/tag filters)
- **Dashboard pages with view modes** (e.g., Chart vs Table view)
- **Reports with multiple filters** (e.g., Date range, department, status)

**❌ DON'T use custom sidebar for:**
- Regular navigation between pages (use default section nav)
- Settings pages (use default settings nav)
- Simple pages that just need basic navigation

---

## Implementation Examples

### Example 1: Using Default Navigation (Most Pages)

```tsx
// src/app/(dashboard)/dashboard/ai/page.tsx
export default function AIPage() {
  // No sidebar config - uses default AI section navigation
  return <div>AI content here</div>;
}
```

**Result:** Sidebar automatically shows:
- AI Assistant
  - Stratos Assistant
  - Search Chats
  - AI Library
  - Codex
- AI Tools
  - Smart Suggestions
  - Automation Rules
  - AI Analytics

---

### Example 2: Custom Data Filtering (Special Case)

```tsx
// src/app/(dashboard)/dashboard/communication/page.tsx
const [statusFilter, setStatusFilter] = useState("all");
const [typeFilter, setTypeFilter] = useState("all");

usePageLayout({
  maxWidth: "full",
  padding: "none",
  showToolbar: false,
  sidebar: {
    groups: [
      {
        label: "Status",
        items: [
          { mode: "filter", title: "All", value: "status:all", count: 42 },
          { mode: "filter", title: "Unread", value: "status:unread", count: 5 },
          { mode: "filter", title: "Read", value: "status:read", count: 37 },
        ],
      },
      {
        label: "Type",
        items: [
          { mode: "filter", title: "All", value: "type:all", count: 42 },
          { mode: "filter", title: "Email", value: "type:email", count: 20 },
          { mode: "filter", title: "SMS", value: "type:sms", count: 15 },
        ],
      },
    ],
    activeValue: typeFilter !== "all" ? `type:${typeFilter}` : `status:${statusFilter}`,
    onValueChange: (value) => {
      if (value.startsWith("status:")) {
        setStatusFilter(value.replace("status:", ""));
      } else if (value.startsWith("type:")) {
        setTypeFilter(value.replace("type:", ""));
      }
    },
  },
});
```

**Result:** Sidebar shows custom filters with live counts instead of default navigation.

---

## Decision Tree: Do I Need Custom Sidebar?

```
Is your page filtering/organizing data with dynamic counts?
├─ YES → Use custom sidebar with mode: "filter"
└─ NO → Does your page need view tabs (Calendar/List/Chart)?
    ├─ YES → Use custom sidebar with mode: "tab"
    └─ NO → Does your page need unique navigation not in section default?
        ├─ YES → Use custom sidebar with mode: "link"
        └─ NO → Use default section navigation (no config needed)
```

---

## Current Implementation Status

### ✅ Pages Using Custom Sidebar (Correct)

- **Communication** (`/dashboard/communication`) - Data filtering with counts

### ✅ Pages Using Default Navigation (Correct)

- **AI** (`/dashboard/ai`) - Uses AI section navigation
- **Settings** (`/dashboard/settings`) - Uses Settings section navigation
- **All other pages** - Use their respective section navigation

---

## Modifying Default Navigation

If you need to change the default navigation for a section (e.g., add a new AI tool), edit [app-sidebar.tsx](/src/components/layout/app-sidebar.tsx):

```tsx
// src/components/layout/app-sidebar.tsx
const navigationSections = {
  ai: [
    {
      label: "AI Assistant",
      items: [
        { title: "Stratos Assistant", url: "/dashboard/ai", icon: Sparkles },
        { title: "Search Chats", url: "/dashboard/ai/search", icon: Search },
        // Add new item here:
        { title: "New AI Tool", url: "/dashboard/ai/new-tool", icon: Icon },
      ],
    },
  ],
  // ... other sections
};
```

This change will apply to **all pages in that section**.

---

## Summary

**Rule of Thumb:**
- **Default navigation = 90%** of pages (AI, Settings, most sections)
- **Custom sidebar = 10%** of pages (filtering, tabs, special needs)

**The communications page is the exception, not the rule.**

Most pages should rely on the well-organized default section navigation rather than defining custom sidebar configurations.
