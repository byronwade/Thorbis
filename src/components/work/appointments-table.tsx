"use client";

/**
 * AppointmentsTable Component
 * Full-width Gmail-style table for displaying appointments
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view appointment details
 */

import {
  Archive,
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import Link from "next/link";
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
import {
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { cn } from "@/lib/utils";

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

type AppointmentsTableProps = {
  appointments: Appointment[];
  itemsPerPage?: number;
  onAppointmentClick?: (appointment: Appointment) => void;
  showRefresh?: boolean;
};

function formatDate(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function formatTime(date: Date | string | null): string {
  if (!date) {
    return "—";
  }
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

function getStatusBadge(status: string) {
  const variants: Record<
    string,
    {
      className: string;
      label: string;
    }
  > = {
    scheduled: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Scheduled",
    },
    confirmed: {
      className:
        "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400",
      label: "Confirmed",
    },
    in_progress: {
      className: "border-blue-500/50 bg-blue-500 text-white hover:bg-blue-600",
      label: "In Progress",
    },
    completed: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Completed",
    },
    cancelled: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Cancelled",
    },
    no_show: {
      className:
        "border-orange-500/50 bg-orange-500 text-white hover:bg-orange-600",
      label: "No Show",
    },
  };

  const config = variants[status] || {
    className: "border-border/50 bg-background text-muted-foreground",
    label: status,
  };

  return (
    <Badge
      className={cn("font-medium text-xs", config.className)}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
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

export function AppointmentsTable({
  appointments,
  itemsPerPage = 50,
  onAppointmentClick,
  showRefresh = false,
}: AppointmentsTableProps) {
  const columns: ColumnDef<Appointment>[] = [
    {
      key: "title",
      header: "Title",
      width: "flex-1",
      render: (appointment) => (
        <div className="min-w-0">
          <div className="truncate font-medium leading-tight">
            {appointment.title}
          </div>
          {appointment.description && (
            <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
              {appointment.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "w-48",
      shrink: true,
      hideOnMobile: true,
      render: (appointment) => (
        <span className="text-muted-foreground text-sm">
          {getCustomerName(appointment)}
        </span>
      ),
    },
    {
      key: "start_time",
      header: "Date & Time",
      width: "w-40",
      shrink: true,
      render: (appointment) => (
        <div className="text-muted-foreground text-sm tabular-nums">
          <div>{formatDate(appointment.start_time)}</div>
          <div className="text-xs">
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (appointment) => getStatusBadge(appointment.status),
    },
    {
      key: "assigned_user",
      header: "Assigned To",
      width: "w-36",
      shrink: true,
      hideOnMobile: true,
      render: (appointment) => (
        <span className="text-muted-foreground text-sm">
          {appointment.assigned_user?.name || "Unassigned"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (appointment) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/appointments/${appointment.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/appointments/${appointment.id}/edit`}>
                  <Edit className="mr-2 size-4" />
                  Edit Appointment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  if (
                    !confirm(
                      "Cancel this appointment? This action cannot be undone."
                    )
                  ) {
                    return;
                  }
                  // TODO: Implement cancel appointment action
                  window.location.reload();
                }}
              >
                <Archive className="mr-2 size-4" />
                Cancel Appointment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    {
      label: "Cancel Selected",
      icon: <Archive className="h-4 w-4" />,
      onClick: async (selectedIds) => {
        if (
          !confirm(
            `Cancel ${selectedIds.size} appointment(s)? This action cannot be undone.`
          )
        ) {
          return;
        }

        // TODO: Implement bulk cancel action
        window.location.reload();
      },
      variant: "destructive",
    },
  ];

  // Search filter function
  const searchFilter = (appointment: Appointment, query: string) => {
    const searchStr = query.toLowerCase();

    return (
      appointment.title.toLowerCase().includes(searchStr) ||
      appointment.status.toLowerCase().includes(searchStr) ||
      (appointment.description?.toLowerCase() || "").includes(searchStr) ||
      getCustomerName(appointment).toLowerCase().includes(searchStr) ||
      (appointment.assigned_user?.name?.toLowerCase() || "").includes(searchStr)
    );
  };

  const handleRowClick = (appointment: Appointment) => {
    if (onAppointmentClick) {
      onAppointmentClick(appointment);
    } else {
      window.location.href = `/dashboard/work/appointments/${appointment.id}`;
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAddAppointment = () => {
    window.location.href = "/dashboard/work/appointments/new";
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={appointments}
      emptyAction={
        <Button onClick={handleAddAppointment} size="sm">
          <Plus className="mr-2 size-4" />
          Add Appointment
        </Button>
      }
      emptyIcon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No appointments found"
      enableSelection={true}
      getItemId={(appointment) => appointment.id}
      itemsPerPage={itemsPerPage}
      onRefresh={handleRefresh}
      onRowClick={handleRowClick}
      searchFilter={searchFilter}
      searchPlaceholder="Search appointments by title, customer, or assigned user..."
      showRefresh={showRefresh}
    />
  );
}





