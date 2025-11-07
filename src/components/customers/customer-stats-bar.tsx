"use client";

/**
 * Customer Stats Bar - Client Component
 * Stock ticker-style statistics for customer metrics
 *
 * Features:
 * - Permanent stats bar above customer page
 * - Revenue, Jobs, Properties, Outstanding Balance
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 * - Matches Jobs page design pattern
 */

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

interface CustomerStatsBarProps {
  metrics: {
    totalRevenue: number;
    totalJobs: number;
    totalProperties: number;
    outstandingBalance: number;
  };
  customerId: string;
  compact?: boolean;
}

export function CustomerStatsBar({ metrics, compact = false }: CustomerStatsBarProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const customerStats: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      change: 0, // TODO: Calculate vs last period
      changeLabel: "all time",
    },
    {
      label: "Jobs",
      value: metrics.totalJobs,
      change: 0, // TODO: Calculate vs last period
      changeLabel: "total",
    },
    {
      label: "Properties",
      value: metrics.totalProperties,
      change: 0,
      changeLabel: "locations",
    },
    {
      label: "Outstanding",
      value: formatCurrency(metrics.outstandingBalance),
      change: metrics.outstandingBalance > 0 ? -1 : 0, // Negative if balance exists
      changeLabel: "balance due",
    },
  ];

  return <StatsCards stats={customerStats} variant="ticker" compact={compact} />;
}
