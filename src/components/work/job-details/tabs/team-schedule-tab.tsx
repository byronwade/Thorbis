/**
 * Team & Schedule Tab - Team Management & Time Tracking
 *
 * Features:
 * - Team assignments with roles
 * - Time clock in/out tracking
 * - Labor hours summary
 * - Schedule calendar
 * - Dispatch information
 *
 * Performance:
 * - Client Component for interactivity
 * - Real-time time tracking
 * - GPS verification indicators
 */

"use client";

import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Play,
  Shield,
  Square,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TeamScheduleTabProps = {
  job: any;
  teamAssignments: any[];
  timeEntries: any[];
  assignedUser: any;
  isEditMode: boolean;
};

export function TeamScheduleTab({
  job,
  teamAssignments,
  timeEntries,
  assignedUser,
  isEditMode,
}: TeamScheduleTabProps) {
  const [isClockingIn, setIsClockingIn] = useState(false);

  // Format duration
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Calculate total hours
  const totalHours = timeEntries.reduce(
    (sum, entry) => sum + (entry.total_hours || 0),
    0
  );

  // Get active time entry (not clocked out)
  const activeEntry = timeEntries.find((e) => !e.clock_out);

  // Format date/time
  const formatDateTime = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));

  // Handle clock in
  const handleClockIn = async () => {
    setIsClockingIn(true);
    // TODO: Implement clock in logic with Server Action
    // await clockIn(job.id);
    setTimeout(() => setIsClockingIn(false), 1000);
  };

  // Handle clock out
  const handleClockOut = async () => {
    // TODO: Implement clock out logic with Server Action
    // await clockOut(activeEntry.id);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Primary Assignee */}
      {assignedUser && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Primary Technician</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={assignedUser.avatar} />
                  <AvatarFallback>
                    {assignedUser.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{assignedUser.name}</p>
                  <div className="flex gap-4 text-muted-foreground text-sm">
                    {assignedUser.email && (
                      <a
                        className="flex items-center gap-1 hover:text-primary"
                        href={`mailto:${assignedUser.email}`}
                      >
                        <Mail className="h-3 w-3" />
                        {assignedUser.email}
                      </a>
                    )}
                    {assignedUser.phone && (
                      <a
                        className="flex items-center gap-1 hover:text-primary"
                        href={`tel:${assignedUser.phone}`}
                      >
                        <Phone className="h-3 w-3" />
                        {assignedUser.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {isEditMode && (
                <Button size="sm" variant="outline">
                  Change
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Clock Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Time Clock</CardTitle>
            </div>
            <Badge variant={activeEntry ? "default" : "secondary"}>
              {activeEntry ? "Clocked In" : "Clocked Out"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeEntry ? (
            <div className="rounded-lg border border-success bg-success p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-success">
                    Currently Working
                  </p>
                  <p className="text-success text-xs">
                    Clocked in at {formatDateTime(activeEntry.clock_in)}
                  </p>
                </div>
                <Button onClick={handleClockOut} variant="destructive">
                  <Square className="mr-2 h-4 w-4" />
                  Clock Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium text-sm">Ready to start work?</p>
                <p className="text-muted-foreground text-xs">
                  Clock in to begin tracking time
                </p>
              </div>
              <Button
                disabled={isClockingIn}
                onClick={handleClockIn}
                variant="default"
              >
                <Play className="mr-2 h-4 w-4" />
                {isClockingIn ? "Clocking In..." : "Clock In"}
              </Button>
            </div>
          )}

          {/* Total Hours Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Total Hours</p>
              <p className="font-bold text-2xl">{formatHours(totalHours)}</p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Estimated</p>
              <p className="font-bold text-2xl">
                {job.estimated_labor_hours
                  ? formatHours(job.estimated_labor_hours)
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-xs">Variance</p>
              <p
                className={cn(
                  "font-bold text-2xl",
                  totalHours > (job.estimated_labor_hours || 0)
                    ? "text-warning"
                    : "text-success"
                )}
              >
                {job.estimated_labor_hours
                  ? formatHours(totalHours - job.estimated_labor_hours)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Team Assignments</CardTitle>
            </div>
            {isEditMode && (
              <Button size="sm" variant="outline">
                Add Team Member
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {teamAssignments && teamAssignments.length > 0 ? (
            <div className="space-y-3">
              {teamAssignments.map((assignment) => {
                const member = assignment.team_member;
                const user = Array.isArray(member?.users)
                  ? member.users[0]
                  : member?.users;

                return (
                  <div
                    className="flex items-center justify-between rounded-lg border p-3"
                    key={assignment.id}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>
                          {user?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {member?.job_title || "Team Member"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {assignment.role || "Assigned"}
                      </Badge>
                      {isEditMode && (
                        <Button size="sm" variant="ghost">
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No team members assigned
              {isEditMode && (
                <Button className="mt-2 ml-2" size="sm" variant="outline">
                  Assign Team
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Entries History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Time Entries</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {timeEntries && timeEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technician</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Break</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => {
                  const user = Array.isArray(entry.user)
                    ? entry.user[0]
                    : entry.user;

                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="text-xs">
                              {user?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {user?.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(entry.clock_in)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.clock_out
                          ? formatDateTime(entry.clock_out)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.break_minutes ? `${entry.break_minutes}m` : "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.total_hours
                          ? formatHours(entry.total_hours)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge
                            className="text-xs"
                            variant={
                              entry.entry_type === "gps"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {entry.entry_type}
                          </Badge>
                          {entry.gps_verified && (
                            <MapPin className="h-3 w-3 text-success" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditMode && (
                          <Button size="sm" variant="ghost">
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-muted-foreground text-sm">
              No time entries recorded yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule & Dispatch Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Schedule & Dispatch</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs">Scheduled Start</p>
              <p className="font-medium text-sm">
                {job.scheduled_start
                  ? formatDateTime(job.scheduled_start)
                  : "Not scheduled"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Scheduled End</p>
              <p className="font-medium text-sm">
                {job.scheduled_end
                  ? formatDateTime(job.scheduled_end)
                  : "Not scheduled"}
              </p>
            </div>
          </div>

          <Separator />

          {job.dispatch_zone && (
            <div>
              <p className="text-muted-foreground text-xs">Dispatch Zone</p>
              <p className="font-medium text-sm">{job.dispatch_zone}</p>
            </div>
          )}

          {job.travel_time_minutes && (
            <div>
              <p className="text-muted-foreground text-xs">
                Estimated Travel Time
              </p>
              <p className="font-medium text-sm">
                {job.travel_time_minutes} minutes
              </p>
            </div>
          )}

          {job.route_order && (
            <div>
              <p className="text-muted-foreground text-xs">Route Order</p>
              <p className="font-medium text-sm">
                Position #{job.route_order} in route
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
