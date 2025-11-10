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
import type { MaintenancePlan } from "@/components/work/maintenance-plans-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, Repeat, UserCheck } from "lucide-react";

type MaintenanceStatus = MaintenancePlan["status"];

type MaintenanceKanbanItem = KanbanItemBase & {
  plan: MaintenancePlan;
};

const MAINTENANCE_COLUMNS: Array<{
  id: MaintenanceStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "active", name: "Active", accentColor: "#22C55E" },
  { id: "pending", name: "Pending", accentColor: "#F59E0B" },
  { id: "paused", name: "Paused", accentColor: "#6B7280" },
  { id: "cancelled", name: "Cancelled", accentColor: "#EF4444" },
];

const columnLabel = new Map(
  MAINTENANCE_COLUMNS.map((column) => [column.id, column.name])
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function createItems(plans: MaintenancePlan[]): MaintenanceKanbanItem[] {
  return plans.map((plan) => ({
    id: plan.id,
    columnId: plan.status,
    plan,
  }));
}

export function MaintenancePlansKanban({ plans }: { plans: MaintenancePlan[] }) {
  const columns = useMemo(() => MAINTENANCE_COLUMNS, []);
  const [items, setItems] = useState<MaintenanceKanbanItem[]>(() =>
    createItems(plans)
  );

  useEffect(() => {
    setItems(createItems(plans));
  }, [plans]);

  const handleDataChange = (next: MaintenanceKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        plan: {
          ...item.plan,
          status: item.columnId as MaintenanceStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; recurring: number }>>(
      (acc, column) => {
        const columnItems = items.filter(
          (item) => item.columnId === column.id
        );
        const recurring = columnItems.filter(
          (item) => item.plan.frequency !== "Annual"
        ).length;
        acc[column.id] = { count: columnItems.length, recurring };
        return acc;
      },
      {}
    );
  }, [columns, items]);

  return (
    <KanbanProvider<MaintenanceKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <MaintenancePlanCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const meta = columnMeta[column.id] ?? { count: 0, recurring: 0 };
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
                  {meta.count} plans
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {meta.recurring} recurring
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards<MaintenanceKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No maintenance plans in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <MaintenancePlanCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

function MaintenancePlanCard({ item }: { item: MaintenanceKanbanItem }) {
  const { plan, columnId } = item;
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{plan.planName}</h3>
          <p className="text-xs text-muted-foreground">{plan.customer}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant={
                columnId === "active"
                  ? "secondary"
                  : columnId === "cancelled"
                    ? "destructive"
                    : "outline"
              }
              className={cn(
                "text-xs",
                columnId === "cancelled" &&
                  "bg-destructive/10 text-destructive",
                columnId === "active" && "bg-primary/10 text-primary"
              )}
            >
              {columnLabel.get(columnId as MaintenanceStatus) ?? columnId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {plan.frequency}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            {plan.serviceType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Repeat className="size-4 text-primary" />
          <span>{plan.frequency}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span>Next visit {plan.nextVisit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>Monthly fee</span>
        <span className="font-semibold text-foreground">
          {currencyFormatter.format(plan.monthlyFee / 100)}
        </span>
      </div>

      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full justify-between text-xs text-primary"
      >
        <Link href={`/dashboard/work/maintenance-plans/${plan.id}`}>
          Manage plan
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

