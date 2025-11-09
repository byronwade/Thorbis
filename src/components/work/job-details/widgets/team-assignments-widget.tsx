/**
 * Team Assignments Widget - Server Component
 *
 * Displays assigned technicians and crew members for the job.
 * Shows primary assignee, team members, availability status, and contact info.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import { Calendar, Mail, Phone, UserCheck, Users } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";

interface TeamAssignmentsWidgetProps {
  job: Job;
  teamAssignments?: unknown[];
}

// Team member type from database
interface TeamMember {
  id: string;
  name: string;
  role: "primary" | "assistant" | "crew";
  avatar?: string;
  email: string;
  phone: string;
  status: "available" | "on_job" | "off_duty";
  skills: string[];
}

export function TeamAssignmentsWidget({
  job,
  teamAssignments = [],
}: TeamAssignmentsWidgetProps) {
  // Transform team assignments from database
  const teamMembers: TeamMember[] = (teamAssignments as any[])
    .map((assignment) => {
      const teamMember = Array.isArray(assignment.team_member)
        ? assignment.team_member[0]
        : assignment.team_member;

      const user = teamMember?.users
        ? Array.isArray(teamMember.users)
          ? teamMember.users[0]
          : teamMember.users
        : null;

      if (!user) return null;

      return {
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        role: assignment.role || "crew",
        avatar: user.avatar_url,
        email: user.email || "",
        phone: user.phone || "",
        status: "available" as const,
        skills: [], // TODO: Fetch skills from team member profile
      };
    })
    .filter(Boolean) as TeamMember[];

  // If no team assignments from database, show assigned_to user
  if (teamMembers.length === 0 && job.assignedTo) {
    // Show empty state with option to assign team
    // In a real scenario, we'd fetch the assigned user details
  }

  const primaryAssignee = teamMembers.find(
    (member) => member.role === "primary"
  );
  const assistants = teamMembers.filter((member) => member.role !== "primary");

  const statusConfig = {
    available: {
      label: "Available",
      variant: "default" as const,
      color: "text-green-600",
    },
    on_job: {
      label: "On Job",
      variant: "secondary" as const,
      color: "text-blue-600",
    },
    off_duty: {
      label: "Off Duty",
      variant: "outline" as const,
      color: "text-gray-600",
    },
  };

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (!primaryAssignee) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-center">
        <div>
          <Users className="mx-auto mb-2 size-8 text-muted-foreground opacity-50" />
          <p className="mb-2 text-muted-foreground text-sm">
            No team assigned yet
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/dashboard/work/${job.id}/assign`}>
              <UserCheck className="mr-2 size-4" />
              Assign Team
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Team Assignments</h4>
        <Badge className="text-xs" variant="secondary">
          {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Primary Assignee */}
      <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <UserCheck className="size-4 text-primary" />
          <span className="font-medium text-primary text-xs uppercase tracking-wide">
            Lead Technician
          </span>
        </div>

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="size-12">
            <AvatarImage
              alt={primaryAssignee.name}
              src={primaryAssignee.avatar}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(primaryAssignee.name)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h5 className="font-semibold text-base">
                {primaryAssignee.name}
              </h5>
              <Badge
                className="mt-1 text-xs"
                variant={statusConfig[primaryAssignee.status].variant}
              >
                <span
                  className={
                    "mr-1.5 inline-block size-1.5 rounded-full bg-current"
                  }
                />
                {statusConfig[primaryAssignee.status].label}
              </Badge>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {primaryAssignee.skills.map((skill) => (
                <Badge className="text-xs" key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="size-3" />
                <span>{primaryAssignee.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="size-3" />
                <span>{primaryAssignee.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Team Members */}
      {assistants.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="mb-3 font-medium text-sm">Team Members</h5>
            <div className="space-y-3">
              {assistants.map((member) => (
                <div
                  className="flex items-start gap-3 rounded-lg border p-3"
                  key={member.id}
                >
                  {/* Avatar */}
                  <Avatar className="size-10">
                    <AvatarImage alt={member.name} src={member.avatar} />
                    <AvatarFallback className="bg-muted">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h6 className="font-medium text-sm">{member.name}</h6>
                      <Badge
                        className="text-xs"
                        variant={statusConfig[member.status].variant}
                      >
                        <span
                          className={
                            "mr-1 inline-block size-1.5 rounded-full bg-current"
                          }
                        />
                        {statusConfig[member.status].label}
                      </Badge>
                    </div>

                    {/* Role */}
                    <p className="text-muted-foreground text-xs capitalize">
                      {member.role}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <Badge
                          className="text-xs"
                          key={skill}
                          variant="outline"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="size-3" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="size-3" />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <Separator />
      <div className="space-y-2">
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={`/dashboard/work/${job.id}/assign`}>
            <Users className="mr-2 size-4" />
            Manage Team Assignments
          </Link>
        </Button>
        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={"/dashboard/work/schedule/technicians"}>
            <Calendar className="mr-2 size-4" />
            View Technician Schedule
          </Link>
        </Button>
      </div>
    </div>
  );
}
