"use client";

import Link from "next/link";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban } from "@/components/ui/entity-kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Equipment } from "@/components/work/equipment-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, Wrench, User } from "lucide-react";

type EquipmentStatus = Equipment["status"];

type EquipmentKanbanItem = KanbanItemBase & {
  equipment: Equipment;
};

const EQUIPMENT_COLUMNS: Array<{
  id: EquipmentStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "available", name: "Available", accentColor: "#22C55E" },
  { id: "in-use", name: "In Use", accentColor: "#2563EB" },
  { id: "maintenance", name: "Maintenance", accentColor: "#F59E0B" },
  { id: "retired", name: "Retired", accentColor: "#6B7280" },
];

const columnLabel = new Map(EQUIPMENT_COLUMNS.map((column) => [column.id, column.name]));

export function EquipmentKanban({ equipment }: { equipment: Equipment[] }) {
  return (
    <EntityKanban<Equipment, EquipmentStatus>
      columns={EQUIPMENT_COLUMNS}
      data={equipment}
      entityName="assets"
      mapToKanbanItem={(item) => ({
        id: item.id,
        columnId: item.status,
        entity: item,
        equipment: item,
      })}
      updateEntityStatus={(item, newStatus) => ({
        ...item,
        status: newStatus,
      })}
      renderCard={(item) => <EquipmentCard item={{ ...item, equipment: item.entity } as EquipmentKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <EquipmentCard item={{ ...item, equipment: item.entity } as EquipmentKanbanItem} />
        </div>
      )}
    />
  );
}

function EquipmentCard({ item }: { item: EquipmentKanbanItem }) {
  const { equipment, columnId } = item;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {equipment.assetId}
        </p>
        <h3 className="text-sm font-semibold text-foreground">{equipment.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge
            variant={
              columnId === "available"
                ? "secondary"
                : columnId === "retired"
                  ? "destructive"
                  : "outline"
            }
            className={cn(
              "text-xs",
              columnId === "retired" && "bg-destructive/10 text-destructive",
              columnId === "available" && "bg-primary/10 text-primary"
            )}
          >
            {columnLabel.get(columnId as EquipmentStatus) ?? columnId}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {equipment.type}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="font-medium text-foreground">{equipment.assignedTo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-primary" />
          <span>Last service {equipment.lastService}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span>Next service {equipment.nextService}</span>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full justify-between text-xs text-primary"
      >
        <Link href={`/dashboard/work/equipment/${equipment.id}`}>
          View asset
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

