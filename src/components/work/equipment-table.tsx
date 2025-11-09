"use client";

import {
  Archive,
  Download,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
  Truck,
  Wrench,
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

export type Equipment = {
  id: string;
  assetId: string;
  name: string;
  type: "Vehicle" | "Tool" | "Equipment";
  assignedTo: string;
  lastService: string;
  nextService: string;
  status: "available" | "in-use" | "maintenance" | "retired";
};

function getStatusBadge(status: string) {
  const config = {
    available: {
      className: "bg-green-500 hover:bg-green-600 text-white",
      label: "Available",
    },
    "in-use": {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      label: "In Use",
    },
    maintenance: {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      label: "Maintenance",
    },
    retired: {
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      label: "Retired",
    },
  };

  const statusConfig =
    config[status as keyof typeof config] || config.available;

  return (
    <Badge
      className={`font-medium text-xs ${statusConfig.className}`}
      variant="outline"
    >
      {statusConfig.label}
    </Badge>
  );
}

export function EquipmentTable({
  equipment,
  itemsPerPage = 50,
}: {
  equipment: Equipment[];
  itemsPerPage?: number;
}) {
  const columns: ColumnDef<Equipment>[] = [
    {
      key: "assetId",
      header: "Asset ID",
      width: "w-32",
      shrink: true,
      render: (item) => (
        <Link
          className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
          href={`/dashboard/work/equipment/${item.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          {item.assetId}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Name",
      width: "flex-1",
      render: (item) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground text-sm leading-tight">
            {item.name}
          </div>
          <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
            {item.type}
          </div>
        </div>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      width: "w-40",
      shrink: true,
      hideOnMobile: true,
      render: (item) => (
        <span className="text-foreground text-sm">{item.assignedTo}</span>
      ),
    },
    {
      key: "lastService",
      header: "Last Service",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (item) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {item.lastService}
        </span>
      ),
    },
    {
      key: "nextService",
      header: "Next Service",
      width: "w-32",
      shrink: true,
      hideOnMobile: true,
      render: (item) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {item.nextService}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-32",
      shrink: true,
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (item) => (
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
                <Wrench className="mr-2 size-4" />
                Schedule Service
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Update Status
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
      label: "Schedule Service",
      icon: <Wrench className="h-4 w-4" />,
      onClick: (selectedIds) => console.log("Schedule Service:", selectedIds),
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

  const searchFilter = (item: Equipment, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      item.assetId.toLowerCase().includes(searchStr) ||
      item.name.toLowerCase().includes(searchStr) ||
      item.type.toLowerCase().includes(searchStr) ||
      item.assignedTo.toLowerCase().includes(searchStr) ||
      item.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={equipment}
      emptyAction={
        <Button
          onClick={() => (window.location.href = "/dashboard/work/equipment/new")}
          size="sm"
        >
          <Plus className="mr-2 size-4" />
          Add Equipment
        </Button>
      }
      emptyIcon={<Truck className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No equipment found"
      enableSelection={true}
      getHighlightClass={() => "bg-yellow-50/30 dark:bg-yellow-950/10"}
      getItemId={(item) => item.id}
      isHighlighted={(item) => item.status === "maintenance"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(item) =>
        (window.location.href = `/dashboard/work/equipment/${item.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search equipment by asset ID, name, type, assigned to, or status..."
      showRefresh={false}
    />
  );
}
