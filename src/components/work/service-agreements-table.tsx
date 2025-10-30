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

export type ServiceAgreement = {
  id: string;
  agreementNumber: string;
  customer: string;
  type:
    | "Service Level Agreement"
    | "Extended Warranty"
    | "Maintenance Contract"
    | "Support Contract";
  startDate: string;
  endDate: string;
  value: number;
  status: "active" | "pending" | "expired" | "cancelled";
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getStatusBadge(status: string) {
  const config = {
    active: {
      className: "bg-green-500 hover:bg-green-600 text-white",
      label: "Active",
    },
    pending: {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Pending",
    },
    expired: {
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      label: "Expired",
    },
    cancelled: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Cancelled",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.pending;

  return (
    <Badge
      className={`font-medium text-xs ${statusConfig.className}`}
      variant="outline"
    >
      {statusConfig.label}
    </Badge>
  );
}

export function ServiceAgreementsTable({
  agreements,
  itemsPerPage = 50,
}: {
  agreements: ServiceAgreement[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<ServiceAgreement>[] = [
    {
      key: "agreementNumber",
      header: "Agreement #",
      width: "w-36",
      shrink: true,
      render: (agreement) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/service-agreements/${agreement.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {agreement.agreementNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "flex-1",
      render: (agreement) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground text-sm leading-tight">
            {agreement.customer}
          </div>
          <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
            {agreement.type}
          </div>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (agreement) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {agreement.startDate}
        </span>
      ),
    },
    {
      key: "endDate",
      header: "End Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (agreement) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {agreement.endDate}
        </span>
      ),
    },
    {
      key: "value",
      header: "Value",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (agreement) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(agreement.value)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (agreement) => getStatusBadge(agreement.status),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (agreement) => (
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
                <FileText className="mr-2 size-4" />
                View Contract
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 size-4" />
                Renew Agreement
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Cancel Agreement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Renew",
      icon: <Calendar className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Renew:", selectedIds),
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

  const searchFilter = (agreement: ServiceAgreement, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      agreement.agreementNumber.toLowerCase().includes(searchStr) ||
      agreement.customer.toLowerCase().includes(searchStr) ||
      agreement.type.toLowerCase().includes(searchStr) ||
      agreement.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={agreements}
      emptyIcon={
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No service agreements found"
      enableSelection={true}
      getHighlightClass={() => "bg-red-50/30 dark:bg-red-950/10"}
      getItemId={(agreement) => agreement.id}
      isHighlighted={(agreement) => agreement.status === "expired"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(agreement) =>
        (window.location.href = `/dashboard/work/service-agreements/${agreement.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search agreements by number, customer, type, or status..."
      showRefresh={true}
    />
  );
}
