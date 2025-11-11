"use client";

import Link from "next/link";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban, type ColumnMeta } from "@/components/ui/entity-kanban";
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

export function EstimatesKanban({ estimates }: { estimates: Estimate[] }) {
  return (
    <EntityKanban<Estimate, EstimateStatus>
      columns={ESTIMATE_COLUMNS}
      data={estimates}
      entityName="estimates"
      mapToKanbanItem={(estimate) => ({
        id: estimate.id,
        columnId: estimate.status,
        entity: estimate,
        estimate,
      })}
      updateEntityStatus={(estimate, newStatus) => ({
        ...estimate,
        status: newStatus,
      })}
      calculateColumnMeta={(columnId, items): ColumnMeta => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        const total = columnItems.reduce(
          (sum, item) => sum + (item.entity as Estimate).amount,
          0
        );
        return { count: columnItems.length, total };
      }}
      showTotals={true}
      formatTotal={(total) => currencyFormatter.format(total / 100)}
      renderCard={(item) => <EstimateCard item={{ ...item, estimate: item.entity } as EstimatesKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <EstimateCard item={{ ...item, estimate: item.entity } as EstimatesKanbanItem} />
        </div>
      )}
    />
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

