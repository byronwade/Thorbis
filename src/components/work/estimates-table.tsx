"use client";

import { Download, FileText, MoreHorizontal, Send, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { EstimateStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type Estimate = {
  id: string;
  estimateNumber: string;
  customer: string;
  project: string;
  date: string;
  validUntil: string;
  amount: number;
  status: "accepted" | "sent" | "draft" | "declined";
};


export function EstimatesTable({
  estimates,
  itemsPerPage = 50,
}: {
  estimates: Estimate[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<Estimate>[] = [
    {
      key: "estimateNumber",
      header: "Estimate #",
      width: "w-36",
      shrink: true,
      render: (estimate) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/estimates/${estimate.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {estimate.estimateNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "w-48",
      shrink: true,
      render: (estimate) => (
        <span className="font-medium text-foreground text-sm">
          {estimate.customer}
        </span>
      ),
    },
    {
      key: "project",
      header: "Project",
      width: "flex-1",
      render: (estimate) => (
        <span className="text-foreground text-sm">{estimate.project}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (estimate) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {estimate.date}
        </span>
      ),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (estimate) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {estimate.validUntil}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (estimate) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(estimate.amount, { decimals: 2 })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (estimate) => <EstimateStatusBadge status={estimate.status} />,
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (estimate) => (
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
                <Send className="mr-2 size-4" />
                Send to Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 size-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: "Send",
      icon: <Send className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Send:", selectedIds),
    },
    {
      label: "Download",
      icon: <Download className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Download:", selectedIds),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Delete:", selectedIds),
      variant: "destructive",
    },
  ];

  const searchFilter = (estimate: Estimate, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      estimate.estimateNumber.toLowerCase().includes(searchStr) ||
      estimate.customer.toLowerCase().includes(searchStr) ||
      estimate.project.toLowerCase().includes(searchStr) ||
      estimate.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={estimates}
      emptyIcon={
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No estimates found"
      enableSelection={true}
      getHighlightClass={() => "bg-green-50/30 dark:bg-green-950/10"}
      getItemId={(estimate) => estimate.id}
      isHighlighted={(estimate) => estimate.status === "accepted"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(estimate) =>
        (window.location.href = `/dashboard/work/estimates/${estimate.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search estimates by number, customer, project, or status..."
      showRefresh={false}
    />
  );
}
