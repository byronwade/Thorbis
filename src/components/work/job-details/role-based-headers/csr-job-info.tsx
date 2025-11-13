/**
 * CSR Job Info
 * Shows customer relationship and scheduling data for customer service reps
 */

"use client";

import {
  Calendar,
  Clock,
  MessageSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type CSRJobInfoProps = {
  customer?: {
    id: string;
    display_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    preferred_contact_method?: string | null;
  };
  schedules?: Array<{
    id: string;
    scheduled_start: string;
    scheduled_end?: string;
    status: string;
    appointment_type?: string;
  }>;
  communications?: Array<{
    id: string;
    type: string;
    created_at: string;
    content?: string;
  }>;
  lastContact?: string | null;
  nextAppointment?: string | null;
  appointmentStatus?: string | null;
};

export function CSRJobInfo({
  customer,
  schedules = [],
  communications = [],
  lastContact,
  nextAppointment,
  appointmentStatus,
}: CSRJobInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const upcomingSchedules = schedules
    .filter(
      (s) =>
        new Date(s.scheduled_start) >= new Date() &&
        s.status !== "cancelled" &&
        s.status !== "completed"
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_start).getTime() -
        new Date(b.scheduled_start).getTime()
    );

  const recentCommunications = communications
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Upcoming Appointments */}
      {upcomingSchedules.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <Calendar className="size-4" />
              {upcomingSchedules.length} Upcoming
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Upcoming Appointments</h4>
                <p className="text-muted-foreground text-xs">
                  Scheduled visits for this job
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {upcomingSchedules.map((schedule) => (
                  <div
                    className="flex items-start justify-between rounded-md bg-muted/50 p-2"
                    key={schedule.id}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {formatDateTime(schedule.scheduled_start)}
                        </span>
                      </div>
                      {schedule.appointment_type && (
                        <span className="ml-5 capitalize text-muted-foreground text-xs">
                          {schedule.appointment_type}
                        </span>
                      )}
                    </div>
                    <Badge
                      className="capitalize shrink-0"
                      variant={
                        schedule.status === "confirmed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Recent Communications */}
      {recentCommunications.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <MessageSquare className="size-4" />
              {recentCommunications.length} Recent
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Recent Communications</h4>
                <p className="text-muted-foreground text-xs">
                  Latest interactions with customer
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {recentCommunications.map((comm) => (
                  <div
                    className="rounded-md border p-2"
                    key={comm.id}
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="capitalize" variant="secondary">
                        {comm.type}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(comm.created_at)}
                      </span>
                    </div>
                    {comm.content && (
                      <p className="mt-1 text-sm line-clamp-2">
                        {comm.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Next Appointment */}
      {nextAppointment && (
        <button
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-sm transition-colors ${
            appointmentStatus === "confirmed"
              ? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400"
              : "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
          }`}
        >
          {appointmentStatus === "confirmed" ? (
            <CheckCircle className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          Next: {formatDate(nextAppointment)}
        </button>
      )}

      {/* Needs Follow-up */}
      {lastContact &&
        new Date().getTime() - new Date(lastContact).getTime() >
          7 * 24 * 60 * 60 * 1000 && (
          <button className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-sm text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="size-4" />
            Follow-up Needed
          </button>
        )}
    </div>
  );
}

