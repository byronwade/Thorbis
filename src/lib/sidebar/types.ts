import type { LucideIcon } from "lucide-react";

/**
 * Sidebar item interaction modes:
 * - link: Traditional navigation (uses Next.js Link)
 * - tab: View switching without routing (state-based)
 * - filter: Data filtering/view control (callback-based)
 */
export type SidebarItemMode = "link" | "tab" | "filter";

/**
 * Base configuration for all sidebar items
 */
export type BaseSidebarItem = {
  title: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
};

/**
 * Sidebar item that navigates to a URL (traditional routing)
 */
export type LinkSidebarItem = BaseSidebarItem & {
  mode: "link";
  url: string;
  items?: LinkSidebarItem[];
};

/**
 * Sidebar item that switches tabs/views without routing
 */
export type TabSidebarItem = BaseSidebarItem & {
  mode: "tab";
  value: string; // The tab value to activate
};

/**
 * Sidebar item that triggers a filter/view change via callback
 */
export type FilterSidebarItem = BaseSidebarItem & {
  mode: "filter";
  value: string; // The filter value
  count?: number; // Optional count to display
};

/**
 * Union type for all sidebar item types
 */
export type SidebarItem = LinkSidebarItem | TabSidebarItem | FilterSidebarItem;

/**
 * Grouped sidebar items with optional label
 */
export type SidebarGroup = {
  label?: string;
  items: SidebarItem[];
};

/**
 * Configuration for sidebar behavior in a page
 */
export type SidebarConfig = {
  /**
   * Navigation items for link mode
   */
  items?: SidebarItem[];

  /**
   * Grouped navigation items
   */
  groups?: SidebarGroup[];

  /**
   * Mode for the sidebar
   */
  mode?: SidebarItemMode;

  /**
   * Current active value (for tabs/filters)
   */
  activeValue?: string;

  /**
   * Callback when a tab/filter item is clicked
   */
  onValueChange?: (value: string) => void;

  /**
   * Default value (for tabs/filters)
   */
  defaultValue?: string;
};
