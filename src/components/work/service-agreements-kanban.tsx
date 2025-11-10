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
import type { ServiceAgreement } from "@/components/work/service-agreements-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, FileText } from "lucide-react";

type AgreementStatus = ServiceAgreement["status"];

type ServiceAgreementKanbanItem = KanbanItemBase & {
  agreement: ServiceAgreement;
};

const AGREEMENT_COLUMNS: Array<{
  id: AgreementStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "active", name: "Active", accentColor: "#22C55E" },
  { id: "pending", name: "Pending", accentColor: "#F59E0B" },
  { id: "expired", name: "Expired", accentColor: "#EF4444" },
  { id: "cancelled", name: "Cancelled", accentColor: "#6B7280" },
];

const columnLabel = new Map(
  AGREEMENT_COLUMNS.map((column) => [column.id, column.name])
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function createItems(agreements: ServiceAgreement[]): ServiceAgreementKanbanItem[] {
  return agreements.map((agreement) => ({
    id: agreement.id,
    columnId: agreement.status,
    agreement,
  }));
}

export function ServiceAgreementsKanban({
  agreements,
}: {
  agreements: ServiceAgreement[];
}) {
  const columns = useMemo(() => AGREEMENT_COLUMNS, []);
  const [items, setItems] = useState<ServiceAgreementKanbanItem[]>(() =>
    createItems(agreements)
  );

  useEffect(() => {
    setItems(createItems(agreements));
  }, [agreements]);

  const handleDataChange = (next: ServiceAgreementKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        agreement: {
          ...item.agreement,
          status: item.columnId as AgreementStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; total: number }>>(
      (acc, column) => {
        const columnItems = items.filter((i) => i.columnId === column.id);
        const total = columnItems.reduce(
          (sum, item) => sum + item.agreement.value,
          0
        );
        acc[column.id] = { count: columnItems.length, total };
        return acc;
      },
      {}
    );
  }, [columns, items]);

  return (
    <KanbanProvider<ServiceAgreementKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <ServiceAgreementCard item={item} />
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
                  {meta.count} agreements
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currencyFormatter.format(meta.total / 100)}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards<ServiceAgreementKanbanItem>
              className="min-h-[200px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No agreements in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <ServiceAgreementCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

function ServiceAgreementCard({ item }: { item: ServiceAgreementKanbanItem }) {
  const { agreement, columnId } = item;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {agreement.agreementNumber}
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            {agreement.customer}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                columnId === "active"
                  ? "secondary"
                  : columnId === "expired" || columnId === "cancelled"
                    ? "destructive"
                    : "outline"
              }
              className={cn(
                "text-xs",
                (columnId === "expired" || columnId === "cancelled") &&
                  "bg-destructive/10 text-destructive",
                columnId === "active" && "bg-primary/10 text-primary"
              )}
            >
              {columnLabel.get(columnId as AgreementStatus) ?? columnId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {agreement.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currencyFormatter.format(agreement.value / 100)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span>
            {agreement.startDate} → {agreement.endDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span>{agreement.type}</span>
        </div>
      </div>

      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full justify-between text-xs text-primary"
      >
        <Link href={`/dashboard/work/service-agreements/${agreement.id}`}>
          View agreement
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

