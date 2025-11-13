/**
 * Job Schedules Section
 * Displays appointments/schedules for this job
 */

"use client";

import { Calendar, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type JobSchedulesProps = {
  schedules: any[];
};

export function JobSchedules({ schedules }: JobSchedulesProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string) => {
    const statusMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      scheduled: "outline",
      confirmed: "secondary",
      in_progress: "default",
      completed: "default",
      cancelled: "destructive",
      no_show: "destructive",
    };
    return statusMap[status] || "outline";
  };

  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-semibold text-lg">No Appointments</h3>
        <p className="text-muted-foreground text-sm">
          No appointments have been scheduled for this job yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  {formatDate(schedule.scheduled_date || schedule.start_time)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    {formatTime(schedule.start_time)}
                  </div>
                </TableCell>
                <TableCell>
                  {schedule.duration ? `${schedule.duration} min` : "—"}
                </TableCell>
                <TableCell className="capitalize">
                  {schedule.appointment_type || schedule.type || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(schedule.status)}>
                    {schedule.status || "scheduled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {schedule.notes || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="rounded-md bg-muted/50 p-4">
        <p className="font-medium text-sm">Total Appointments</p>
        <p className="text-muted-foreground text-xs">
          {schedules.length} appointment{schedules.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

