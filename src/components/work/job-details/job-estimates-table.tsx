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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ColumnDef,
  type BulkAction,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
import { bulkArchive } from "@/actions/archive";

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

const CENTS_PER_DOLLAR = 100;

export function JobEstimatesTable({ estimates }: JobEstimatesTableProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState(false);

  const formatCurrency = useCallback(
    (cents: number) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(cents / CENTS_PER_DOLLAR),
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

  const getStatusBadge = useCallback((status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      approved: "default",
      pending: "secondary",
      draft: "outline",
      rejected: "destructive",
    };

    return (
      <Badge className="text-xs" variant={variants[status] || "outline"}>
        {status}
      </Badge>
    );
  }, []);

  const columns: ColumnDef<Estimate>[] = useMemo(
    () => [
      {
        key: "estimate_number",
        header: "Estimate #",
        width: "w-40",
        shrink: true,
        render: (estimate) => (
          <Link
            className="block truncate font-medium text-primary text-sm hover:underline"
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
          <span className="block truncate text-sm text-foreground" title={estimate.title || undefined}>
            {estimate.title || "—"}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-32",
        shrink: true,
        render: (estimate) => getStatusBadge(estimate.status),
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-36",
        shrink: true,
        align: "right",
        render: (estimate) => (
          <span className="font-semibold text-sm tabular-nums">
            {formatCurrency(estimate.total_amount)}
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
          <span className="text-sm text-muted-foreground tabular-nums">
            {estimate.valid_until
              ? new Date(estimate.valid_until).toLocaleDateString()
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
    [formatCurrency, getStatusBadge]
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
        columns={columns}
        data={estimates}
        emptyIcon={<Receipt className="size-12 text-muted-foreground/50" />}
        emptyMessage="No estimates found for this job"
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
        bulkActions={bulkActions}
        enableSelection={true}
      />

      <ArchiveConfirmDialog
        open={showArchiveDialog}
        onOpenChange={setShowArchiveDialog}
        onConfirm={handleArchive}
        itemCount={selectedIds.size}
        entityType="estimate"
        isLoading={isArchiving}
      />
    </>
  );
}
