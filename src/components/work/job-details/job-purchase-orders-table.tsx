"use client";

import { Download, Eye, MoreHorizontal, Package, Send } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
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
  FullWidthDataTable,
} from "@/components/ui/full-width-datatable";

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

const CENTS_PER_DOLLAR = 100;

export function JobPurchaseOrdersTable({
  purchaseOrders,
}: JobPurchaseOrdersTableProps) {
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

  const getStatusBadge = useCallback((status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      ordered: "default",
      pending_approval: "secondary",
      approved: "default",
      partially_received: "secondary",
      received: "default",
      cancelled: "destructive",
    };

    return (
      <Badge className="text-xs" variant={variants[status] || "outline"}>
        {status.replace(/_/g, " ")}
      </Badge>
    );
  }, []);

  const columns: ColumnDef<PurchaseOrder>[] = useMemo(
    () => [
      {
        key: "po_number",
        header: "PO #",
        width: "w-32",
        shrink: true,
        render: (po) => (
          <div className="flex items-center gap-2">
            <Link
              className="font-medium text-primary hover:underline"
              href={`/dashboard/work/purchase-orders/${po.id}`}
            >
              {po.po_number}
            </Link>
            {po.auto_generated && (
              <Badge className="text-xs" variant="outline">
                Auto
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "title",
        header: "Title",
        render: (po) => <span className="text-sm">{po.title || "—"}</span>,
      },
      {
        key: "vendor",
        header: "Vendor",
        width: "w-36",
        shrink: true,
        render: (po) => <span className="text-sm">{po.vendor}</span>,
      },
      {
        key: "status",
        header: "Status",
        width: "w-24",
        shrink: true,
        render: (po) => getStatusBadge(po.status),
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-32",
        shrink: true,
        align: "right",
        render: (po) => (
          <span className="font-medium">{formatCurrency(po.total_amount)}</span>
        ),
      },
      {
        key: "expected_delivery",
        header: "Expected Delivery",
        width: "w-28",
        shrink: true,
        hideOnMobile: true,
        render: (po) => (
          <span className="text-sm">
            {po.expected_delivery
              ? new Date(po.expected_delivery).toLocaleDateString()
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
    [formatCurrency, getStatusBadge]
  );

  return (
    <FullWidthDataTable
      columns={columns}
      data={purchaseOrders}
      emptyIcon={<Package className="size-12 text-muted-foreground/50" />}
      emptyMessage="No purchase orders found for this job"
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
  );
}
