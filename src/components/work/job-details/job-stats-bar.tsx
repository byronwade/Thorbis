"use client";

/**
 * Job Stats Bar - Client Component
 * Stock ticker-style statistics for job metrics
 *
 * Features:
 * - Permanent stats bar above job details page
 * - Revenue, Labor Hours, Profitability, Status Progress
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 * - Matches Customer page design pattern
 */

import { type StatCard } from "@/components/ui/stats-cards";
import { EntityStatsBar } from "@/components/ui/entity-stats-bar";

interface JobStatsBarProps {
  metrics: {
    totalAmount: number; // in cents
    paidAmount: number; // in cents
    totalLaborHours: number; // decimal hours
    estimatedLaborHours: number; // decimal hours
    materialsCost: number; // in cents
    profitMargin: number; // percentage
    completionPercentage: number; // 0-100
  };
  jobId: string;
  status: string;
  compact?: boolean;
}

export function JobStatsBar({
  metrics,
  status,
  compact = false,
}: JobStatsBarProps) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const formatHours = (hours: number) => `${hours.toFixed(1)}h`;

  const formatPercentage = (value: number) => `${value.toFixed(0)}%`;

  // Calculate outstanding balance
  const outstanding = metrics.totalAmount - metrics.paidAmount;

  // Calculate profit (revenue minus costs)
  const estimatedProfit = metrics.totalAmount - metrics.materialsCost;
  const profitMarginCalc =
    metrics.totalAmount > 0
      ? ((estimatedProfit / metrics.totalAmount) * 100).toFixed(0)
      : 0;

  // Calculate labor efficiency (actual vs estimated)
  const laborEfficiency =
    metrics.estimatedLaborHours > 0
      ? (
          (metrics.totalLaborHours / metrics.estimatedLaborHours) * 100 -
          100
        ).toFixed(0)
      : 0;

  const jobStats: StatCard[] = [
    {
      label: "Job Value",
      value: formatCurrency(metrics.totalAmount),
      change:
        outstanding > 0
          ? Number((-((outstanding / metrics.totalAmount) * 100)).toFixed(2))
          : undefined,
      changeLabel:
        outstanding > 0 ? `${formatCurrency(outstanding)} due` : "paid in full",
    },
    {
      label: "Labor Hours",
      value: formatHours(metrics.totalLaborHours),
      change: metrics.estimatedLaborHours > 0 ? Number(laborEfficiency) : 0,
      changeLabel:
        metrics.estimatedLaborHours > 0
          ? `vs ${formatHours(metrics.estimatedLaborHours)} est`
          : "no estimate",
    },
    {
      label: "Profitability",
      value: formatCurrency(estimatedProfit),
      change: Number(profitMarginCalc),
      changeLabel: `${profitMarginCalc}% margin`,
    },
    {
      label: "Progress",
      value: formatPercentage(metrics.completionPercentage),
      change: metrics.completionPercentage === 100 ? 100 : undefined,
      changeLabel: status,
    },
  ];

  return <EntityStatsBar compact={compact} stats={jobStats} />;
}
