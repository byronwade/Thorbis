"use client";

import {
  Download,
  Eye,
  FileSignature,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
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
import { ContractStatusBadge, ContractTypeBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

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
      render: (contract) => <ContractTypeBadge type={contract.contractType} />,
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
      render: (contract) => <ContractStatusBadge status={contract.status} />,
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
      emptyAction={
        <Button
          onClick={() => (window.location.href = "/dashboard/work/contracts/new")}
          size="sm"
        >
          <Plus className="mr-2 size-4" />
          Create Contract
        </Button>
      }
      emptyIcon={<FileSignature className="h-8 w-8 text-muted-foreground" />}
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
      showRefresh={false}
    />
  );
}
