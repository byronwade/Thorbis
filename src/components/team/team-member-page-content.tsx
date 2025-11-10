/**
 * Team Member Page Content
 *
 * Comprehensive team member profile with collapsible sections
 * Matches job and customer detail page patterns
 *
 * Sections:
 * - Personal Info (contact, role, hire date, status)
 * - Skills & Certifications (licenses, training, specializations)
 * - Schedule & Availability (working hours, time off)
 * - Assigned Jobs (current and upcoming jobs)
 * - Time Entries (clock in/out history)
 * - Performance Metrics (ratings, completion rate, efficiency)
 * - Payroll Settings (pay rate, commission, benefits)
 * - Activity Log (profile changes, assignments)
 */

"use client";

import {
  Award,
  Briefcase,
  Clock,
  Mail,
  Phone,
  Save,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import {
  UnifiedAccordionContent,
  UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type TeamMemberData = {
  teamMember: any;
  user?: any;
  assignedJobs?: any[];
  timeEntries?: any[];
  certifications?: any[];
  activities?: any[];
};

export type TeamMemberPageContentProps = {
  entityData: TeamMemberData;
  metrics: any;
};

export function TeamMemberPageContent({
  entityData,
  metrics,
}: TeamMemberPageContentProps) {
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    teamMember,
    user,
    assignedJobs = [],
    timeEntries = [],
    certifications = [],
    activities = [],
  } = entityData;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const displayName = user?.name || teamMember.name || "Unknown";
  const role = teamMember.role || "Team Member";
  const status = teamMember.status || "active";
  const hireDate = teamMember.hire_date
    ? new Date(teamMember.hire_date).toLocaleDateString()
    : null;

  const statusBadgeVariant =
    status === "active" ? "default" : status === "inactive" ? "secondary" : "destructive";

  const headerBadges = [
    <Badge key="id" variant="outline">
      ID: {teamMember.id.slice(0, 8).toUpperCase()}
    </Badge>,
    <Badge key="status" variant={statusBadgeVariant}>
      {status}
    </Badge>,
    hireDate ? (
      <Badge key="hire" variant="outline">
        Joined {hireDate}
      </Badge>
    ) : null,
  ].filter(Boolean);

  const customHeader = (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="rounded-md bg-muted/50 shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="size-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl">
                  {displayName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {headerBadges.map((badge, index) => (
                    <span key={index}>{badge}</span>
                  ))}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold sm:text-3xl">{displayName}</h1>
                  <p className="text-sm text-muted-foreground sm:text-base">{role}</p>
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setHasChanges(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
                <Button disabled={isSaving} onClick={() => {}} size="sm">
                  <Save className="mr-2 size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-3">
              {user.email && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                  href={`mailto:${user.email}`}
                >
                  <Mail className="size-4" />
                  {user.email}
                </a>
              )}

              {user.phone && (
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5"
                  href={`tel:${user.phone}`}
                >
                  <Phone className="size-4" />
                  {user.phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input value={displayName} readOnly />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={role} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email || "N/A"} readOnly />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={user?.phone || "N/A"} readOnly />
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input value={hireDate || "N/A"} readOnly />
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={statusBadgeVariant}>{status}</Badge>
              </div>
            </div>
          </UnifiedAccordionContent>
        ),
      },
    ];

    sections.push({
      id: "certifications",
      title: "Skills & Certifications",
      icon: <Award className="size-4" />,
      count: certifications.length,
      content: (
        <UnifiedAccordionContent>
          {certifications.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="rounded-lg border p-4">
                  <p className="font-medium">{cert.name}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Issued: {new Date(cert.issue_date).toLocaleDateString()}
                  </p>
                  {cert.expiry_date && (
                    <p className="text-muted-foreground text-sm">
                      Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm">
              No certifications recorded
            </p>
          )}
        </UnifiedAccordionContent>
      ),
    });

    sections.push({
      id: "assigned-jobs",
      title: "Assigned Jobs",
      icon: <Briefcase className="size-4" />,
      count: assignedJobs.length,
      content: (
        <UnifiedAccordionContent>
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
                {assignedJobs.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono">#{job.job_number}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      {job.customer?.first_name} {job.customer?.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {job.scheduled_date
                        ? new Date(job.scheduled_date).toLocaleDateString()
                        : "Not scheduled"}
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/dashboard/work/${job.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground text-sm">
              No jobs currently assigned
            </p>
          )}
        </UnifiedAccordionContent>
      ),
    });

    sections.push({
      id: "time-entries",
      title: "Time Entries",
      icon: <Clock className="size-4" />,
      count: timeEntries.length,
      content: (
        <UnifiedAccordionContent>
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
                {timeEntries.slice(0, 10).map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.clock_in).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/work/${entry.job_id}`}
                        className="text-primary hover:underline"
                      >
                        #{entry.job?.job_number || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(entry.clock_in).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {entry.clock_out
                        ? new Date(entry.clock_out).toLocaleTimeString()
                        : "In progress"}
                    </TableCell>
                    <TableCell>{entry.total_hours?.toFixed(2) || "0.00"}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground text-sm">
              No time entries recorded
            </p>
          )}
        </UnifiedAccordionContent>
      ),
    });

    sections.push({
      id: "performance",
      title: "Performance Metrics",
      icon: <TrendingUp className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Jobs Completed</p>
              <p className="mt-1 font-bold text-2xl">{metrics.totalJobs}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Avg. Rating</p>
              <p className="mt-1 font-bold text-2xl">
                {metrics.customerRating > 0 ? metrics.customerRating.toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">Total Hours</p>
              <p className="mt-1 font-bold text-2xl">{Math.floor(metrics.hoursWorked)}h</p>
            </div>
          </div>
        </UnifiedAccordionContent>
      ),
    });

    return sections;
  }, [
    assignedJobs,
    certifications,
    displayName,
    hireDate,
    metrics.customerRating,
    metrics.hoursWorked,
    metrics.totalJobs,
    role,
    status,
    statusBadgeVariant,
    timeEntries,
  ]);

  const relatedItems = useMemo(() => {
    const items: any[] = [];

    if (assignedJobs.length > 0) {
      const latestJob = assignedJobs[0];
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

  return (
    <DetailPageContentLayout
      customHeader={customHeader}
      customSections={customSections}
      activities={activities}
      notes={[]}
      relatedItems={relatedItems}
      showStandardSections={{
        notes: false,
        attachments: false,
      }}
      defaultOpenSection="personal-info"
    />
  );
}
