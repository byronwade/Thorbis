"use client";

import {
  Archive,
  Download,
  Eye,
  MoreHorizontal,
  Package,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
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
  type BulkAction,
  type ColumnDef,
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";

type PurchaseOrder = {
  id: string;
  po_number: string;
  title?: string;
  vendor: string;
  vendor_email?: string;
  total_amount: number;
  status: string;
  created_at: string;
  expected_delivery?: string | null;
  auto_generated?: boolean;
};

type JobPurchaseOrdersTableProps = {
  purchaseOrders: PurchaseOrder[];
};

export function JobPurchaseOrdersTable({
  purchaseOrders,
}: JobPurchaseOrdersTableProps) {
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
      const result = await bulkArchive(
        Array.from(selectedIds),
        "purchase_order"
      );

      if (result.success && result.data) {
        toast.success(
          `Successfully archived ${result.data.archived} purchase order${result.data.archived === 1 ? "" : "s"}`
        );
        setShowArchiveDialog(false);
        setSelectedIds(new Set());
        // Refresh the page to reflect changes
        window.location.reload();
      } else {
        toast.error("Failed to archive purchase orders");
      }
    } catch (error) {
      toast.error("Failed to archive purchase orders");
    } finally {
      setIsArchiving(false);
    }
  }, [selectedIds]);


  const columns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        key: "po_number",
        header: "PO #",
        width: "w-40",
        shrink: true,
        render: (po) => (
          <div className="flex min-w-0 items-center gap-2">
          <Link
            className="truncate font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
            href={`/dashboard/work/purchase-orders/${po.id}`}
            title={po.po_number}
          >
            {po.po_number}
          </Link>
            {po.auto_generated && (
              <Badge className="shrink-0 text-xs" variant="outline">
                Auto
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "title",
        header: "Title",
        width: "flex-1",
        render: (po) => (
          <span
            className="block truncate text-foreground text-sm"
            title={po.title || undefined}
          >
            {po.title || "—"}
          </span>
        ),
      },
      {
        key: "vendor",
        header: "Vendor",
        width: "w-48",
        shrink: true,
        render: (po) => (
          <span
            className="block truncate text-foreground text-sm"
            title={po.vendor}
          >
            {po.vendor}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-32",
        shrink: true,
        render: (po) => <StatusBadge status={po.status} type="purchase_order" />,
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-36",
        shrink: true,
        align: "right",
        render: (po) => (
          <span className="font-semibold text-sm tabular-nums">
            {formatCurrencyCents(po.total_amount)}
          </span>
        ),
      },
      {
        key: "expected_delivery",
        header: "Expected Delivery",
        width: "w-40",
        shrink: true,
        hideOnMobile: true,
        render: (po) => (
          <span className="text-muted-foreground text-sm tabular-nums">
            {po.expected_delivery
              ? formatDate(po.expected_delivery, "short")
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
        render: (_po) => (
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
                Send to Vendor
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
        data={purchaseOrders}
        emptyIcon={<Package className="size-12 text-muted-foreground/50" />}
        emptyMessage="No purchase orders found for this job"
        enableSelection={true}
        getItemId={(po) => po.id}
        searchFilter={(po, query) => {
          const searchLower = query.toLowerCase();
          return (
            po.po_number?.toLowerCase().includes(searchLower) ||
            po.title?.toLowerCase().includes(searchLower) ||
            po.vendor?.toLowerCase().includes(searchLower) ||
            po.status?.toLowerCase().includes(searchLower)
          );
        }}
        searchPlaceholder="Search purchase orders..."
        showPagination={true}
      />

      <ArchiveConfirmDialog
        entityType="purchase order"
        isLoading={isArchiving}
        itemCount={selectedIds.size}
        onConfirm={handleArchive}
        onOpenChange={setShowArchiveDialog}
        open={showArchiveDialog}
      />
    </>
  );
}
