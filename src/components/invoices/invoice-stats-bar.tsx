"use client";

/**
 * Invoice Stats Bar - Client Component
 *
 * Displays key invoice metrics at the top of the page (like customer stats bar).
 * Uses the StatsCards component with ticker variant.
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

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

interface InvoiceStatsBarProps {
  invoice: {
    total_amount: number; // in cents
    paid_amount: number; // in cents
    balance_amount: number; // in cents
    due_date: string;
    status: string;
    created_at: string;
  };
  compact?: boolean;
}

export function InvoiceStatsBar({ invoice, compact = false }: InvoiceStatsBarProps) {
  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // Calculate percentage paid
  const percentPaid = invoice.total_amount > 0
    ? Math.round((invoice.paid_amount / invoice.total_amount) * 100)
    : 0;

  // Calculate days until due
  const daysUntilDue = () => {
    if (!invoice.due_date) return null;
    const due = new Date(invoice.due_date);
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
        return "text-green-600";
      case "draft":
        return "text-gray-500";
      case "sent":
        return "text-blue-600";
      case "overdue":
        return "text-red-600";
      case "partial":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const stats: StatCard[] = [
    {
      label: "Total Amount",
      value: formatCurrency(invoice.total_amount),
    },
    {
      label: "Paid",
      value: formatCurrency(invoice.paid_amount),
      change: percentPaid,
      changeLabel: `${percentPaid}% paid`,
    },
    {
      label: "Balance Due",
      value: formatCurrency(invoice.balance_amount),
      change: invoice.balance_amount > 0 ? -1 : 1,
    },
    {
      label: "Due Date",
      value: invoice.due_date
        ? new Date(invoice.due_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not set",
      changeLabel: days !== null
        ? isOverdue
          ? `${Math.abs(days)} days overdue`
          : `${days} days remaining`
        : undefined,
      change: isOverdue ? -1 : days !== null && days <= 7 ? 0 : 1,
    },
    {
      label: "Status",
      value: invoice.status.toUpperCase(),
    },
  ];

  return <StatsCards stats={stats} variant="ticker" compact={compact} />;
}
