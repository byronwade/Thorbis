"use client";

/**
 * Team Toolbar Actions - Client Component
 *
 * Provides team-specific toolbar actions
 * - Invite team member button
 * - Import/Export actions
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";

export function TeamToolbarActions() {
  return (
    <BaseToolbarActions
      primaryAction={{
        href: "/dashboard/work/team/invite",
        label: "Invite Team Member",
      }}
      importExportDataType="team"
    />
  );
}
