"use client";

/**
 * TeamsTable Component
 * Full-width table for displaying team members using standard FullWidthDataTable
 *
 * Features:
 * - Consistent with all other work page tables
 * - Row selection with bulk actions
 * - Status and role badges
 * - Sortable columns
 * - Archive filtering with visual styling
 * - Archived items greyed out and hidden by default
 */

import { Archive, ArchiveRestore, Eye, Mail, MoreHorizontal, UserX, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { archiveTeamMember, restoreTeamMember, suspendTeamMember } from "@/actions/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RowActionsDropdown } from "@/components/ui/row-actions-dropdown";
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { ArchiveFilterSelect } from "@/components/ui/archive-filter-select";
import { useArchiveStore } from "@/lib/stores/archive-store";
import { filterByArchiveStatus, getArchivedRowClassName, isItemArchived } from "@/lib/utils/archive";

type UserStatus = "active" | "invited" | "suspended";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleColor?: string;
  departmentId?: string;
  departmentName?: string;
  departmentColor?: string;
  status: UserStatus;
  avatar?: string;
  jobTitle?: string;
  phone?: string;
  joinedDate: string;
  lastActive: string;
  archived_at?: string | null;
};

type TeamsTableProps = {
  teamMembers: TeamMember[];
  itemsPerPage?: number;
};

export function TeamsTable({
  teamMembers,
  itemsPerPage = 50,
}: TeamsTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Archive filter from store
  const archiveFilter = useArchiveStore((state) => state.filters.team_members);

  // Filter data based on archive status
  const filteredTeamMembers = useMemo(() => {
    return filterByArchiveStatus(teamMembers, archiveFilter);
  }, [teamMembers, archiveFilter]);

  // Calculate counts for filter dropdown
  const activeCount = useMemo(() => teamMembers.filter(m => !isItemArchived(m.archived_at)).length, [teamMembers]);
  const archivedCount = useMemo(() => teamMembers.filter(m => isItemArchived(m.archived_at)).length, [teamMembers]);

  // Helper functions
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleSuspendMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to suspend this team member?")) {
      return;
    }

    setIsLoading(true);
    const result = await suspendTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member suspended successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to suspend team member");
    }
  };

  const handleArchiveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to archive this team member?")) {
      return;
    }

    setIsLoading(true);
    const result = await archiveTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member archived successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to archive team member");
    }
  };

  const handleRestoreMember = async (memberId: string) => {
    setIsLoading(true);
    const result = await restoreTeamMember(memberId);
    setIsLoading(false);

    if (result.success) {
      toast.success("Team member restored successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to restore team member");
    }
  };

  const getStatusBadgeVariant = (
    status: UserStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "active":
        return "default";
      case "invited":
        return "secondary";
      case "suspended":
        return "outline";
    }
  };

  const getStatusLabel = (status: UserStatus): string => {
    switch (status) {
      case "active":
        return "Active";
      case "invited":
        return "Invited";
      case "suspended":
        return "Suspended";
    }
  };

  // Define columns
  const columns: ColumnDef<TeamMember>[] = [
    {
      key: "member",
      header: "Member",
      render: (member) => (
        <Link
          className="flex items-center gap-3 hover:underline"
          href={`/dashboard/work/team/${member.id}`}
        >
          <Avatar className="size-8">
            <AvatarImage alt={member.name} src={member.avatar} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{member.name}</div>
            <div className="text-sm text-muted-foreground">
              {member.email}
            </div>
          </div>
        </Link>
      ),
      width: "flex-1",
    },
    {
      key: "role",
      header: "Role",
      render: (member) => (
        <Badge
          style={{
            backgroundColor: member.roleColor || undefined,
          }}
          variant={member.roleColor ? "default" : "secondary"}
        >
          {member.roleName}
        </Badge>
      ),
      width: "w-32",
      hideOnMobile: true,
    },
    {
      key: "department",
      header: "Department",
      render: (member) => {
        if (!member.departmentName) return <span className="text-muted-foreground">—</span>;
        return (
          <Badge
            style={{
              backgroundColor: member.departmentColor || undefined,
            }}
            variant={member.departmentColor ? "default" : "outline"}
          >
            {member.departmentName}
          </Badge>
        );
      },
      width: "w-32",
      hideOnMobile: true,
    },
    {
      key: "jobTitle",
      header: "Job Title",
      render: (member) => member.jobTitle || <span className="text-muted-foreground">—</span>,
      width: "w-40",
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "Status",
      render: (member) => {
        const isArchived = isItemArchived(member.archived_at);

        if (isArchived) {
          return (
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Archived
              </Badge>
              <Badge variant={getStatusBadgeVariant(member.status)} className="text-xs">
                {getStatusLabel(member.status)}
              </Badge>
            </div>
          );
        }

        return (
          <Badge variant={getStatusBadgeVariant(member.status)}>
            {getStatusLabel(member.status)}
          </Badge>
        );
      },
      width: "w-28",
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (member) => (
        <span className="text-sm text-muted-foreground">
          {member.lastActive}
        </span>
      ),
      width: "w-32",
      hideOnMobile: true,
    },
    {
      key: "actions",
      header: "",
      render: (member) => {
        const isArchived = isItemArchived(member.archived_at);

        return (
          <RowActionsDropdown
            actions={[
              {
                label: "View Details",
                icon: Eye,
                href: `/dashboard/work/team/${member.id}`,
              },
              ...(!isArchived ? [
                {
                  label: "Send Email",
                  icon: Mail,
                  onClick: () => {
                    window.location.href = `mailto:${member.email}`;
                  },
                },
                {
                  label: "Suspend",
                  icon: UserX,
                  variant: "destructive" as const,
                  separatorBefore: true,
                  onClick: () => handleSuspendMember(member.id),
                },
                {
                  label: "Archive",
                  icon: Archive,
                  variant: "destructive" as const,
                  onClick: () => handleArchiveMember(member.id),
                },
              ] : [
                {
                  label: "Restore",
                  icon: ArchiveRestore,
                  variant: "default" as const,
                  separatorBefore: true,
                  onClick: () => handleRestoreMember(member.id),
                },
              ]),
            ]}
          />
        );
      },
      width: "w-12",
      shrink: true,
    },
  ];

  // Define bulk actions based on archive filter
  const bulkActions: BulkAction[] = useMemo(() => {
    const isViewingArchived = archiveFilter === "archived";

    if (isViewingArchived) {
      // Only show restore for archived items
      return [
        {
          label: "Restore",
          icon: <ArchiveRestore className="size-4" />,
          variant: "default",
          onClick: async (selectedIds) => {
            if (!confirm(`Are you sure you want to restore ${selectedIds.size} team member(s)?`)) {
              return;
            }

            setIsLoading(true);
            let successCount = 0;
            let failCount = 0;

            for (const memberId of selectedIds) {
              const result = await restoreTeamMember(memberId);
              if (result.success) {
                successCount++;
              } else {
                failCount++;
              }
            }

            setIsLoading(false);

            if (successCount > 0) {
              toast.success(`${successCount} team member(s) restored successfully`);
            }
            if (failCount > 0) {
              toast.error(`Failed to restore ${failCount} team member(s)`);
            }

            router.refresh();
          },
        },
      ];
    }

    // Default actions for active items
    return [
      {
        label: "Send Email",
        icon: <Mail className="size-4" />,
        variant: "default",
        onClick: (selectedIds) => {
          const selectedMembers = filteredTeamMembers.filter((m) => selectedIds.has(m.id));
          const emails = selectedMembers.map((m) => m.email).join(",");
          window.location.href = `mailto:${emails}`;
        },
      },
      {
        label: "Suspend",
        icon: <UserX className="size-4" />,
        variant: "destructive",
        onClick: async (selectedIds) => {
          if (!confirm(`Are you sure you want to suspend ${selectedIds.size} team member(s)?`)) {
            return;
          }

          setIsLoading(true);
          let successCount = 0;
          let failCount = 0;

          for (const memberId of selectedIds) {
            const result = await suspendTeamMember(memberId);
            if (result.success) {
              successCount++;
            } else {
              failCount++;
            }
          }

          setIsLoading(false);

          if (successCount > 0) {
            toast.success(`${successCount} team member(s) suspended successfully`);
          }
          if (failCount > 0) {
            toast.error(`Failed to suspend ${failCount} team member(s)`);
          }

          router.refresh();
        },
      },
      {
        label: "Archive",
        icon: <Archive className="size-4" />,
        variant: "destructive",
        onClick: async (selectedIds) => {
          if (!confirm(`Are you sure you want to archive ${selectedIds.size} team member(s)?`)) {
            return;
          }

          setIsLoading(true);
          let successCount = 0;
          let failCount = 0;

          for (const memberId of selectedIds) {
            const result = await archiveTeamMember(memberId);
            if (result.success) {
              successCount++;
            } else {
              failCount++;
            }
          }

          setIsLoading(false);

          if (successCount > 0) {
            toast.success(`${successCount} team member(s) archived successfully`);
          }
          if (failCount > 0) {
            toast.error(`Failed to archive ${failCount} team member(s)`);
          }

          router.refresh();
        },
      },
    ];
  }, [archiveFilter, filteredTeamMembers, router]);

  const handleInviteMember = () => {
    window.location.href = "/dashboard/work/team/invite";
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      customToolbarContent={
        <ArchiveFilterSelect
          activeCount={activeCount}
          archivedCount={archivedCount}
          entity="team_members"
          totalCount={teamMembers.length}
        />
      }
      data={filteredTeamMembers}
      emptyAction={
        <Button onClick={handleInviteMember} size="sm">
          Invite Team Member
        </Button>
      }
      emptyIcon={<Users className="size-8 text-muted-foreground" />}
      emptyMessage={
        archiveFilter === "archived"
          ? "No archived team members"
          : "No team members yet"
      }
      enableSelection={true}
      getItemId={(member) => member.id}
      getRowClassName={(member) => getArchivedRowClassName(isItemArchived(member.archived_at))}
      itemsPerPage={itemsPerPage}
      searchFilter={(member, query) => {
        const searchLower = query.toLowerCase();
        return (
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          (member.roleName && member.roleName.toLowerCase().includes(searchLower)) ||
          (member.departmentName && member.departmentName.toLowerCase().includes(searchLower)) ||
          (member.jobTitle && member.jobTitle.toLowerCase().includes(searchLower))
        );
      }}
      searchPlaceholder="Search by name or email..."
    />
  );
}
