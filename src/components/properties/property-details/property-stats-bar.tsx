"use client";

/**
 * Property Stats Bar - Client Component
 * Stock ticker-style statistics for property metrics
 *
 * Features:
 * - Permanent stats bar above property details page
 * - Total Jobs, Total Revenue, Last Service, Next Scheduled
 * - Full-width seamless design
 * - Supports compact mode for sticky scrolling
 * - Matches Job Details design pattern
 */

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

interface PropertyStatsBarProps {
  entityId: string;
  metrics: {
    totalJobs: number; // Total jobs at this property
    activeJobs: number; // Currently active jobs
    totalRevenue: number; // Total revenue from all jobs (in cents)
    lastServiceDate: string | null; // Last completed job date
    nextScheduledDate: string | null; // Next scheduled job date
    equipmentCount: number; // Equipment installed at property
  };
  compact?: boolean;
}

export function PropertyStatsBar({
  entityId,
  metrics,
  compact = false,
}: PropertyStatsBarProps) {
  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatNextScheduled = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate job activity level
  const jobActivityChange = metrics.activeJobs > 0 ? 100 : 0;

  const propertyStats: StatCard[] = [
    {
      label: "Total Jobs",
      value: metrics.totalJobs.toString(),
      change: metrics.activeJobs > 0 ? jobActivityChange : undefined,
      changeLabel:
        metrics.activeJobs > 0
          ? `${metrics.activeJobs} active`
          : "no active jobs",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      change: metrics.totalRevenue > 0 ? undefined : 0,
      changeLabel:
        metrics.totalJobs > 0
          ? `${metrics.totalJobs} job${metrics.totalJobs !== 1 ? "s" : ""}`
          : "no jobs yet",
    },
    {
      label: "Last Service",
      value: formatDate(metrics.lastServiceDate),
      change: undefined,
      changeLabel: metrics.lastServiceDate ? "completed" : "no history",
    },
    {
      label: "Next Scheduled",
      value: formatNextScheduled(metrics.nextScheduledDate),
      change: metrics.nextScheduledDate ? 100 : undefined,
      changeLabel: metrics.equipmentCount
        ? `${metrics.equipmentCount} equipment`
        : "no equipment",
    },
  ];

  return <EntityStatsBar compact={compact} stats={propertyStats} />;
}
