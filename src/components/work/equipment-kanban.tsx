"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
  type KanbanItemBase,
} from "@/components/ui/shadcn-io/kanban";
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

function createItems(equipment: Equipment[]): EquipmentKanbanItem[] {
  return equipment.map((item) => ({
    id: item.id,
    columnId: item.status,
    equipment: item,
  }));
}

export function EquipmentKanban({ equipment }: { equipment: Equipment[] }) {
  const columns = useMemo(() => EQUIPMENT_COLUMNS, []);
  const [items, setItems] = useState<EquipmentKanbanItem[]>(() =>
    createItems(equipment)
  );

  useEffect(() => {
    setItems(createItems(equipment));
  }, [equipment]);

  const handleDataChange = (next: EquipmentKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        equipment: {
          ...item.equipment,
          status: item.columnId as EquipmentStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, number>>((acc, column) => {
      acc[column.id] = items.filter((item) => item.columnId === column.id).length;
      return acc;
    }, {});
  }, [columns, items]);

  return (
    <KanbanProvider<EquipmentKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <EquipmentCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const count = columnMeta[column.id] ?? 0;
        return (
          <KanbanBoard
            className="min-h-[300px] flex-1"
            column={column}
            key={column.id}
          >
            <KanbanHeader>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: column.accentColor }}
                />
                <span className="font-semibold text-sm text-foreground">
                  {column.name}
                </span>
                <Badge
                  className="rounded-full bg-muted px-2 py-0 text-xs font-medium text-muted-foreground"
                  variant="secondary"
                >
                  {count} assets
                </Badge>
              </div>
            </KanbanHeader>
            <KanbanCards<EquipmentKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No equipment in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <EquipmentCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
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

