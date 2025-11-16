"use client";

/**
 * StatusPipeline - Generic Status Statistics Component
 *
 * Reusable component for displaying status statistics in a ticker-style format.
 * Replaces individual status pipeline components (JobStatusPipeline, InvoiceStatusPipeline, etc.)
 *
 * Features:
 * - Stock ticker design with colored trend indicators
 * - Green for positive changes, red for negative
 * - Full-width seamless design
 * - Accepts StatCard[] array for flexible configuration
 */

import { type StatCard, StatsCards } from "@/components/ui/stats-cards";

type StatusPipelineProps = {
	stats: StatCard[];
	variant?: "ticker" | "chart";
	compact?: boolean;
};

export function StatusPipeline({ stats, variant = "ticker", compact = false }: StatusPipelineProps) {
	return <StatsCards compact={compact} stats={stats} variant={variant} />;
}
