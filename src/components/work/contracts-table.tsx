"use client";

import {
  Download,
  Eye,
  FileSignature,
  MoreHorizontal,
  Send,
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
import { cn } from "@/lib/utils";

export type Contract = {
  id: string;
  contractNumber: string;
  customer: string;
  title: string;
  date: string;
  validUntil: string;
  status: "draft" | "sent" | "viewed" | "signed" | "rejected" | "expired";
  contractType: "service" | "maintenance" | "custom";
  signerName: string | null;
};

function getStatusBadge(status: string) {
  const config = {
    signed: {
      className:
        "border-green-500/50 bg-green-500 text-white hover:bg-green-600",
      label: "Signed",
    },
    sent: {
      className:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
      label: "Sent",
    },
    viewed: {
      className:
        "border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
      label: "Viewed",
    },
    draft: {
      className:
        "border-border/50 bg-background text-muted-foreground hover:bg-muted/50",
      label: "Draft",
    },
    rejected: {
      className: "border-red-500/50 bg-red-500 text-white hover:bg-red-600",
      label: "Rejected",
    },
    expired: {
      className:
        "border-orange-200/50 bg-orange-50/50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400",
      label: "Expired",
    },
  };

  const statusConfig = config[status as keyof typeof config] || config.draft;

  return (
    <Badge
      className={cn("font-medium text-xs", statusConfig.className)}
      variant="outline"
    >
      {statusConfig.label}
    </Badge>
  );
}

function getContractTypeBadge(type: string) {
  const config = {
    service: {
      className:
        "border-blue-200/50 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
      label: "Service",
    },
    maintenance: {
      className:
        "border-green-200/50 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400",
      label: "Maintenance",
    },
    custom: {
      className:
        "border-purple-200/50 bg-purple-50/50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-400",
      label: "Custom",
    },
  };

  const typeConfig = config[type as keyof typeof config] || config.custom;

  return (
    <Badge
      className={cn("font-medium text-xs", typeConfig.className)}
      variant="outline"
    >
      {typeConfig.label}
    </Badge>
  );
}

export function ContractsTable({
  contracts,
  itemsPerPage = 50,
}: {
  contracts: Contract[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<Contract>[] = [
    {
      key: "contractNumber",
      header: "Contract #",
      width: "w-36",
      shrink: true,
      render: (contract) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/contracts/${contract.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {contract.contractNumber}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      width: "w-48",
      shrink: true,
      render: (contract) => (
        <div className="min-w-0">
          <div className="truncate font-medium leading-tight">
            {contract.customer}
          </div>
        </div>
      ),
    },
    {
      key: "title",
      header: "Title",
      width: "flex-1",
      render: (contract) => (
        <div className="min-w-0">
          <div className="truncate text-sm leading-tight">{contract.title}</div>
        </div>
      ),
    },
    {
      key: "contractType",
      header: "Type",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (contract) => getContractTypeBadge(contract.contractType),
    },
    {
      key: "signerName",
      header: "Signer",
      width: "w-40",
      shrink: true,
      hideOnMobile: true,
      render: (contract) => (
        <span className="text-muted-foreground text-sm leading-tight">
          {contract.signerName || (
            <span className="text-muted-foreground">Not assigned</span>
          )}
        </span>
      ),
    },
    {
      key: "date",
      header: "Created",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (contract) => (
        <span className="text-muted-foreground text-sm tabular-nums leading-tight">
          {contract.date}
        </span>
      ),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (contract) => (
        <span className="text-muted-foreground text-sm tabular-nums leading-tight">
          {contract.validUntil}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      shrink: true,
      render: (contract) => getStatusBadge(contract.status),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (contract) => (
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
                <Eye className="mr-2 size-4" />
                View Contract
              </DropdownMenuItem>
              {contract.status === "draft" && (
                <DropdownMenuItem>
                  <Send className="mr-2 size-4" />
                  Send for Signature
                </DropdownMenuItem>
              )}
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

  const searchFilter = (contract: Contract, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      contract.contractNumber.toLowerCase().includes(searchStr) ||
      contract.customer.toLowerCase().includes(searchStr) ||
      contract.title.toLowerCase().includes(searchStr) ||
      contract.status.toLowerCase().includes(searchStr) ||
      contract.contractType.toLowerCase().includes(searchStr) ||
      (contract.signerName?.toLowerCase().includes(searchStr) ?? false)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={contracts}
      emptyIcon={
        <FileSignature className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No contracts found"
      enableSelection={true}
      getHighlightClass={() => "bg-green-50/30 dark:bg-green-950/10"}
      getItemId={(contract) => contract.id}
      isHighlighted={(contract) => contract.status === "signed"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(contract) =>
        (window.location.href = `/dashboard/work/contracts/${contract.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search contracts by number, customer, title, or status..."
      showRefresh={true}
    />
  );
}
