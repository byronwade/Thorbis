"use client";

import {
  Archive,
  CheckCircle,
  Download,
  Eye,
  MoreHorizontal,
  Receipt,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type Estimate = {
  id: string;
  estimate_number: string;
  title?: string;
  total_amount: number;
  status: string;
  created_at: string;
  valid_until?: string | null;
};

type JobEstimatesTableProps = {
  estimates: Estimate[];
};

export function JobEstimatesTable({ estimates }: JobEstimatesTableProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState(false);

  const formatCurrencyCents = useCallback(
    (cents: number) => formatCurrency(cents, { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    []
  );

  const handleArchive = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsArchiving(true);
    try {
      const result = await bulkArchive(Array.from(selectedIds), "estimate");

      if (result.success && result.data) {
        toast.success(
          `Successfully archived ${result.data.archived} estimate${result.data.archived === 1 ? "" : "s"}`
        );
        setShowArchiveDialog(false);
        setSelectedIds(new Set());
        // Refresh the page to reflect changes
        window.location.reload();
      } else {
        toast.error("Failed to archive estimates");
      }
    } catch (error) {
      toast.error("Failed to archive estimates");
    } finally {
      setIsArchiving(false);
    }
  }, [selectedIds]);


  const columns: ColumnDef<Estimate>[] = useMemo(
    () => [
      {
        key: "estimate_number",
        header: "Estimate #",
        width: "w-40",
        shrink: true,
        render: (estimate) => (
          <Link
            className="truncate font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
            href={`/dashboard/work/estimates/${estimate.id}`}
            title={estimate.estimate_number}
          >
            {estimate.estimate_number}
          </Link>
        ),
      },
      {
        key: "title",
        header: "Title",
        width: "flex-1",
        render: (estimate) => (
          <span
            className="block truncate text-foreground text-sm"
            title={estimate.title || undefined}
          >
            {estimate.title || "—"}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-32",
        shrink: true,
        render: (estimate) => <EstimateStatusBadge status={estimate.status} />,
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-36",
        shrink: true,
        align: "right",
        render: (estimate) => (
          <span className="font-semibold text-sm tabular-nums">
            {formatCurrencyCents(estimate.total_amount)}
          </span>
        ),
      },
      {
        key: "valid_until",
        header: "Valid Until",
        width: "w-36",
        shrink: true,
        hideOnMobile: true,
        render: (estimate) => (
          <span className="text-muted-foreground text-sm tabular-nums">
            {estimate.valid_until
              ? formatDate(estimate.valid_until, "short")
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "w-12",
        shrink: true,
        align: "right",
        render: (_estimate) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-8 p-0" size="sm" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 size-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="mr-2 size-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Send className="mr-2 size-4" />
                Send to Customer
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CheckCircle className="mr-2 size-4" />
                Convert to Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [formatCurrencyCents]
  );

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        label: "Archive Selected",
        icon: <Archive className="h-4 w-4" />,
        onClick: (selectedIds: Set<string>) => {
          setSelectedIds(selectedIds);
          setShowArchiveDialog(true);
        },
        variant: "default",
      },
    ],
    []
  );

  return (
    <>
      <FullWidthDataTable
        bulkActions={bulkActions}
        columns={columns}
        data={estimates}
        emptyIcon={<Receipt className="size-12 text-muted-foreground/50" />}
        emptyMessage="No estimates found for this job"
        enableSelection={true}
        getItemId={(estimate) => estimate.id}
        searchFilter={(estimate, query) => {
          const searchLower = query.toLowerCase();
          return (
            estimate.estimate_number?.toLowerCase().includes(searchLower) ||
            estimate.title?.toLowerCase().includes(searchLower) ||
            estimate.status?.toLowerCase().includes(searchLower)
          );
        }}
        searchPlaceholder="Search estimates..."
        showPagination={true}
      />

      <ArchiveConfirmDialog
        entityType="estimate"
        isLoading={isArchiving}
        itemCount={selectedIds.size}
        onConfirm={handleArchive}
        onOpenChange={setShowArchiveDialog}
        open={showArchiveDialog}
      />
    </>
  );
}
