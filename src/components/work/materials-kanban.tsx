"use client";

import Link from "next/link";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban, type ColumnMeta } from "@/components/ui/entity-kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Material } from "@/components/work/materials-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type MaterialStatus = Material["status"];

type MaterialsKanbanItem = KanbanItemBase & {
  material: Material;
};

const MATERIAL_COLUMNS: Array<{
  id: MaterialStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "in-stock", name: "In Stock", accentColor: "#22C55E" },
  { id: "low-stock", name: "Low Stock", accentColor: "#F59E0B" },
  { id: "on-order", name: "On Order", accentColor: "#2563EB" },
  { id: "out-of-stock", name: "Out of Stock", accentColor: "#EF4444" },
];

const columnLabel = new Map(MATERIAL_COLUMNS.map((column) => [column.id, column.name]));

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function MaterialsKanban({ materials }: { materials: Material[] }) {
  return (
    <EntityKanban<Material, MaterialStatus>
      columns={MATERIAL_COLUMNS}
      data={materials}
      entityName="items"
      mapToKanbanItem={(material) => ({
        id: material.id,
        columnId: material.status,
        entity: material,
        material,
      })}
      updateEntityStatus={(material, newStatus) => ({
        ...material,
        status: newStatus,
      })}
      calculateColumnMeta={(columnId, items): ColumnMeta => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        const totalValue = columnItems.reduce(
          (sum, item) => sum + (item.entity as Material).totalValue,
          0
        );
        return { count: columnItems.length, value: totalValue };
      }}
      showTotals={true}
      formatTotal={(value) => currencyFormatter.format(value / 100)}
      renderCard={(item) => <MaterialCard item={{ ...item, material: item.entity } as MaterialsKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <MaterialCard item={{ ...item, material: item.entity } as MaterialsKanbanItem} />
        </div>
      )}
    />
  );
}

function MaterialCard({ item }: { item: MaterialsKanbanItem }) {
  const { material, columnId } = item;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {material.itemCode}
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            {material.description}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant={
                columnId === "in-stock"
                  ? "secondary"
                  : columnId === "out-of-stock"
                    ? "destructive"
                    : "outline"
              }
              className={cn(
                "text-xs",
                columnId === "out-of-stock" &&
                  "bg-destructive/10 text-destructive",
                columnId === "in-stock" && "bg-primary/10 text-primary"
              )}
            >
              {columnLabel.get(columnId as MaterialStatus) ?? columnId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {material.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Quantity</span>
          <span className="font-medium text-foreground">
            {material.quantity} {material.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Unit Cost</span>
          <span className="font-medium text-foreground">
            {currencyFormatter.format(material.unitCost / 100)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Total Value</span>
          <span className="font-semibold text-foreground">
            {currencyFormatter.format(material.totalValue / 100)}
          </span>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full justify-between text-xs text-primary"
      >
        <Link href={`/dashboard/work/materials/${material.id}`}>
          Manage inventory
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

