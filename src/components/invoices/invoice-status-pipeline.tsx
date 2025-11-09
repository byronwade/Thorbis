/**
 * Invoice Status Pipeline - Client Component
 * Stock ticker-style statistics for invoice statuses
 *
 * Features:
 * - Stock ticker design with colored trend indicators
 * - Green for positive changes, red for negative
 * - Full-width seamless design
 * - Matches JobStatusPipeline structure
 */

"use client";

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "draft" | "overdue";
};

interface InvoiceStatusPipelineProps {
  invoices: Invoice[];
}

export function InvoiceStatusPipeline({
  invoices,
}: InvoiceStatusPipelineProps) {
  // Calculate stats from invoices
  const draftCount = invoices.filter((inv) => inv.status === "draft").length;
  const pendingCount = invoices.filter(
    (inv) => inv.status === "pending"
  ).length;
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  const overdueCount = invoices.filter(
    (inv) => inv.status === "overdue"
  ).length;

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueRevenue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const invoiceStats: StatCard[] = [
    {
      label: "Draft",
      value: draftCount,
      change: 0,
      changeLabel: "ready to send",
    },
    {
      label: "Pending",
      value: `$${(pendingRevenue / 100).toLocaleString()}`,
      change: pendingCount > 0 ? 0 : 1,
      changeLabel: `${pendingCount} invoices`,
    },
    {
      label: "Paid",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: paidCount > 0 ? 1 : 0,
      changeLabel: `${paidCount} invoices`,
    },
    {
      label: "Overdue",
      value: `$${(overdueRevenue / 100).toLocaleString()}`,
      change: overdueCount > 0 ? -1 : 1,
      changeLabel:
        overdueCount > 0 ? `${overdueCount} need attention` : "all current",
    },
    {
      label: "Total Invoices",
      value: invoices.length,
      change: 1,
      changeLabel: "this month",
    },
  ];

  return <StatsCards stats={invoiceStats} variant="ticker" />;
}
