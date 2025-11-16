/**
 * Team Toolbar Actions
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

// Critical columns (always visible - shown for reference)
const TEAM_CRITICAL_COLUMNS = [
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
];

// Optional columns (can be hidden)
const TEAM_OPTIONAL_COLUMNS = [
  { key: "department", label: "Department" },
  { key: "jobTitle", label: "Job Title" },
  { key: "lastActive", label: "Last Active" },
];

type TeamToolbarActionsProps = {
  totalCount?: number;
  activeCount?: number;
  archivedCount?: number;
};

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
            columns={TEAM_OPTIONAL_COLUMNS}
            criticalColumns={TEAM_CRITICAL_COLUMNS}
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
