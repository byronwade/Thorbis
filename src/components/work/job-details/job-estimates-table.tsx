"use client";

import {
  CheckCircle,
  Download,
  Eye,
  MoreHorizontal,
  Receipt,
  Send,
} from "lucide-react";
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
        width: "w-32",
        shrink: true,
        render: (estimate) => (
          <Link
            className="font-medium text-primary hover:underline"
            href={`/dashboard/work/estimates/${estimate.id}`}
          >
            {estimate.estimate_number}
          </Link>
        ),
      },
      {
        key: "title",
        header: "Title",
        render: (estimate) => (
          <span className="text-sm">{estimate.title || "—"}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        width: "w-24",
        shrink: true,
        render: (estimate) => getStatusBadge(estimate.status),
      },
      {
        key: "total_amount",
        header: "Amount",
        width: "w-32",
        shrink: true,
        align: "right",
        render: (estimate) => (
          <span className="font-medium">
            {formatCurrency(estimate.total_amount)}
          </span>
        ),
      },
      {
        key: "valid_until",
        header: "Valid Until",
        width: "w-28",
        shrink: true,
        hideOnMobile: true,
        render: (estimate) => (
          <span className="text-sm">
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

  return (
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
    />
  );
}
