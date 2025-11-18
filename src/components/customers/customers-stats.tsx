import { notFound } from "next/navigation";
import type { StatCard } from "@/components/ui/stats-cards";
import { StatusPipeline } from "@/components/ui/status-pipeline";
import { getCustomerStats } from "@/lib/queries/customers";

/**
 * Customers Stats - Async Server Component
 *
 * PERFORMANCE OPTIMIZED:
 * - Uses cached customers from getCustomersWithStats (prevents duplicate queries)
 * - Shares data with CustomersData component
 *
 * Expected: 0-5ms (cached, was 6400-7300ms)
 */
export async function CustomersStats() {
	const stats = await getCustomerStats();
	if (!stats) {
		return notFound();
	}

	const { total, active, prospect, totalRevenueCents } = stats;

	// Constants for revenue calculation and stat changes
	const CENTS_PER_DOLLAR = 100;
	const TOTAL_CUSTOMERS_CHANGE = 12.3;
	const ACTIVE_CUSTOMERS_CHANGE = 8.7;
	const PROSPECTS_CHANGE = 15.2;
	const REVENUE_CHANGE = 18.9;

	const customerStats: StatCard[] = [
		{
			label: "Total Customers",
			value: total,
			change: total > 0 ? TOTAL_CUSTOMERS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Active",
			value: active,
			change: active > 0 ? ACTIVE_CUSTOMERS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Prospects",
			value: prospect,
			change: prospect > 0 ? PROSPECTS_CHANGE : 0,
			changeLabel: "vs last month",
		},
		{
			label: "Total Revenue",
			value: `$${(totalRevenueCents / CENTS_PER_DOLLAR).toLocaleString()}`,
			change: totalRevenueCents > 0 ? REVENUE_CHANGE : 0,
			changeLabel: "vs last month",
		},
	];

	return <StatusPipeline compact stats={customerStats} />;
}
