"use client";

import { Calendar, Eye, MoreHorizontal, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
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

type PropertyEquipment = {
  id: string;
  equipment_number: string;
  name: string;
  type?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  install_date?: string;
  warranty_expiry?: string;
  status?: string;
  location?: string;
};

type PropertyEquipmentTableProps = {
  equipment: PropertyEquipment[];
};

export function PropertyEquipmentTable({
  equipment,
}: PropertyEquipmentTableProps) {
  const getStatusColor = (status?: string) => {
    if (!status) {
      return "bg-secondary0/10 text-muted-foreground";
    }
    const statusColors: Record<string, string> = {
      active: "bg-success/10 text-success hover:bg-success/20",
      inactive: "bg-secondary0/10 text-muted-foreground hover:bg-secondary0/20",
      maintenance: "bg-warning/10 text-warning hover:bg-warning/20",
      retired: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    };
    return (
      statusColors[status.toLowerCase()] ||
      "bg-secondary0/10 text-muted-foreground"
    );
  };

  const columns: ColumnDef<PropertyEquipment>[] = useMemo(
    () => [
      {
        key: "equipment_number",
        header: "Equipment #",
        width: "w-32",
        shrink: true,
        render: (equipment) => (
          <Link
            className="font-medium font-mono text-sm hover:underline"
            href={`/dashboard/work/equipment/${equipment.id}`}
          >
            {equipment.equipment_number}
          </Link>
        ),
      },
      {
        key: "name",
        header: "Name",
        render: (equipment) => (
          <Link
            className="block min-w-0"
            href={`/dashboard/work/equipment/${equipment.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm leading-tight hover:underline">
                {equipment.name}
              </span>
              {equipment.type && (
                <span className="text-muted-foreground text-xs">
                  {equipment.type}
                </span>
              )}
            </div>
          </Link>
        ),
      },
      {
        key: "manufacturer",
        header: "Manufacturer",
        width: "w-48",
        hideOnMobile: true,
        render: (equipment) => (
          <div className="flex flex-col gap-1 text-sm">
            <span>{equipment.manufacturer || "-"}</span>
            {equipment.model && (
              <span className="text-muted-foreground text-xs">
                Model: {equipment.model}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "serial_number",
        header: "Serial Number",
        width: "w-40",
        hideOnMobile: true,
        render: (equipment) => (
          <span className="font-mono text-sm">
            {equipment.serial_number || "-"}
          </span>
        ),
      },
      {
        key: "location",
        header: "Location",
        width: "w-32",
        hideOnMobile: true,
        render: (equipment) => (
          <span className="text-sm">{equipment.location || "-"}</span>
        ),
      },
      {
        key: "install_date",
        header: "Installed",
        width: "w-32",
        shrink: true,
        render: (equipment) => {
          const installDate = equipment.install_date;
          return installDate ? (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              <span>
                {new Date(installDate).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        width: "w-28",
        shrink: true,
        render: (equipment) => {
          const status = equipment.status || "active";
          return <Badge className={getStatusColor(status)}>{status}</Badge>;
        },
      },
      {
        key: "actions",
        header: "",
        width: "w-12",
        shrink: true,
        align: "right",
        render: (equipment) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work/equipment/${equipment.id}`}>
                  <Eye className="mr-2 size-4" />
                  View Equipment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Wrench className="mr-2 size-4" />
                Schedule Maintenance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [getStatusColor]
  );

  return (
    <FullWidthDataTable
      columns={columns}
      data={equipment}
      emptyMessage="No equipment installed at this property"
      getItemId={(item) => item.id}
      searchFilter={(item, query) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.equipment_number.toLowerCase().includes(query.toLowerCase()) ||
        (item.serial_number?.toLowerCase().includes(query.toLowerCase()) ??
          false)
      }
      searchPlaceholder="Search equipment..."
    />
  );
}
