"use client";

import {
  Archive,
  Download,
  MoreHorizontal,
  Plus,
  Settings,
  Truck,
  Wrench,
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
import { GenericStatusBadge } from "@/components/ui/generic-status-badge";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type Equipment = {
  id: string;
  assetId: string;
  name: string;
  classification: "equipment" | "tool" | "vehicle";
  classificationLabel: string;
  type: string;
  typeLabel: string;
  assignedTo: string;
  lastService: string;
  nextService: string;
  status: string;
  archived_at?: string | null;
  deleted_at?: string | null;
};

const EQUIPMENT_STATUS_CONFIG = {
  available: {
    className: "bg-success hover:bg-success text-white",
    label: "Available",
  },
  "in-use": {
    className: "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
    label: "In Use",
  },
  maintenance: {
    className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
    label: "Maintenance",
  },
  retired: {
    className:
      "bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
    label: "Retired",
  },
  active: {
    className: "bg-primary/15 text-primary",
    label: "Active",
  },
  inactive: {
    className: "bg-muted text-muted-foreground",
    label: "Inactive",
  },
  replaced: {
    className: "bg-muted text-muted-foreground",
    label: "Replaced",
  },
  "out-of-service": {
    className: "bg-warning text-warning",
    label: "Out of Service",
  },
  "in-service": {
    className: "bg-primary/15 text-primary",
    label: "In Service",
  },
} as const;

export function EquipmentTable({
  equipment,
  itemsPerPage = 50,
}: {
  equipment: Equipment[];
  itemsPerPage?: number;
}) {
  // Archive filter state
  const archiveFilter = useArchiveStore((state) => state.filters.equipment);

  // Filter equipment based on archive status
  const filteredEquipment = equipment.filter((item) => {
    const isArchived = Boolean(item.archived_at || item.deleted_at);
    if (archiveFilter === "active") {
      return !isArchived;
    }
    if (archiveFilter === "archived") {
      return isArchived;
    }
    return true; // "all"
  });

  const columns: ColumnDef<Equipment>[] = [
    {
      key: "assetId",
      header: "Asset ID",
      width: "w-32",
      shrink: true,
      sortable: true,
      render: (item) => (
        <Link
          className="font-medium text-foreground text-sm leading-tight hover:underline"
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
      sortable: true,
      render: (item) => (
        <Link
          className="block min-w-0"
          href={`/dashboard/work/equipment/${item.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="truncate font-medium text-foreground text-sm leading-tight hover:underline">
            {item.name}
          </div>
          <div className="mt-0.5 truncate text-muted-foreground text-xs leading-tight">
            {item.classificationLabel}
            {item.typeLabel &&
              item.typeLabel.toLowerCase() !==
                item.classificationLabel.toLowerCase() && (
                <span className="text-muted-foreground/80">
                  {" "}
                  • {item.typeLabel}
                </span>
              )}
          </div>
        </Link>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      width: "w-40",
      shrink: true,
      hideOnMobile: true,
      sortable: true,
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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
      render: (item) => (
        <GenericStatusBadge
          config={EQUIPMENT_STATUS_CONFIG}
          defaultStatus="available"
          status={item.status}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      width: "w-10",
      shrink: true,
      render: (_item) => (
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
              <DropdownMenuItem>
                <Archive className="mr-2 size-4" />
                Archive
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
      onClick: (_selectedIds) => {},
    },
    {
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      onClick: (_selectedIds) => {},
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      variant: "destructive",
      onClick: (_selectedIds) => {},
    },
  ];

  const searchFilter = (item: Equipment, query: string) => {
    const searchStr = query.toLowerCase();
    return (
      item.assetId.toLowerCase().includes(searchStr) ||
      item.name.toLowerCase().includes(searchStr) ||
      item.type.toLowerCase().includes(searchStr) ||
      item.typeLabel.toLowerCase().includes(searchStr) ||
      item.classification.toLowerCase().includes(searchStr) ||
      item.classificationLabel.toLowerCase().includes(searchStr) ||
      item.assignedTo.toLowerCase().includes(searchStr) ||
      item.status.toLowerCase().includes(searchStr)
    );
  };

  return (
    <FullWidthDataTable
      bulkActions={bulkActions}
      columns={columns}
      data={filteredEquipment}
      emptyAction={
        <Button
          onClick={() =>
            (window.location.href = "/dashboard/work/equipment/new")
          }
          size="sm"
        >
          <Plus className="mr-2 size-4" />
          Add Equipment
        </Button>
      }
      emptyIcon={<Truck className="h-8 w-8 text-muted-foreground" />}
      emptyMessage="No equipment found"
      enableSelection={true}
      entity="equipment"
      getHighlightClass={() => "bg-warning/30 dark:bg-warning/10"}
      getItemId={(item) => item.id}
      isArchived={(item) => Boolean(item.archived_at || item.deleted_at)}
      isHighlighted={(item) => item.status === "maintenance"}
      itemsPerPage={itemsPerPage}
      onRefresh={() => window.location.reload()}
      onRowClick={(item) =>
        (window.location.href = `/dashboard/work/equipment/${item.id}`)
      }
      searchFilter={searchFilter}
      searchPlaceholder="Search equipment by asset ID, name, type, assigned to, or status..."
      showArchived={archiveFilter !== "active"}
      showRefresh={false}
    />
  );
}
