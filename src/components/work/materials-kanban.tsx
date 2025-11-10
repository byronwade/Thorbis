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

function createItems(materials: Material[]): MaterialsKanbanItem[] {
  return materials.map((material) => ({
    id: material.id,
    columnId: material.status,
    material,
  }));
}

export function MaterialsKanban({ materials }: { materials: Material[] }) {
  const columns = useMemo(() => MATERIAL_COLUMNS, []);
  const [items, setItems] = useState<MaterialsKanbanItem[]>(() =>
    createItems(materials)
  );

  useEffect(() => {
    setItems(createItems(materials));
  }, [materials]);

  const handleDataChange = (next: MaterialsKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        material: {
          ...item.material,
          status: item.columnId as MaterialStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; value: number }>>(
      (acc, column) => {
        const columnItems = items.filter(
          (item) => item.columnId === column.id
        );
        const totalValue = columnItems.reduce(
          (sum, item) => sum + item.material.totalValue,
          0
        );
        acc[column.id] = { count: columnItems.length, value: totalValue };
        return acc;
      },
      {}
    );
  }, [columns, items]);

  return (
    <KanbanProvider<MaterialsKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <MaterialCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const meta = columnMeta[column.id] ?? { count: 0, value: 0 };
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
                  {meta.count} items
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currencyFormatter.format(meta.value / 100)}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards<MaterialsKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No materials in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <MaterialCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
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

