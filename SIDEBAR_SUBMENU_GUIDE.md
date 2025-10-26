# Sidebar Sub-Menu Implementation Guide

## Overview

The sidebar now supports expandable sub-menu items, similar to Shopify's navigation pattern. This allows for better organization of related navigation items under parent categories.

## Features

✅ **Expandable/Collapsible Sub-Items** - Click parent items to expand/collapse child navigation
✅ **Auto-Expand Active Routes** - Automatically expands sub-menu when a child route is active
✅ **Chevron Indicators** - Visual feedback with ChevronRight (collapsed) and ChevronDown (expanded)
✅ **Section Headers** - Add visual separators and labels for navigation sections
✅ **Persistent State** - Sub-menu state is managed in component state
✅ **Smooth Transitions** - Professional hover and active states

## Usage

### Adding a Menu Item with Sub-Items

```typescript
{
  title: "Products",
  subItems: [
    {
      title: "Collections",
      href: "/dashboard/products/collections",
    },
    {
      title: "Inventory",
      href: "/dashboard/products/inventory",
    },
    {
      title: "Purchase orders",
      href: "/dashboard/products/purchase-orders",
    },
  ],
}
```

### Adding a Simple Menu Item (No Sub-Items)

```typescript
{
  title: "Home",
  href: "/dashboard",
}
```

### Adding Section Headers

Section headers create visual separation and labels in the sidebar:

```typescript
{
  title: "Sales channels",
  isSectionHeader: true,
},
{
  title: "Online Store",
  href: "/dashboard/sales/online-store",
},
{
  title: "Shop",
  href: "/dashboard/sales/shop",
}
```

## Type Definition

```typescript
type NavigationItem = {
  title: string;
  href?: string;                    // Optional for parent items and section headers
  group?: string;                   // For grouped settings items
  badge?: string | boolean;         // Optional badge display
  isNewChat?: boolean;             // Special handling for AI chat creation
  icon?: string;                   // Icon identifier (optional)
  isSectionHeader?: boolean;       // Makes item a section header
  subItems?: NavigationItem[];     // Array of child navigation items
};
```

## Component Behavior

### MenuItem Component

The `MenuItem` component handles three types of navigation items:

1. **Section Headers** - Renders as a label with top border
2. **Parent Items with Sub-Items** - Renders with chevron icon and expandable sub-menu
3. **Simple Items** - Renders as a standard navigation link

### Auto-Expansion Logic

Sub-menus automatically expand when:
- The current route matches any sub-item's href
- Uses `useEffect` to detect active sub-items on route changes

### Toggle Interaction

- Click parent item to expand/collapse sub-menu
- Chevron icon rotates to indicate state
- Sub-items are indented with `ml-3` spacing

## Styling

### Parent Items
- Font weight: `font-medium`
- Chevron size: `size-3`
- Full width button with hover states

### Sub-Items
- Font weight: `font-normal` (lighter than parent)
- Indented with `ml-3`
- Same hover/active states as parent items

### Section Headers
- Border top: `border-t`
- Small text: `text-xs`
- Muted color: `text-muted-foreground`
- Top margin: `mt-4`

## Example Configuration

```typescript
const navigationSections: Record<string, NavigationItem[]> = {
  dashboard: [
    {
      title: "Home",
      href: "/dashboard",
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
    },
    {
      title: "Products",
      subItems: [
        {
          title: "Collections",
          href: "/dashboard/products/collections",
        },
        {
          title: "Inventory",
          href: "/dashboard/products/inventory",
        },
      ],
    },
    {
      title: "Sales channels",
      isSectionHeader: true,
    },
    {
      title: "Online Store",
      href: "/dashboard/sales/online-store",
    },
  ],
};
```

## Current Implementation

The dashboard section now includes:
- Simple menu items (Home, Orders, Customers, etc.)
- Expandable "Products" menu with 5 sub-items
- "Sales channels" section header with 3 items
- "Apps" section header with 1 item

## Accessibility

- All buttons have proper `type="button"` attributes
- Hover states for keyboard navigation
- Focus indicators via `focus-visible:ring-2`
- Screen reader friendly with semantic HTML

## Future Enhancements

Potential additions:
- Persistent expansion state (localStorage)
- Multiple levels of nesting
- Icon support for menu items
- Badges for sub-items
- Keyboard shortcuts for expansion
