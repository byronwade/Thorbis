"use client";

/**
 * Invoice Stats Bar - Client Component
 *
 * Displays key invoice metrics at the top of the page (like customer stats bar).
 * Uses the EntityStatsBar component with ticker variant.
 *
 * Stats:
 * - Total Amount
 * - Paid Amount (with percentage badge)
 * - Balance Due (red if overdue)
 * - Due Date (with days remaining)
 * - Status (color-coded)
 *
 * Features:
 * - Supports compact mode for sticky scrolling
 */

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

interface InvoiceStatsBarProps {
  entityId: string;
  metrics: {
    totalAmount: number; // in cents
    paidAmount: number; // in cents
    balanceAmount: number; // in cents
    dueDate: string | null;
    status: string;
    createdAt: string;
  };
  compact?: boolean;
}

export function InvoiceStatsBar({
  entityId,
  metrics,
  compact = false,
}: InvoiceStatsBarProps) {
  // Format currency
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  // Calculate percentage paid
  const percentPaid =
    metrics.totalAmount > 0
      ? Math.round((metrics.paidAmount / metrics.totalAmount) * 100)
      : 0;

  // Calculate days until due
  const daysUntilDue = () => {
    if (!metrics.dueDate) return null;
    const due = new Date(metrics.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = daysUntilDue();
  const isOverdue = days !== null && days < 0;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-success";
      case "draft":
        return "text-muted-foreground";
      case "sent":
        return "text-primary";
      case "overdue":
        return "text-destructive";
      case "partial":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  const stats: StatCard[] = [
    {
      label: "Total Amount",
      value: formatCurrency(metrics.totalAmount),
    },
    {
      label: "Paid",
      value: formatCurrency(metrics.paidAmount),
      change: percentPaid,
      changeLabel: `${percentPaid}% paid`,
    },
    {
      label: "Balance Due",
      value: formatCurrency(metrics.balanceAmount),
      change: metrics.balanceAmount > 0 ? -1 : 1,
    },
    {
      label: "Due Date",
      value: metrics.dueDate
        ? new Date(metrics.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not set",
      changeLabel:
        days !== null
          ? isOverdue
            ? `${Math.abs(days)} days overdue`
            : `${days} days remaining`
          : undefined,
      change: isOverdue ? -1 : days !== null && days <= 7 ? 0 : 1,
    },
    {
      label: "Status",
      value: metrics.status.toUpperCase(),
    },
  ];

  return <EntityStatsBar compact={compact} stats={stats} />;
}
