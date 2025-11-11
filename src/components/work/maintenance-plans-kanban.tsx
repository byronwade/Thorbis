"use client";

import Link from "next/link";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban } from "@/components/ui/entity-kanban";
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

export function MaintenancePlansKanban({ plans }: { plans: MaintenancePlan[] }) {
  return (
    <EntityKanban<MaintenancePlan, MaintenanceStatus>
      columns={MAINTENANCE_COLUMNS}
      data={plans}
      entityName="plans"
      mapToKanbanItem={(plan) => ({
        id: plan.id,
        columnId: plan.status,
        entity: plan,
        plan,
      })}
      updateEntityStatus={(plan, newStatus) => ({
        ...plan,
        status: newStatus,
      })}
      renderCard={(item) => <MaintenancePlanCard item={{ ...item, plan: item.entity } as MaintenanceKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <MaintenancePlanCard item={{ ...item, plan: item.entity } as MaintenanceKanbanItem} />
        </div>
      )}
    />
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

