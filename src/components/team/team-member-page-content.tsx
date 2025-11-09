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
  User,
  Award,
  Calendar,
  Briefcase,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CollapsibleDataSection, CollapsibleActionButton } from "@/components/ui/collapsible-data-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

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

const defaultAccordionSections = [
  "personal-info",
  "assigned-jobs",
  "performance",
];

export function TeamMemberPageContent({
  entityData,
  metrics,
}: TeamMemberPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
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

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  const displayName = user?.name || teamMember.name || "Unknown";
  const role = teamMember.role || "Team Member";
  const status = teamMember.status || "active";

  return (
    <div className="flex-1">
      {/* Hero Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Team Member Badge */}
          <div className="mb-3">
            <Badge variant="outline">
              ID: {teamMember.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          {/* Name and Status */}
          <div className="mb-4 flex items-start justify-between gap-4">
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
              <div className="flex-1">
                <h1 className="font-bold text-4xl">{displayName}</h1>
                <p className="mt-2 text-muted-foreground text-xl">{role}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      status === "active" ? "default" : status === "inactive" ? "secondary" : "destructive"
                    }
                  >
                    {status}
                  </Badge>
                  {teamMember.hire_date && (
                    <Badge variant="outline">
                      Joined {new Date(teamMember.hire_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setHasChanges(false)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
                <Button
                  disabled={isSaving}
                  onClick={() => {}}
                  size="sm"
                >
                  <Save className="mr-2 size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* Contact Info Pills */}
          {user && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

      {/* Collapsible Sections */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div suppressHydrationWarning>
          <Accordion
            className="space-y-3"
            defaultValue={defaultAccordionSections}
            type="multiple"
          >
            {/* Personal Info */}
            <CollapsibleDataSection
              value="personal-info"
              title="Personal Information"
              icon={<User className="size-4" />}
            >
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
                  <Input
                    value={
                      teamMember.hire_date
                        ? new Date(teamMember.hire_date).toLocaleDateString()
                        : "N/A"
                    }
                    readOnly
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={status === "active" ? "default" : "secondary"}>
                    {status}
                  </Badge>
                </div>
              </div>
            </CollapsibleDataSection>

            {/* Skills & Certifications */}
            <CollapsibleDataSection
              value="certifications"
              title="Skills & Certifications"
              icon={<Award className="size-4" />}
              count={certifications.length}
            >
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
            </CollapsibleDataSection>

            {/* Assigned Jobs */}
            <CollapsibleDataSection
              value="assigned-jobs"
              title="Assigned Jobs"
              icon={<Briefcase className="size-4" />}
              count={assignedJobs.length}
              fullWidthContent
            >
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
            </CollapsibleDataSection>

            {/* Time Entries */}
            <CollapsibleDataSection
              value="time-entries"
              title="Time Entries"
              icon={<Clock className="size-4" />}
              count={timeEntries.length}
              fullWidthContent
            >
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
            </CollapsibleDataSection>

            {/* Performance Metrics */}
            <CollapsibleDataSection
              value="performance"
              title="Performance Metrics"
              icon={<TrendingUp className="size-4" />}
            >
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
            </CollapsibleDataSection>

            {/* Activity Log */}
            <CollapsibleDataSection
              value="activity"
              title="Activity Log"
              icon={<Activity className="size-4" />}
              count={activities.length}
            >
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity: any) => (
                    <div key={activity.id} className="flex gap-4 rounded-lg border p-4">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {activity.user?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          {activity.user?.name} •{" "}
                          {formatDistance(new Date(activity.created_at), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm">
                    No activity yet
                  </p>
                )}
              </div>
            </CollapsibleDataSection>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
