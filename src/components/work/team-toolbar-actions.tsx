"use client";

/**
 * Team Toolbar Actions - Client Component
 *
 * Toolbar actions for the team members page
 * - Advanced filters dropdown
 * - Column visibility toggle
 * - Invite Team Member button
 * - Import/Export
 */

import { BaseToolbarActions } from "@/components/ui/base-toolbar-actions";
import { ColumnVisibilityMenu } from "@/components/ui/column-visibility-menu";
import { TeamFilterDropdown } from "@/components/work/team-filter-dropdown";

// Define hideable columns for team members
const TEAM_MEMBERS_COLUMNS = [
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
];

interface TeamToolbarActionsProps {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
}

export function TeamToolbarActions({
  totalCount = 0,
  activeCount,
  archivedCount,
}: TeamToolbarActionsProps) {
  return (
    <BaseToolbarActions
      beforePrimaryAction={
        <div className="flex items-center gap-2">
          <TeamFilterDropdown
            activeCount={activeCount}
            archivedCount={archivedCount}
            totalCount={totalCount}
          />
          <ColumnVisibilityMenu
            columns={TEAM_MEMBERS_COLUMNS}
            entity="team_members"
          />
        </div>
      }
      importExportDataType="team"
      primaryAction={{
        href: "/dashboard/work/team/invite",
        label: "Invite Team Member",
      }}
      viewSwitcherSection={undefined} // Kanban disabled
    />
  );
}
