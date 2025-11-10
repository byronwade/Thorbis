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
import type { Estimate } from "@/components/work/estimates-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, ClipboardList } from "lucide-react";

type EstimateStatus = Estimate["status"];

type EstimatesKanbanItem = KanbanItemBase & {
  estimate: Estimate;
};

const ESTIMATE_COLUMNS: Array<{
  id: EstimateStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "draft", name: "Draft", accentColor: "#6B7280" },
  { id: "sent", name: "Sent", accentColor: "#2563EB" },
  { id: "accepted", name: "Accepted", accentColor: "#22C55E" },
  { id: "declined", name: "Declined", accentColor: "#EF4444" },
];

const columnLabel = new Map(ESTIMATE_COLUMNS.map((column) => [column.id, column.name]));

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function createItems(estimates: Estimate[]): EstimatesKanbanItem[] {
  return estimates.map((estimate) => ({
    id: estimate.id,
    columnId: estimate.status,
    estimate,
  }));
}

export function EstimatesKanban({ estimates }: { estimates: Estimate[] }) {
  const columns = useMemo(() => ESTIMATE_COLUMNS, []);
  const [items, setItems] = useState<EstimatesKanbanItem[]>(() =>
    createItems(estimates)
  );

  useEffect(() => {
    setItems(createItems(estimates));
  }, [estimates]);

  const handleDataChange = (next: EstimatesKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        estimate: {
          ...item.estimate,
          status: item.columnId as EstimateStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; total: number }>>(
      (acc, column) => {
        const columnItems = items.filter(
          (item) => item.columnId === column.id
        );
        const total = columnItems.reduce(
          (sum, item) => sum + item.estimate.amount,
          0
        );
        acc[column.id] = { count: columnItems.length, total };
        return acc;
      },
      {}
    );
  }, [columns, items]);

  return (
    <KanbanProvider<EstimatesKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <EstimateCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const meta = columnMeta[column.id] ?? { count: 0, total: 0 };
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
                  {meta.count} estimates
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currencyFormatter.format(meta.total / 100)}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards<EstimatesKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No estimates in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <EstimateCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

function EstimateCard({ item }: { item: EstimatesKanbanItem }) {
  const { estimate, columnId } = item;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {estimate.estimateNumber}
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            {estimate.project}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={columnId === "declined" ? "destructive" : "secondary"}
              className={cn(
                "text-xs",
                columnId === "declined" && "bg-destructive/10 text-destructive"
              )}
            >
              {columnLabel.get(columnId as EstimateStatus) ?? columnId}
            </Badge>
            <Badge variant="outline" className="bg-muted/60 text-muted-foreground">
              {currencyFormatter.format(estimate.amount / 100)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ClipboardList className="size-4 text-primary" />
          <span className="font-medium text-foreground">{estimate.customer}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span>{estimate.date} → {estimate.validUntil}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>Valid until {estimate.validUntil}</span>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="gap-1 text-xs text-primary"
        >
          <Link href={`/dashboard/work/estimates/${estimate.id}`}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

