"use client";

import { ArrowUpRight, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EntityKanban } from "@/components/ui/entity-kanban";
import type {
  KanbanItemBase,
  KanbanMoveEvent,
} from "@/components/ui/shadcn-io/kanban";
import { useToast } from "@/hooks/use-toast";

type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";

type Payment = {
  id: string;
  payment_number: string;
  amount: number;
  payment_method: string;
  status: string;
  processed_at?: string | Date | null;
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
    display_name?: string | null;
  } | null;
  invoice_id?: string | null;
  job_id?: string | null;
};

type PaymentsKanbanItem = KanbanItemBase & { entity: Payment };

type PaymentsKanbanProps = {
  payments: Payment[];
};

const PAYMENT_STATUS_COLUMNS: Array<{
  id: PaymentStatus;
  name: string;
  accentColor: string;
}> = [
  { id: "pending", name: "Pending", accentColor: "#F59E0B" },
  { id: "processing", name: "Processing", accentColor: "#2563EB" },
  { id: "completed", name: "Completed", accentColor: "#22C55E" },
  { id: "failed", name: "Failed", accentColor: "#EF4444" },
  { id: "refunded", name: "Refunded", accentColor: "#F97316" },
  {
    id: "partially_refunded",
    name: "Partially Refunded",
    accentColor: "#F59E0B",
  },
  { id: "cancelled", name: "Cancelled", accentColor: "#6B7280" },
];

const COLUMN_LABEL = new Map(
  PAYMENT_STATUS_COLUMNS.map((column) => [column.id, column.name])
);
const DEFAULT_STATUS: PaymentStatus = "pending";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function resolveStatus(status: string | null | undefined): PaymentStatus {
  if (!status) {
    return DEFAULT_STATUS;
  }

  const normalized = status as PaymentStatus;
  return COLUMN_LABEL.has(normalized) ? normalized : DEFAULT_STATUS;
}

function formatCurrency(cents: number | null | undefined) {
  if (cents === null || cents === undefined) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(cents / 100);
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: "Cash",
    check: "Check",
    credit_card: "Credit Card",
    debit_card: "Debit Card",
    ach: "ACH",
    wire: "Wire Transfer",
    venmo: "Venmo",
    paypal: "PayPal",
    other: "Other",
  };
  return labels[method] || method;
}

function getCustomerName(payment: Payment): string {
  if (payment.customer?.display_name) {
    return payment.customer.display_name;
  }
  if (payment.customer?.first_name || payment.customer?.last_name) {
    return `${payment.customer.first_name || ""} ${payment.customer.last_name || ""}`.trim();
  }
  return "Unknown Customer";
}

function PaymentCardContent({ item }: { item: PaymentsKanbanItem }) {
  const payment = item.entity;
  const columnId = item.columnId as PaymentStatus | undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link
            className="block font-semibold text-muted-foreground text-xs uppercase tracking-wide hover:text-primary"
            href={`/dashboard/work/payments/${payment.id}`}
          >
            {payment.payment_number}
          </Link>
          <h3 className="font-semibold text-foreground text-sm leading-snug">
            {formatCurrency(payment.amount)}
          </h3>
        </div>
      </div>

      <div className="space-y-2 text-muted-foreground text-xs">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="font-medium text-foreground">
            {getCustomerName(payment)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          <span>{getPaymentMethodLabel(payment.payment_method)}</span>
        </div>

        {payment.processed_at && (
          <div className="text-[11px]">
            {fullDateFormatter.format(new Date(payment.processed_at))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground tracking-wide">
        <span>
          {payment.processed_at &&
            fullDateFormatter.format(new Date(payment.processed_at))}
        </span>
        <span className="uppercase">
          {columnId ? (COLUMN_LABEL.get(columnId) ?? columnId) : "—"}
        </span>
      </div>

      <div className="flex items-center justify-end pt-1">
        <Button
          asChild
          className="gap-1 text-primary text-xs"
          size="sm"
          variant="ghost"
        >
          <Link href={`/dashboard/work/payments/${payment.id}`}>
            View
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function PaymentsKanban({ payments }: PaymentsKanbanProps) {
  const { toast } = useToast();
  const [_isPending, startTransition] = useTransition();

  const handleItemMove = async ({
    item,
    fromColumnId,
    toColumnId,
  }: KanbanMoveEvent<KanbanItemBase & { entity: Payment }>) => {
    if (fromColumnId === toColumnId) {
      return;
    }

    startTransition(() => {
      void (async () => {
        // TODO: Implement updatePaymentStatus action
        // const { updatePaymentStatus } = await import("@/actions/payments");
        // const result = await updatePaymentStatus(item.entity.id, toColumnId);

        // if (!result.success) {
        //   toast.error("Unable to move payment", {
        //     description: result.error,
        //   });
        //   return;
        // }

        toast.success(
          `Payment moved to ${COLUMN_LABEL.get(toColumnId as PaymentStatus)}`
        );
      })();
    });
  };

  return (
    <EntityKanban<Payment, PaymentStatus>
      calculateColumnMeta={(columnId, items) => {
        const columnItems = items.filter((item) => item.columnId === columnId);
        const total = columnItems.reduce(
          (sum, item) => sum + (item.entity.amount ?? 0),
          0
        );
        return { count: columnItems.length, total };
      }}
      columns={PAYMENT_STATUS_COLUMNS}
      data={payments}
      entityName="payments"
      formatTotal={(total) => formatCurrency(total)}
      mapToKanbanItem={(payment) => ({
        id: payment.id,
        columnId: resolveStatus(payment.status),
        entity: payment,
      })}
      onItemMove={handleItemMove}
      renderCard={(item) => (
        <PaymentCardContent item={item as PaymentsKanbanItem} />
      )}
      renderDragOverlay={(item) => (
        <div className="w-[280px] rounded-md border border-border/70 bg-background/95 p-3 shadow-lg">
          <PaymentCardContent item={item as PaymentsKanbanItem} />
        </div>
      )}
      showTotals={true}
      updateEntityStatus={(payment, newStatus) => ({
        ...payment,
        status: newStatus,
      })}
    />
  );
}
