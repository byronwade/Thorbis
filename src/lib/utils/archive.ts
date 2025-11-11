/**
 * Archive Utilities
 *
 * Reusable utilities for handling archived items across the application:
 * - Filter archived items by default
 * - Visual styling for archived rows
 * - Archive/restore functionality
 */

/**
 * Archive filter options for datatables
 */
export type ArchiveFilter = "active" | "archived" | "all";

/**
 * Archive filter options for dropdowns
 */
export const ARCHIVE_FILTER_OPTIONS = [
  { value: "active", label: "Active Only" },
  { value: "archived", label: "Archived Only" },
  { value: "all", label: "All Items" },
] as const;

/**
 * Get CSS classes for archived row styling
 * Applies greyed out, semi-transparent styling to archived items
 */
export function getArchivedRowClassName(isArchived: boolean): string {
  if (!isArchived) return "";

  return "opacity-50 bg-muted/30 hover:bg-muted/40 text-muted-foreground";
}

/**
 * Check if an item is archived based on archived_at timestamp
 */
export function isItemArchived(archivedAt: string | null | undefined): boolean {
  return archivedAt != null;
}

/**
 * Filter items based on archive status
 */
export function filterByArchiveStatus<T extends { archived_at?: string | null }>(
  items: T[],
  filter: ArchiveFilter
): T[] {
  switch (filter) {
    case "active":
      return items.filter((item) => !isItemArchived(item.archived_at));
    case "archived":
      return items.filter((item) => isItemArchived(item.archived_at));
    case "all":
      return items;
    default:
      return items;
  }
}

/**
 * Build Supabase query filter for archive status
 * Use this to filter at the database level (more efficient)
 */
export function getArchiveQueryFilter(filter: ArchiveFilter): {
  column: "archived_at";
  operator: "is" | "not.is";
  value: null;
} | null {
  switch (filter) {
    case "active":
      return { column: "archived_at", operator: "is", value: null };
    case "archived":
      return { column: "archived_at", operator: "not.is", value: null };
    case "all":
      return null; // No filter needed
    default:
      return null;
  }
}

/**
 * Format archive date for display
 */
export function formatArchiveDate(archivedAt: string | null | undefined): string {
  if (!archivedAt) return "N/A";

  const date = new Date(archivedAt);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get archive badge variant
 */
export function getArchiveBadgeVariant(isArchived: boolean): "outline" | "secondary" {
  return isArchived ? "outline" : "secondary";
}
