"use server";

/**
 * Revenue Analytics Actions
 *
 * Server actions for tracking platform revenue metrics.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface RevenueMetrics {
	mrr: number;
	arr: number;
	revenue_growth_percent: number;
	total_revenue: number;
	by_plan: Array<{
		plan: string;
		revenue: number;
		companies: number;
	}>;
	by_month: Array<{
		month: string;
		revenue: number;
		new_revenue: number;
		churn_revenue: number;
	}>;
}

/**
 * Get revenue metrics
 */
export async function getRevenueMetrics() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Get companies with subscription data
		const { data: companies } = await webDb
			.from("companies")
			.select("id, name, subscription_tier, stripe_subscription_status, created_at, updated_at")
			.not("stripe_subscription_id", "is", null)
			.limit(1000);

		if (!companies || companies.length === 0) {
			return {
				data: {
					mrr: 0,
					arr: 0,
					revenue_growth_percent: 0,
					total_revenue: 0,
					by_plan: [],
					by_month: [],
				},
			};
		}

		// Calculate MRR (simplified - would need actual subscription amounts from Stripe)
		const planPrices: Record<string, number> = {
			trial: 0,
			starter: 99,
			pro: 299,
			enterprise: 999,
		};

		const activeCompanies = companies.filter(
			(c) => c.stripe_subscription_status === "active" || c.stripe_subscription_status === "trialing",
		);

		const mrr = activeCompanies.reduce((sum, c) => {
			const plan = c.subscription_tier || "trial";
			return sum + (planPrices[plan] || 0);
		}, 0);

		const arr = mrr * 12;
		const totalRevenue = mrr; // Simplified

		// Group by plan
		const planGroups: Record<string, { revenue: number; companies: number }> = {};
		for (const company of activeCompanies) {
			const plan = company.subscription_tier || "trial";
			if (!planGroups[plan]) {
				planGroups[plan] = { revenue: 0, companies: 0 };
			}
			planGroups[plan].revenue += planPrices[plan] || 0;
			planGroups[plan].companies += 1;
		}

		const byPlan = Object.entries(planGroups).map(([plan, data]) => ({
			plan,
			revenue: data.revenue,
			companies: data.companies,
		}));

		// Revenue by month (last 12 months)
		const now = new Date();
		const byMonth: Array<{ month: string; revenue: number; new_revenue: number; churn_revenue: number }> = [];
		
		for (let i = 11; i >= 0; i--) {
			const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
			const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

			const monthCompanies = activeCompanies.filter(
				(c) =>
					new Date(c.created_at) <= monthEnd &&
					(c.stripe_subscription_status === "active" || c.stripe_subscription_status === "trialing"),
			);

			const monthRevenue = monthCompanies.reduce((sum, c) => {
				const plan = c.subscription_tier || "trial";
				return sum + (planPrices[plan] || 0);
			}, 0);

			const newCompanies = activeCompanies.filter(
				(c) =>
					new Date(c.created_at) >= monthStart &&
					new Date(c.created_at) <= monthEnd,
			);

			const newRevenue = newCompanies.reduce((sum, c) => {
				const plan = c.subscription_tier || "trial";
				return sum + (planPrices[plan] || 0);
			}, 0);

			byMonth.push({
				month: monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
				revenue: monthRevenue,
				new_revenue: newRevenue,
				churn_revenue: 0, // Would need churn tracking
			});
		}

		// Calculate growth (compare last 2 months)
		const revenueGrowth =
			byMonth.length >= 2 && byMonth[byMonth.length - 2].revenue > 0
				? ((byMonth[byMonth.length - 1].revenue - byMonth[byMonth.length - 2].revenue) /
						byMonth[byMonth.length - 2].revenue) *
					100
				: 0;

		return {
			data: {
				mrr,
				arr,
				revenue_growth_percent: Math.round(revenueGrowth * 100) / 100,
				total_revenue,
				by_plan: byPlan,
				by_month: byMonth,
			},
		};
	} catch (error) {
		console.error("Failed to get revenue metrics:", error);
		return { error: error instanceof Error ? error.message : "Failed to get revenue metrics" };
	}
}



