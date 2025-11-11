"use client";

import {
  Archive,
  Download,
  MoreHorizontal,
  Package,
  ShoppingCart,
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

export type Material = {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  status: "in-stock" | "low-stock" | "out-of-stock" | "on-order";
};

const MATERIAL_STATUS_CONFIG = {
  "in-stock": {
    className: "bg-green-500 hover:bg-green-600 text-white",
    label: "In Stock",
  },
  "low-stock": {
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    label: "Low Stock",
  },
  "out-of-stock": {
    className: "bg-red-500 hover:bg-red-600 text-white",
    label: "Out of Stock",
  },
  "on-order": {
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    label: "On Order",
  },
} as const;

export function MaterialsTable({
  materials,
  itemsPerPage = 50,
}: {
  materials: Material[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<Material>[] = [
    {
      key: "itemCode",
      header: "Item Code",
      width: "w-32",
      shrink: true,
      render: (material) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/materials/${material.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {material.itemCode}
        </Link>
      ),
    },
    {
      key: "description",
      header: "Description",
      width: "flex-1",
      render: (material) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground text-sm leading-tight">
            {material.description}
          </div>
          <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
            {material.category}
          </div>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Quantity",
      width: "w-28",
      shrink: true,
      align: "right",
      hideOnMobile: true,
      render: (material) => (
        <span className="text-foreground text-sm tabular-nums">
          {material.quantity} {material.unit}
        </span>
      ),
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      width: "w-28",
      shrink: true,
      align: "right",
      hideOnMobile: true,
      render: (material) => (
        <span className="text-foreground text-sm tabular-nums">
          {formatCurrency(material.unitCost)}
        </span>
      ),
    },
    {
      key: "totalValue",
      header: "Total Value",
      width: "w-32",
      shrink: true,
      align: "right",
      render: (material) => (
        <span className="font-semibold tabular-nums">
          {formatCurrency(material.totalValue)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (material) => getStatusBadge(material.status),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (material) => (
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
                <ShoppingCart className="mr-2 size-4" />
                Reorder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Package className="mr-2 size-4" />
                Adjust Stock
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
      label: "Reorder",
      icon: <ShoppingCart className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Reorder:", selectedIds),
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
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Delete:", selectedIds),
      variant: "destructive",
    },
  ];

  const searchFilter = (material: Material, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      material.itemCode.toLowerCase().includes(searchStr) ||
      material.description.toLowerCase().includes(searchStr) ||
      material.category.toLowerCase().includes(searchStr) ||
      material.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={materials}
      emptyIcon={
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
      }
      emptyMessage="No materials found"
      enableSelection={true}
      getHighlightClass={() => "bg-red-50/30 dark:bg-red-950/10"}
      getItemId={(material) => material.id}
      isHighlighted={(material) => material.status === "out-of-stock"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(material) =>
        (window.location.href = `/dashboard/work/materials/${material.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search materials by code, description, category, or status..."
      showRefresh={false}
    />
  );
}
