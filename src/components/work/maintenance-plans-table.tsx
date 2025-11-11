"use client";

import {
  Archive,
  Calendar,
  Download,
  FileText,
  MoreHorizontal,
  Trash2,
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
import { formatCurrency } from "@/lib/formatters";
import { GenericStatusBadge } from "@/components/ui/generic-status-badge";

export type MaintenancePlan = {
  id: string;
  planName: string;
  customer: string;
  serviceType: string;
  frequency: "Monthly" | "Quarterly" | "Bi-Annual" | "Annual";
  nextVisit: string;
  monthlyFee: number;
  status: "active" | "pending" | "paused" | "cancelled";
};

const MAINTENANCE_PLAN_STATUS_CONFIG = {
  active: {
    className: "bg-green-500 hover:bg-green-600 text-white",
    label: "Active",
  },
  pending: {
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    label: "Pending",
  },
  paused: {
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    label: "Paused",
  },
  cancelled: {
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    label: "Cancelled",
  },
} as const;

export function MaintenancePlansTable({
  plans,
  itemsPerPage = 50,
}: {
  plans: MaintenancePlan[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<MaintenancePlan>[] = [
    {
      key: "planName",
      header: "Plan Name",
      width: "w-40",
      shrink: true,
      render: (plan) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/maintenance-plans/${plan.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {plan.planName}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "flex-1",
      render: (plan) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground text-sm leading-tight">
            {plan.customer}
          </div>
          <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
            {plan.serviceType}
          </div>
        </div>
      ),
    },
    {
      key: "frequency",
      header: "Frequency",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (plan) => (
        <span className="text-foreground text-sm">{plan.frequency}</span>
      ),
    },
    {
      key: "nextVisit",
      header: "Next Visit",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (plan) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {plan.nextVisit}
        </span>
      ),
    },
    {
      key: "monthlyFee",
      header: "Monthly Fee",
      width: "w-28",
      shrink: true,
      align: "right",
      render: (plan) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(plan.monthlyFee)}/mo
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (plan) => (
        <GenericStatusBadge
          status={plan.status}
          config={MAINTENANCE_PLAN_STATUS_CONFIG}
          defaultStatus="pending"
        />
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (plan) => (
        <div data-no-row-click>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="mr-2 size-4" />
                Schedule Visit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 size-4" />
                View Contract
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Cancel Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Schedule Visits",
      icon: <Calendar className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Schedule Visits:", selectedIds),
    },
    {
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Export:", selectedIds),
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Archive:", selectedIds),
    },
    {
      label: "Cancel",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Cancel:", selectedIds),
      variant: "destructive",
    },
  ];

  const searchFilter = (plan: MaintenancePlan, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      plan.planName.toLowerCase().includes(searchStr) ||
      plan.customer.toLowerCase().includes(searchStr) ||
      plan.serviceType.toLowerCase().includes(searchStr) ||
      plan.frequency.toLowerCase().includes(searchStr) ||
      plan.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={plans}
      emptyIcon={
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No maintenance plans found"
      enableSelection={true}
      getHighlightClass={() => "bg-green-50/30 dark:bg-green-950/10"}
      getItemId={(plan) => plan.id}
      isHighlighted={(plan) => plan.status === "active"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(plan) =>
        (window.location.href = `/dashboard/work/maintenance-plans/${plan.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search plans by name, customer, service type, frequency, or status..."
      showRefresh={false}
    />
  );
}
