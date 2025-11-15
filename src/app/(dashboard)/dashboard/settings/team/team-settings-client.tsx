"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import type {
  TeamMemberWithDetails,
  TeamOverviewSnapshot,
} from "@/actions/team";
import { SettingsPageLayout } from "@/components/settings/settings-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type RoleSummary = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  member_count?: number;
  is_system?: boolean;
};

type DepartmentSummary = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  member_count?: number;
};

interface TeamSettingsClientProps {
  members: TeamMemberWithDetails[];
  roles: RoleSummary[];
  departments: DepartmentSummary[];
  overview: TeamOverviewSnapshot;
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function getInitials(name?: string | null) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  invited: "bg-warning/10 text-warning border-warning/30",
  suspended: "bg-destructive/10 text-destructive border-destructive/30",
  archived: "bg-muted text-muted-foreground border-muted",
};

export default function TeamSettingsClient({
  members,
  roles,
  departments,
  overview,
}: TeamSettingsClientProps) {
  const { totals } = overview;
  const activeMembersCount = totals.active;
  const invitedMembersCount = totals.invited;
  const suspendedMembersCount = totals.suspended;

  const primaryRoles = roles.slice(0, 4);
  const highlightedDepartments = departments.slice(0, 4);
  const acceptancePercent = Math.round(overview.onboardingAcceptanceRate * 100);
  const lastInviteLabel = overview.lastInviteAt
    ? `${formatDistanceToNow(new Date(overview.lastInviteAt), {
        addSuffix: true,
      })}`
    : "No invites sent yet";
  const telemetryMetrics = [
    {
      label: "Role coverage",
      value: overview.roles.total
        ? `${overview.roles.custom}/${overview.roles.total}`
        : "0",
      helper: "Custom / total roles",
    },
    {
      label: "Departments",
      value: overview.departments.total.toString(),
      helper:
        overview.departments.total > 0
          ? `${overview.departments.membersAssigned} members assigned`
          : "No routing groups yet",
    },
    {
      label: "Onboarding",
      value: `${acceptancePercent}%`,
      helper: `${invitedMembersCount} pending invite${
        invitedMembersCount === 1 ? "" : "s"
      }`,
    },
  ];

  return (
    <SettingsPageLayout
      description="Invite teammates, assign roles, and keep your workspace access organized."
      hasChanges={false}
      helpText="Roles control permissions; departments make routing and reporting easier."
      isPending={false}
      title="Team & Permissions"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Team & Permissions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/settings/team/invite">
                <UserPlus className="mr-2 size-4" />
                Invite teammates
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings/team/roles">Manage roles</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings/team/departments">
                Departments
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-base">Team readiness</CardTitle>
              <CardDescription>
                Hiring telemetry + access guardrails pulled from Supabase
              </CardDescription>
            </div>
            <Badge variant="outline">{lastInviteLabel}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                Completion
              </p>
              <p className="font-semibold text-4xl">
                {overview.readinessScore}%
              </p>
            </div>
            <div className="flex-1 space-y-2">
              <Progress value={overview.readinessScore} />
              <p className="text-muted-foreground text-xs">
                {overview.stepsCompleted} of {overview.totalSteps} guardrails
                configured
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key metrics</CardTitle>
            <CardDescription>
              Live counts from team members, roles, and departments
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {telemetryMetrics.map((metric) => (
              <div
                className="rounded-xl border border-border/60 p-4"
                key={metric.label}
              >
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="mt-1 font-semibold text-2xl">{metric.value}</p>
                <p className="text-muted-foreground text-sm">{metric.helper}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Active members</CardDescription>
              <CardTitle className="text-3xl">{activeMembersCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Pending invitations</CardDescription>
              <CardTitle className="text-3xl">{invitedMembersCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Suspended / Disabled</CardDescription>
              <CardTitle className="text-3xl">
                {suspendedMembersCount}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {members.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <UserPlus className="size-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-semibold text-lg">No team members yet</p>
                <p className="text-muted-foreground text-sm">
                  Invite your first teammate to collaborate inside Thorbis.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/settings/team/invite">
                  Invite teammates
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Team members</CardTitle>
                <CardDescription>
                  Everyone with access to this workspace
                </CardDescription>
              </div>
              <Button asChild variant="ghost">
                <Link href="/dashboard/work/team">
                  <ArrowLeft className="mr-2 size-4 rotate-180" />
                  View workforce hub
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.slice(0, 12).map((member) => {
                    const statusClass =
                      statusStyles[member.status] ??
                      "bg-muted text-muted-foreground";
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                alt={member.user?.name ?? "Unknown member"}
                                src={member.user?.avatar ?? undefined}
                              />
                              <AvatarFallback>
                                {getInitials(member.user?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.user?.name ?? "Unknown member"}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {member.user?.email ?? "No email on file"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{member.role?.name ?? "No role"}</span>
                            {member.job_title && (
                              <span className="text-muted-foreground text-xs">
                                {member.job_title}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border px-2 py-0.5 font-medium text-xs",
                              statusClass
                            )}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(
                            member.last_active_at ?? member.joined_at
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="ghost">
                            <Link
                              href={`/dashboard/settings/team/${member.id}`}
                            >
                              Manage
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Roles overview</CardTitle>
                <CardDescription>
                  System + custom roles across your workspace
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/settings/team/roles">View roles</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {primaryRoles.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No roles configured yet.
                </p>
              ) : (
                primaryRoles.map((role) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={role.id}
                  >
                    <div className="flex flex-col">
                      <p className="font-medium">{role.name}</p>
                      {role.description && (
                        <p className="text-muted-foreground text-xs">
                          {role.description}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {role.member_count ?? 0} member
                      {(role.member_count ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Departments</CardTitle>
                <CardDescription>
                  Groups used for routing, approvals, and reporting
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/settings/team/departments">
                  Manage departments
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {highlightedDepartments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No departments created yet.
                </p>
              ) : (
                highlightedDepartments.map((dept) => (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={dept.id}
                  >
                    <div className="flex flex-col">
                      <p className="font-medium">{dept.name}</p>
                      {dept.description && (
                        <p className="text-muted-foreground text-xs">
                          {dept.description}
                        </p>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {dept.member_count ?? 0} member
                      {(dept.member_count ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsPageLayout>
  );
}
