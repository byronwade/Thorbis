"use client";

import { ArrowUpRight, CalendarDays, Clock, User } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type {
  KanbanItemBase,
  KanbanMoveEvent,
} from "@/components/ui/shadcn-io/kanban";
import { useToast } from "@/hooks/use-toast";

type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

type Appointment = {
  id: string;
  title: string;
  description?: string | null;
  start_time: string | Date;
  end_time: string | Date;
  status: string;
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
  } | null;
  assigned_user?: {
    name?: string | null;
  } | null;
  job_id?: string | null;
};

type AppointmentsKanbanItem = KanbanItemBase & {
  appointment: Appointment;
};

type AppointmentsKanbanProps = {
  appointments: Appointment[];
};

const APPOINTMENT_STATUS_COLUMNS: Array<{
  id: AppointmentStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "scheduled", name: "Scheduled", accentColor: "#2563EB" },
  { id: "confirmed", name: "Confirmed", accentColor: "#22C55E" },
  { id: "in_progress", name: "In Progress", accentColor: "#F97316" },
  { id: "completed", name: "Completed", accentColor: "#10B981" },
  { id: "cancelled", name: "Cancelled", accentColor: "#EF4444" },
  { id: "no_show", name: "No Show", accentColor: "#F59E0B" },
];

const COLUMN_LABEL = new Map(
  APPOINTMENT_STATUS_COLUMNS.map((column) => [column.id, column.name])
);
const DEFAULT_STATUS: AppointmentStatus = "scheduled";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function resolveStatus(status: string | null | undefined): AppointmentStatus {
  if (!status) {
    return DEFAULT_STATUS;
  }

  const normalized = status as AppointmentStatus;
  return COLUMN_LABEL.has(normalized) ? normalized : DEFAULT_STATUS;
}

function formatDate(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(d);
}

function formatTime(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return timeFormatter.format(d);
}

function getCustomerName(appointment: Appointment): string {
  if (appointment.customer?.display_name) {
    return appointment.customer.display_name;
  }
  if (appointment.customer?.first_name || appointment.customer?.last_name) {
    return `${appointment.customer.first_name || ""} ${appointment.customer.last_name || ""}`.trim();
  }
  return "Unknown Customer";
}

function AppointmentCardContent({ item }: { item: AppointmentsKanbanItem }) {
  const { appointment, columnId } = item;
  const startTime = appointment.start_time
    ? new Date(appointment.start_time)
    : null;
  const endTime = appointment.end_time ? new Date(appointment.end_time) : null;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-sm leading-snug">
            {appointment.title}
          </h3>
        </div>
      </div>

      {appointment.description && (
        <p className="line-clamp-2 text-muted-foreground text-xs">
          {appointment.description}
        </p>
      )}

      <div className="space-y-2 text-muted-foreground text-xs">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            {getCustomerName(appointment)}
          </span>
        </div>

        {startTime && (
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <span>{formatDate(startTime)}</span>
          </div>
        )}

        {startTime && endTime && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <span>
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
        )}

        {appointment.assigned_user?.name && (
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>{appointment.assigned_user.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground tracking-wide">
        <span>{startTime && fullDateFormatter.format(startTime)}</span>
        <span className="uppercase">
          {COLUMN_LABEL.get(columnId as AppointmentStatus) ?? columnId}
        </span>
      </div>

      <div className="flex items-center justify-end pt-1">
        <Button
          asChild
          className="gap-1 text-primary text-xs"
          size="sm"
          variant="ghost"
        >
          <Link href={`/dashboard/work/appointments/${appointment.id}`}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function AppointmentsKanban({ appointments }: AppointmentsKanbanProps) {
  const { toast } = useToast();
  const [_isPending, startTransition] = useTransition();

  const handleItemMove = async ({
    item,
    fromColumnId,
    toColumnId,
  }: KanbanMoveEvent<AppointmentsKanbanItem>) => {
    if (fromColumnId === toColumnId) {
      return;
    }

    startTransition(() => {
      void (async () => {
        // TODO: Implement updateAppointmentStatus action
        // const { updateAppointmentStatus } = await import("@/actions/appointments");
        // const result = await updateAppointmentStatus(item.appointment.id, toColumnId);

        // if (!result.success) {
        //   toast.error("Unable to move appointment", {
        //     description: result.error,
        //   });
        //   return;
        // }

        toast.success(
          `Appointment moved to ${COLUMN_LABEL.get(
            toColumnId as AppointmentStatus
          )}`
        );
      })();
    });
  };

  return (
    <EntityKanban<Appointment, AppointmentStatus>
      calculateColumnMeta={(columnId, items) => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        return { count: columnItems.length };
      }}
      columns={APPOINTMENT_STATUS_COLUMNS}
      data={appointments}
      entityName="appointments"
      mapToKanbanItem={(appointment) => ({
        id: appointment.id,
        columnId: resolveStatus(appointment.status),
        entity: appointment,
        appointment,
      })}
      onItemMove={handleItemMove as any}
      renderCard={(item) => (
        <AppointmentCardContent
          item={{ ...item, appointment: item.entity } as AppointmentsKanbanItem}
        />
      )}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-md border border-border/70 bg-background/95 p-3 shadow-lg">
          <AppointmentCardContent
            item={
              { ...item, appointment: item.entity } as AppointmentsKanbanItem
            }
          />
        </div>
      )}
      updateEntityStatus={(appointment, newStatus) => ({
        ...appointment,
        status: newStatus,
      })}
    />
  );
}
