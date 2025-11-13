/**
 * EntityStatsBar - Generic Stats Bar Component
 *
 * Reusable component for displaying entity statistics in a ticker-style format.
 * Replaces individual stats bar components (JobStatsBar, CustomerStatsBar, etc.)
 *
 * Features:
 * - Stock ticker design with colored trend indicators
 * - Supports compact mode for sticky scrolling
 * - Accepts StatCard[] array for flexible configuration
 */

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

interface EntityStatsBarProps {
  stats: StatCard[];
  compact?: boolean;
}

export function EntityStatsBar({
  stats,
  compact = false,
}: EntityStatsBarProps) {
  return <StatsCards compact={compact} stats={stats} variant="ticker" />;
}
