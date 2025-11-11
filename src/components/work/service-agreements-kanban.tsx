"use client";

import Link from "next/link";
import type { KanbanItemBase } from "@/components/ui/shadcn-io/kanban";
import { EntityKanban, type ColumnMeta } from "@/components/ui/entity-kanban";
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

export function ServiceAgreementsKanban({
  agreements,
}: {
  agreements: ServiceAgreement[];
}) {
  return (
    <EntityKanban<ServiceAgreement, AgreementStatus>
      columns={AGREEMENT_COLUMNS}
      data={agreements}
      entityName="agreements"
      mapToKanbanItem={(agreement) => ({
        id: agreement.id,
        columnId: agreement.status,
        entity: agreement,
        agreement,
      })}
      updateEntityStatus={(agreement, newStatus) => ({
        ...agreement,
        status: newStatus,
      })}
      calculateColumnMeta={(columnId, items): ColumnMeta => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        const total = columnItems.reduce(
          (sum, item) => sum + (item.entity as ServiceAgreement).value,
          0
        );
        return { count: columnItems.length, total };
      }}
      showTotals={true}
      formatTotal={(total) => currencyFormatter.format(total / 100)}
      renderCard={(item) => <ServiceAgreementCard item={{ ...item, agreement: item.entity } as ServiceAgreementKanbanItem} />}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
          <ServiceAgreementCard item={{ ...item, agreement: item.entity } as ServiceAgreementKanbanItem} />
        </div>
      )}
    />
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

