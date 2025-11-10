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
import type {
  POStatus,
  PurchaseOrder,
} from "@/components/work/purchase-orders-table";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CalendarDays, PackageCheck, Warehouse } from "lucide-react";

type PurchaseOrderKanbanItem = KanbanItemBase & {
  order: PurchaseOrder;
};

const PO_COLUMNS: Array<{
  id: POStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "draft", name: "Draft", accentColor: "#6B7280" },
  { id: "pending_approval", name: "Pending Approval", accentColor: "#F59E0B" },
  { id: "approved", name: "Approved", accentColor: "#22C55E" },
  { id: "ordered", name: "Ordered", accentColor: "#2563EB" },
  { id: "partially_received", name: "Partially Received", accentColor: "#9333EA" },
  { id: "received", name: "Received", accentColor: "#16A34A" },
  { id: "cancelled", name: "Cancelled", accentColor: "#EF4444" },
];

const columnLabel = new Map(PO_COLUMNS.map((column) => [column.id, column.name]));

const priorityBadge: Record<
  PurchaseOrder["priority"],
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-blue-100 text-blue-700" },
  normal: { label: "Normal", className: "bg-muted text-muted-foreground" },
  high: { label: "High", className: "bg-orange-100 text-orange-700" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700" },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function createItems(orders: PurchaseOrder[]): PurchaseOrderKanbanItem[] {
  return orders.map((order) => ({
    id: order.id,
    columnId: order.status,
    order,
  }));
}

export function PurchaseOrdersKanban({ orders }: { orders: PurchaseOrder[] }) {
  const columns = useMemo(() => PO_COLUMNS, []);
  const [items, setItems] = useState<PurchaseOrderKanbanItem[]>(() =>
    createItems(orders)
  );

  useEffect(() => {
    setItems(createItems(orders));
  }, [orders]);

  const handleDataChange = (next: PurchaseOrderKanbanItem[]) => {
    setItems(
      next.map((item) => ({
        ...item,
        order: {
          ...item.order,
          status: item.columnId as POStatus,
        },
      }))
    );
  };

  const columnMeta = useMemo(() => {
    return columns.reduce<Record<string, { count: number; total: number }>>(
      (acc, column) => {
        const columnItems = items.filter((item) => item.columnId === column.id);
        const total = columnItems.reduce(
          (sum, item) => sum + item.order.totalAmount,
          0
        );
        acc[column.id] = { count: columnItems.length, total };
        return acc;
      },
      {}
    );
  }, [columns, items]);

  return (
    <KanbanProvider<PurchaseOrderKanbanItem>
      className="pb-4"
      columns={columns}
      data={items}
      onDataChange={handleDataChange}
      renderDragOverlay={(item) => {
        return (
          <div className="w-[280px] rounded-xl border border-border/70 bg-background/95 p-4 shadow-lg">
            <PurchaseOrderCard item={item} />
          </div>
        );
      }}
    >
      {columns.map((column) => {
        const meta = columnMeta[column.id] ?? { count: 0, total: 0 };
        return (
          <KanbanBoard
            className="min-h-[320px] flex-1"
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
                  {meta.count} POs
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {currencyFormatter.format(meta.total / 100)}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards<PurchaseOrderKanbanItem>
              className="min-h-[220px]"
              columnId={column.id}
              emptyState={
                <div className="rounded-xl border border-dashed border-border/60 bg-background/60 p-4 text-center text-xs text-muted-foreground">
                  No purchase orders in {column.name}
                </div>
              }
            >
              {(item) => (
                <KanbanCard itemId={item.id} key={item.id}>
                  <PurchaseOrderCard item={item} />
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        );
      })}
    </KanbanProvider>
  );
}

function PurchaseOrderCard({ item }: { item: PurchaseOrderKanbanItem }) {
  const { order, columnId } = item;
  const priority = priorityBadge[order.priority];

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {order.poNumber}
          </p>
          <h3 className="text-sm font-semibold text-foreground">
            {order.title}
          </h3>
          <p className="text-xs text-muted-foreground">{order.vendor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant={
                columnId === "cancelled"
                  ? "destructive"
                  : columnId === "approved" || columnId === "received"
                    ? "secondary"
                    : "outline"
              }
              className={cn(
                "text-xs",
                columnId === "cancelled" && "bg-destructive/10 text-destructive",
                (columnId === "approved" || columnId === "received") &&
                  "bg-primary/10 text-primary"
              )}
            >
              {columnLabel.get(columnId as POStatus) ?? columnId}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", priority.className)}>
              {priority.label}
            </Badge>
            {order.autoGenerated && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground/80">
                Auto-generated
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Warehouse className="size-4 text-primary" />
          <span className="font-medium text-foreground">{order.requestedBy}</span>
        </div>
        {order.jobNumber && (
          <div className="flex items-center gap-2">
            <PackageCheck className="size-4 text-primary" />
            <span>{order.jobNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <span>
            {order.createdAt}
            {order.expectedDelivery && ` → ${order.expectedDelivery}`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>Total</span>
        <span className="font-semibold text-foreground">
          {currencyFormatter.format(order.totalAmount / 100)}
        </span>
      </div>

      <Button
        asChild
        size="sm"
        variant="ghost"
        className="w-full justify-between text-xs text-primary"
      >
        <Link href={`/dashboard/work/purchase-orders/${order.id}`}>
          View purchase order
          <ArrowUpRight className="size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

