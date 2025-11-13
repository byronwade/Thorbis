"use client";

/**
 * Estimate Stats Bar - Client Component
 * Stock ticker-style statistics for estimate metrics
 *
 * Features:
 * - Permanent stats bar above estimate details page
 * - Total Amount, Line Items, Status, Valid Until
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 * - Matches Job Details design pattern
 */

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

interface EstimateStatsBarProps {
  entityId: string;
  metrics: {
    totalAmount: number; // in cents
    lineItemsCount: number; // Number of line items
    status: string; // draft, sent, accepted, rejected
    validUntil: string | null; // Expiration date
    daysUntilExpiry: number | null; // Days until expiration
    isAccepted: boolean; // Whether estimate was accepted
  };
  compact?: boolean;
}

export function EstimateStatsBar({
  entityId,
  metrics,
  compact = false,
}: EstimateStatsBarProps) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);

  const formatValidUntil = (
    dateString: string | null,
    daysUntil: number | null
  ) => {
    if (!dateString) return "No expiry";
    if (daysUntil === null) return "No expiry";
    if (daysUntil < 0) return "Expired";
    if (daysUntil === 0) return "Expires today";
    if (daysUntil === 1) return "Expires tomorrow";
    if (daysUntil < 7) return `${daysUntil} days left`;
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<
      string,
      { change: number | undefined; label: string }
    > = {
      draft: { change: undefined, label: "not sent" },
      sent: { change: 50, label: "awaiting response" },
      accepted: { change: 100, label: "customer approved" },
      rejected: { change: 0, label: "declined" },
    };
    return (
      statusMap[status.toLowerCase()] || { change: undefined, label: status }
    );
  };

  const statusInfo = getStatusColor(metrics.status);

  const estimateStats: StatCard[] = [
    {
      label: "Estimate Value",
      value: formatCurrency(metrics.totalAmount),
      change: metrics.isAccepted ? 100 : undefined,
      changeLabel: metrics.isAccepted
        ? "accepted"
        : `${metrics.lineItemsCount} item${metrics.lineItemsCount !== 1 ? "s" : ""}`,
    },
    {
      label: "Line Items",
      value: metrics.lineItemsCount.toString(),
      change: metrics.lineItemsCount > 0 ? undefined : 0,
      changeLabel:
        metrics.totalAmount > 0
          ? formatCurrency(metrics.totalAmount)
          : "no items",
    },
    {
      label: "Status",
      value: metrics.status,
      change: statusInfo.change,
      changeLabel: statusInfo.label,
    },
    {
      label: "Valid Until",
      value: formatValidUntil(metrics.validUntil, metrics.daysUntilExpiry),
      change:
        metrics.daysUntilExpiry !== null && metrics.daysUntilExpiry >= 0
          ? metrics.daysUntilExpiry < 7
            ? 0
            : undefined
          : undefined,
      changeLabel:
        metrics.validUntil && metrics.daysUntilExpiry !== null
          ? metrics.daysUntilExpiry < 0
            ? "expired"
            : metrics.daysUntilExpiry === 0
              ? "today"
              : "valid"
          : "no limit",
    },
  ];

  return <EntityStatsBar compact={compact} stats={estimateStats} />;
}
