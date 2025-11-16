/**
 * Purchase Order Stats Bar
 *
 * Displays key purchase order metrics:
 * - Total Amount (order total)
 * - Line Items (count of items)
 * - Status (pending, ordered, received)
 * - Expected Delivery (days until delivery)
 *
 * Features:
 * - Compact mode support (when scrolled)
 * - Ticker variant for consistency
 */

"use client";

import { EntityStatsBar } from "@/components/ui/entity-stats-bar";
import type { StatCard } from "@/components/ui/stats-cards";

export type PurchaseOrderMetrics = {
	totalAmount: number;
	lineItemCount: number;
	status: string;
	daysUntilDelivery?: number;
};

export type PurchaseOrderStatsBarProps = {
	entityId: string;
	metrics: PurchaseOrderMetrics;
	compact?: boolean;
};

export function PurchaseOrderStatsBar({
	entityId,
	metrics,
	compact = false,
}: PurchaseOrderStatsBarProps) {
	const stats: StatCard[] = [
		{
			label: "Total Amount",
			value: new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
				minimumFractionDigits: 2,
			}).format(metrics.totalAmount),
			change: undefined,
		},
		{
			label: "Line Items",
			value: metrics.lineItemCount,
			change: undefined,
		},
		{
			label: "Status",
			value: metrics.status,
			change: undefined,
		},
		{
			label: "Delivery",
			value:
				metrics.daysUntilDelivery !== undefined
					? metrics.daysUntilDelivery > 0
						? `${metrics.daysUntilDelivery} days`
						: "Today"
					: "Not set",
			change: undefined,
		},
	];

	return <EntityStatsBar compact={compact} stats={stats} />;
}
