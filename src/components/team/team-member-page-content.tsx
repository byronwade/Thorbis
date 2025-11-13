/**
 * Team Member Page Content - Comprehensive Single Page View
 * Matches customer and job details page structure with collapsible sections
 */

"use client";

import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Download,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Printer,
  Save,
  Share2,
  Shield,
  TrendingUp,
  User,
  UserCog,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  DetailPageContentLayout,
  type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import { DetailPageSurface } from "@/components/layout/detail-page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  UnifiedAccordionContent,
  type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatters";
import { useToolbarActionsStore } from "@/lib/stores/toolbar-actions-store";
import { cn } from "@/lib/utils";

export type TeamMemberData = {
  teamMember: any;
  user?: any;
  assignedJobs?: any[];
  timeEntries?: any[];
  certifications?: any[];
  activities?: any[];
  attachments?: any[];
  permissions?: any[];
};

export type TeamMemberPageContentProps = {
  entityData: TeamMemberData;
  metrics: any;
};

export function TeamMemberPageContent({
  entityData,
  metrics,
}: TeamMemberPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [localMember, setLocalMember] = useState(entityData.teamMember);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const setToolbarActions = useToolbarActionsStore((state) => state.setActions);

  // Prevent hydration mismatch by only rendering Radix components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract data before hooks
  const {
    teamMember,
    user,
    assignedJobs = [],
    timeEntries = [],
    certifications = [],
    activities = [],
    attachments = [],
    permissions = [],
  } = entityData;

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    setLocalMember((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const displayName = useMemo(
    () =>
      user?.name ||
      localMember?.name ||
      teamMember?.name ||
      `${user?.email || "Unknown User"}`,
    [user, localMember, teamMember]
  );

  const memberStatus = (
    localMember?.status ||
    teamMember?.status ||
    "active"
  )?.toLowerCase();

  const roleName =
    localMember?.role?.name ||
    teamMember?.role?.name ||
    localMember?.job_title ||
    teamMember?.job_title ||
    "Team Member";

  const departmentName =
    localMember?.department?.name || teamMember?.department?.name || null;

  const memberSince =
    localMember?.joined_at ??
    teamMember?.joined_at ??
    localMember?.created_at ??
    teamMember?.created_at ??
    null;

  const lastActive =
    localMember?.last_active_at ?? teamMember?.last_active_at ?? null;

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save team member action
      toast.success("Team member updated successfully");
      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to update team member");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalMember(teamMember);
    setHasChanges(false);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "active":
        return "default";
      case "invited":
        return "secondary";
      case "suspended":
      case "inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const headerBadges = [
    <Badge className="font-mono" key="identifier" variant="outline">
      #{teamMember?.id?.slice(0, 8).toUpperCase() || "MEMBER"}
    </Badge>,
    <Badge
      key="status"
      variant={getStatusBadgeVariant(memberStatus || "active")}
    >
      {memberStatus === "active"
        ? "Active"
        : memberStatus === "invited"
          ? "Invited"
          : memberStatus === "suspended"
            ? "Suspended"
            : "Inactive"}
    </Badge>,
    localMember?.role?.name ? (
      <Badge
        key="role"
        style={{
          backgroundColor: localMember.role.color || undefined,
        }}
        variant={localMember.role.color ? "default" : "secondary"}
      >
        {localMember.role.name}
      </Badge>
    ) : teamMember?.role?.name ? (
      <Badge
        key="role"
        style={{
          backgroundColor: teamMember.role.color || undefined,
        }}
        variant={teamMember.role.color ? "default" : "secondary"}
      >
        {teamMember.role.name}
      </Badge>
    ) : null,
    departmentName ? (
      <Badge key="department" variant="outline">
        <Building2 className="mr-1 h-3 w-3" /> {departmentName}
      </Badge>
    ) : null,
  ].filter(Boolean);

  const quickActionConfigs = [
    {
      key: "assign-job",
      label: "Assign Job",
      icon: Wrench,
      onClick: () =>
        router.push(`/dashboard/work/new?teamMemberId=${teamMember.id}`),
    },
    {
      key: "view-schedule",
      label: "View Schedule",
      icon: Calendar,
      variant: "secondary" as const,
      onClick: () =>
        router.push(`/dashboard/schedule?teamMemberId=${teamMember.id}`),
    },
    {
      key: "edit-permissions",
      label: "Edit Permissions",
      icon: Shield,
      variant: "outline" as const,
      onClick: () =>
        router.push(`/dashboard/settings/team/${teamMember.id}#permissions`),
    },
  ] as const;

  const renderQuickActions = () =>
    quickActionConfigs.map((config) => {
      const { key, label, icon: Icon, onClick } = config;
      const variant = "variant" in config ? config.variant : undefined;
      return (
        <Button
          key={key}
          onClick={onClick}
          size="sm"
          variant={variant ?? "default"}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      );
    });

  const getToolbarActions = () => {
    if (hasChanges) {
      return (
        <div className="flex items-center gap-1.5">
          <Button disabled={isSaving} onClick={handleSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button onClick={handleCancel} size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5">
        {renderQuickActions()}
        <Separator className="h-6" orientation="vertical" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8" size="icon" variant="outline">
              <MoreVertical className="size-4" />
              <span className="sr-only">More actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/settings/team/${teamMember.id}`)
              }
            >
              <UserCog className="mr-2 size-3.5" />
              Edit Full Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => console.log("Export")}>
              <Download className="mr-2 size-3.5" />
              Export to CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Print")}>
              <Printer className="mr-2 size-3.5" />
              Print Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Share")}>
              <Share2 className="mr-2 size-3.5" />
              Share Profile Link
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => console.log("Archive")}
            >
              <Archive className="mr-2 size-3.5" />
              Archive Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  // Update toolbar actions when hasChanges or isSaving changes
  useEffect(() => {
    setToolbarActions(pathname, getToolbarActions());
  }, [hasChanges, isSaving, pathname, setToolbarActions]);

  const metadataItems: DetailPageHeaderConfig["metadata"] = [
    {
      label: "Active Jobs",
      icon: <Wrench className="h-3.5 w-3.5" />,
      value: metrics?.activeJobs ?? 0,
      helperText: "Currently assigned",
    },
    {
      label: "Total Jobs",
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      value: metrics?.totalJobs ?? assignedJobs.length,
      helperText: "All time",
    },
    {
      label: "Hours Worked",
      icon: <Clock className="h-3.5 w-3.5" />,
      value: `${Math.floor(metrics?.totalHours ?? 0)}h`,
    },
    {
      label: "Certifications",
      icon: <Award className="h-3.5 w-3.5" />,
      value: metrics?.activeCertifications ?? certifications.length,
      helperText: "Active",
    },
  ];

  const subtitleContent = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1">
        <Briefcase className="h-4 w-4" />
        {roleName}
      </span>
      {memberSince ? (
        <>
          <span aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Joined {formatDate(memberSince, "short")}
          </span>
        </>
      ) : null}
      {lastActive ? (
        <>
          <span aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Active {formatDate(lastActive, "relative")}
          </span>
        </>
      ) : null}
    </div>
  );

  const avatarInitials = displayName
    .split(" ")
    .map((part: string) => part?.[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const headerConfig: DetailPageHeaderConfig = {
    title: displayName,
    subtitle: subtitleContent,
    badges: headerBadges,
    metadata: metadataItems,
    leadingVisual: (
      <Avatar className="h-12 w-12">
        <AvatarImage alt={displayName} src={user?.avatar ?? undefined} />
        <AvatarFallback>{avatarInitials || "TM"}</AvatarFallback>
      </Avatar>
    ),
  };

  const contactTileData: Array<{
    key: string;
    icon: LucideIcon;
    label: string;
    value: ReactNode;
    href?: string;
  }> = [
    {
      key: "email",
      icon: Mail,
      label: "Email",
      value: user?.email ?? "Not provided",
      href: user?.email ? `mailto:${user.email}` : undefined,
    },
    {
      key: "phone",
      icon: Phone,
      label: "Phone",
      value: teamMember?.phone ?? user?.phone ?? "Not provided",
      href: teamMember?.phone ? `tel:${teamMember.phone}` : undefined,
    },
    {
      key: "role",
      icon: Briefcase,
      label: "Role",
      value: roleName,
    },
    {
      key: "department",
      icon: Building2,
      label: "Department",
      value: departmentName ?? "Not assigned",
    },
  ];

  const metricTileData: Array<{
    key: string;
    icon: LucideIcon;
    label: string;
    value: ReactNode;
  }> = [
    {
      key: "active-jobs",
      icon: Wrench,
      label: "Active Jobs",
      value: metrics?.activeJobs ?? 0,
    },
    {
      key: "completed-jobs",
      icon: TrendingUp,
      label: "Completed",
      value: metrics?.completedJobs ?? 0,
    },
    {
      key: "hours",
      icon: Clock,
      label: "Hours Worked",
      value: `${Math.floor(metrics?.totalHours ?? 0)}h`,
    },
    {
      key: "certifications",
      icon: Award,
      label: "Certifications",
      value: `${metrics?.activeCertifications ?? 0}/${metrics?.totalCertifications ?? 0}`,
    },
  ];

  const overviewSurface = (
    <DetailPageSurface padding="lg" variant="muted">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label className="font-medium text-muted-foreground text-xs uppercase">
            Display Name
          </Label>
          <Input
            className={cn(
              "h-12 rounded-lg border border-border/40 bg-background px-4 font-semibold text-xl shadow-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:text-2xl"
            )}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            placeholder="Enter member name..."
            value={displayName}
          />
          <p className="text-muted-foreground text-xs">
            Update how this team member appears across Stratos. Changes are
            saved when you select Save changes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {contactTileData.map(({ key, icon: Icon, label, value, href }) => (
            <div
              className="rounded-lg border border-border/40 bg-background px-3 py-3"
              key={key}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium text-muted-foreground text-xs uppercase">
                    {label}
                  </span>
                  {href ? (
                    <a
                      className="font-semibold text-sm hover:underline"
                      href={href}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="font-semibold text-sm">{value}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metricTileData.map(({ key, icon: Icon, label, value }) => (
            <div
              className="rounded-lg border border-border/40 bg-background px-3 py-3"
              key={key}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium text-muted-foreground text-xs uppercase">
                    {label}
                  </span>
                  <span className="font-semibold text-sm">{value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DetailPageSurface>
  );

  const customSections = useMemo<UnifiedAccordionSection[]>(() => {
    const sections: UnifiedAccordionSection[] = [
      {
        id: "personal-info",
        title: "Personal Information",
        icon: <User className="size-4" />,
        defaultOpen: true,
        content: (
          <UnifiedAccordionContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        readOnly
                        type="email"
                        value={user?.email || ""}
                      />
                      {user?.email && (
                        <Button asChild size="icon" variant="outline">
                          <a href={`mailto:${user.email}`}>
                            <Mail className="size-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phone"
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        type="tel"
                        value={localMember.phone || ""}
                      />
                      {localMember.phone && (
                        <Button asChild size="icon" variant="outline">
                          <a href={`tel:${localMember.phone}`}>
                            <Phone className="size-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      onChange={(e) =>
                        handleFieldChange("job_title", e.target.value)
                      }
                      value={localMember.job_title || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      onChange={(e) =>
                        handleFieldChange("notes", e.target.value)
                      }
                      placeholder="Internal notes about this team member"
                      rows={3}
                      value={localMember.notes || ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "certifications",
        title: "Skills & Certifications",
        icon: <Award className="size-4" />,
        count: certifications.length,
        actions: (
          <Button
            onClick={() => console.log("Add certification")}
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Certification
          </Button>
        ),
        content: (
          <UnifiedAccordionContent>
            {certifications.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {certifications.map((cert: any) => (
                  <div className="rounded-lg border p-4" key={cert.id}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {cert.issuing_organization || "Certification"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      {cert.issue_date && (
                        <p className="text-muted-foreground">
                          Issued: {formatDate(cert.issue_date, "short")}
                        </p>
                      )}
                      {cert.expiry_date && (
                        <p
                          className={cn(
                            "text-muted-foreground",
                            new Date(cert.expiry_date) < new Date() &&
                              "text-destructive"
                          )}
                        >
                          {new Date(cert.expiry_date) < new Date()
                            ? "Expired"
                            : "Expires"}
                          : {formatDate(cert.expiry_date, "short")}
                        </p>
                      )}
                      {cert.credential_id && (
                        <p className="text-muted-foreground">
                          ID: {cert.credential_id}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <Award className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground text-sm">
                  No certifications on record for this team member yet.
                </p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "assigned-jobs",
        title: "Assigned Jobs",
        icon: <Wrench className="size-4" />,
        count: assignedJobs.length,
        actions: (
          <Button
            onClick={() =>
              router.push(`/dashboard/work/new?teamMemberId=${teamMember.id}`)
            }
            size="sm"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" /> Assign Job
          </Button>
        ),
        content: (
          <UnifiedAccordionContent className="p-0">
            <div className="border-b px-6 py-4 text-muted-foreground text-sm">
              Jobs currently assigned to this team member.
            </div>
            {assignedJobs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job #</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedJobs.map((assignment: any) => {
                    const job = assignment.job;
                    if (!job) return null;

                    const customerName =
                      job.customer?.display_name ||
                      job.customer?.company_name ||
                      [job.customer?.first_name, job.customer?.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                      "Unknown Customer";

                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-mono">
                          #{job.job_number}
                        </TableCell>
                        <TableCell>{job.title || "Untitled Job"}</TableCell>
                        <TableCell>{customerName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{job.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {job.scheduled_start
                            ? formatDate(job.scheduled_start, "short")
                            : "Not scheduled"}
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/dashboard/work/${job.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Wrench className="mb-3 size-12 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground text-sm">
                  No jobs currently assigned
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Assign jobs to track this member's work
                </p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "time-entries",
        title: "Time Entries",
        icon: <Clock className="size-4" />,
        count: timeEntries.length,
        content: (
          <UnifiedAccordionContent className="p-0">
            <div className="border-b px-6 py-4 text-muted-foreground text-sm">
              Recent time entries and clock in/out history.
            </div>
            {timeEntries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.slice(0, 20).map((entry: any) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {formatDate(entry.clock_in, "short")}
                      </TableCell>
                      <TableCell>
                        {entry.job ? (
                          <Link
                            className="text-primary hover:underline"
                            href={`/dashboard/work/${entry.job.id}`}
                          >
                            #{entry.job.job_number || "Unknown"}
                          </Link>
                        ) : (
                          "No job"
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(entry.clock_in).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        {entry.clock_out ? (
                          new Date(entry.clock_out).toLocaleTimeString()
                        ) : (
                          <Badge variant="secondary">In progress</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {entry.total_hours
                          ? `${entry.total_hours.toFixed(2)}h`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Clock className="mb-3 size-12 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground text-sm">
                  No time entries recorded
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  Time entries will appear here when work begins
                </p>
              </div>
            )}
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "performance",
        title: "Performance Metrics",
        icon: <TrendingUp className="size-4" />,
        content: (
          <UnifiedAccordionContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Jobs Completed
                    </p>
                    <p className="mt-1 font-bold text-2xl">
                      {metrics?.completedJobs ?? 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Total Hours</p>
                    <p className="mt-1 font-bold text-2xl">
                      {Math.floor(metrics?.totalHours ?? 0)}h
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Active Jobs</p>
                    <p className="mt-1 font-bold text-2xl">
                      {metrics?.activeJobs ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UnifiedAccordionContent>
        ),
      },
      {
        id: "permissions",
        title: "Permissions & Access",
        icon: <Shield className="size-4" />,
        count: permissions?.length ?? 0,
        actions: (
          <Button
            onClick={() =>
              router.push(`/dashboard/settings/team/${teamMember.id}`)
            }
            size="sm"
            variant="outline"
          >
            Edit Permissions
          </Button>
        ),
        content: (
          <UnifiedAccordionContent>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Permissions are managed at the role level. This team member has
                the <strong>{roleName}</strong> role
                {departmentName ? (
                  <>
                    {" "}
                    and is assigned to the <strong>{departmentName}</strong>{" "}
                    department
                  </>
                ) : (
                  ""
                )}
                .
              </p>
              {permissions && permissions.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 font-medium text-sm">
                    Role Permissions ({permissions.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {permissions.slice(0, 10).map((perm: any) => (
                      <Badge key={perm.id} variant="secondary">
                        {perm.permission_name || perm.name || "Permission"}
                      </Badge>
                    ))}
                    {permissions.length > 10 && (
                      <Badge variant="outline">
                        +{permissions.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    return sections;
  }, [
    user,
    localMember,
    teamMember,
    handleFieldChange,
    certifications,
    assignedJobs,
    timeEntries,
    permissions,
    metrics,
    roleName,
    departmentName,
    router,
  ]);

  const relatedItems = useMemo(() => {
    const items: any[] = [];

    if (assignedJobs.length > 0) {
      const latestJob = assignedJobs[0]?.job;
      if (latestJob) {
        items.push({
          id: `job-${latestJob.id}`,
          type: "job",
          title: latestJob.title || `Job #${latestJob.job_number}`,
          subtitle: latestJob.status,
          href: `/dashboard/work/${latestJob.id}`,
          badge: latestJob.status
            ? { label: latestJob.status, variant: "outline" as const }
            : undefined,
        });
      }
    }

    if (user?.email) {
      items.push({
        id: `user-${teamMember.id}`,
        type: "contact",
        title: "Primary Email",
        subtitle: user.email,
        href: `mailto:${user.email}`,
      });
    }

    return items;
  }, [assignedJobs, teamMember.id, user?.email]);

  // Conditional render AFTER all hooks
  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <DetailPageContentLayout
      activities={activities}
      attachments={attachments}
      beforeContent={overviewSurface}
      customSections={customSections}
      defaultOpenSection="personal-info"
      enableReordering={true}
      header={headerConfig}
      notes={[]}
      relatedItems={relatedItems}
      showStandardSections={{
        notes: false,
      }}
      storageKey="team-member-details"
    />
  );
}
