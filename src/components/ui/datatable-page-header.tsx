/**
 * DataTablePageHeader Component
 *
 * Standardized header for datatable pages with built-in padding.
 * Used with full-width datatables that have no page padding.
 *
 * Features:
 * - Consistent padding (px-4 py-6 or px-6 py-8)
 * - Title and description
 * - Right-aligned action buttons
 * - Responsive layout
 * - Optional stats/metrics section
 */

import type { ReactNode } from "react";

type DataTablePageHeaderProps = {
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Action buttons (right-aligned) */
  actions?: ReactNode;
  /** Stats or metrics section below header */
  stats?: ReactNode;
  /** Size variant */
  size?: "default" | "large";
  /** Custom padding */
  padding?: "default" | "large" | "none";
};

export function DataTablePageHeader({
  title,
  description,
  actions,
  stats,
  size = "default",
  padding = "default",
}: DataTablePageHeaderProps) {
  const paddingClass =
    padding === "large"
      ? "px-6 py-8"
      : padding === "none"
        ? ""
        : "px-4 py-3 md:py-6";

  const titleSize =
    size === "large" ? "text-3xl font-bold" : "text-2xl font-semibold";

  return (
    <div className={`border-b bg-background shadow-sm ${paddingClass}`}>
      <div className="flex items-start justify-between gap-4">
        {/* Hide title/description on mobile to avoid duplication with AppToolbar */}
        <div className="hidden space-y-1 md:block">
          <h1 className={`tracking-tight ${titleSize}`}>{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 md:ml-auto md:w-auto">
            {actions}
          </div>
        )}
      </div>

      {stats && <div className="mt-6 hidden md:block">{stats}</div>}
    </div>
  );
}
