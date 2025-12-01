"use server";

/**
 * Growth Analytics Actions
 *
 * Server actions for tracking platform growth metrics.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getAdminSession } from "@/lib/auth/session";

export interface GrowthMetrics {
	signups: {
		today: number;
		this_week: number;
		this_month: number;
		trend: "up" | "down" | "stable";
		change_percent: number;
	};
	activations: {
		total: number;
		rate: number;
		funnel: {
			signed_up: number;
			completed_onboarding: number;
			first_job_created: number;
			first_invoice_sent: number;
			active_user: number;
		};
	};
	feature_adoption: Array<{
		feature: string;
		companies_using: number;
		adoption_rate: number;
	}>;
	churn: {
		this_month: number;
		churn_rate: number;
		reasons: Array<{
			reason: string;
			count: number;
		}>;
	};
	retention: {
		cohorts: Array<{
			month: string;
			signups: number;
			retention_rate: number;
		}>;
	};
}

/**
 * Get growth metrics
 */
export async function getGrowthMetrics() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const thisWeek = new Date(today);
		thisWeek.setDate(thisWeek.getDate() - 7);
		const thisMonth = new Date(today);
		thisMonth.setMonth(thisMonth.getMonth() - 1);
		const lastMonth = new Date(thisMonth);
		lastMonth.setMonth(lastMonth.getMonth() - 1);

		// Get signups
		const { data: allCompanies } = await webDb
			.from("companies")
			.select("id, created_at, status")
			.order("created_at", { ascending: false });

		const signupsToday = (allCompanies || []).filter(
			(c) => new Date(c.created_at) >= today,
		).length;
		const signupsThisWeek = (allCompanies || []).filter(
			(c) => new Date(c.created_at) >= thisWeek,
		).length;
		const signupsThisMonth = (allCompanies || []).filter(
			(c) => new Date(c.created_at) >= thisMonth,
		).length;
		const signupsLastMonth = (allCompanies || []).filter(
			(c) => new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth,
		).length;

		const signupChangePercent =
			signupsLastMonth > 0
				? ((signupsThisMonth - signupsLastMonth) / signupsLastMonth) * 100
				: 0;

		// Get activation funnel
		// Simplified - would need actual onboarding tracking
		const totalCompanies = (allCompanies || []).length;
		const activeCompanies = (allCompanies || []).filter((c) => c.status === "active").length;

		// Feature adoption (simplified)
		const { data: companiesWithJobs } = await webDb
			.from("jobs")
			.select("company_id")
			.limit(1000);
		const { data: companiesWithInvoices } = await webDb
			.from("invoices")
			.select("company_id")
			.limit(1000);
		const { data: companiesWithPayments } = await webDb
			.from("payments")
			.select("company_id")
			.limit(1000);

		const uniqueJobCompanies = new Set((companiesWithJobs || []).map((j) => j.company_id));
		const uniqueInvoiceCompanies = new Set((companiesWithInvoices || []).map((i) => i.company_id));
		const uniquePaymentCompanies = new Set((companiesWithPayments || []).map((p) => p.company_id));

		const featureAdoption = [
			{
				feature: "Jobs",
				companies_using: uniqueJobCompanies.size,
				adoption_rate: totalCompanies > 0 ? (uniqueJobCompanies.size / totalCompanies) * 100 : 0,
			},
			{
				feature: "Invoices",
				companies_using: uniqueInvoiceCompanies.size,
				adoption_rate: totalCompanies > 0 ? (uniqueInvoiceCompanies.size / totalCompanies) * 100 : 0,
			},
			{
				feature: "Payments",
				companies_using: uniquePaymentCompanies.size,
				adoption_rate: totalCompanies > 0 ? (uniquePaymentCompanies.size / totalCompanies) * 100 : 0,
			},
		];

		// Churn (simplified - would need actual churn tracking)
		const churnedThisMonth = (allCompanies || []).filter(
			(c) => c.status === "churned" && new Date(c.updated_at || c.created_at) >= thisMonth,
		).length;

		// Retention cohorts (simplified)
		const cohorts: Array<{ month: string; signups: number; retention_rate: number }> = [];
		for (let i = 5; i >= 0; i--) {
			const cohortMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const cohortStart = new Date(cohortMonth.getFullYear(), cohortMonth.getMonth(), 1);
			const cohortEnd = new Date(cohortMonth.getFullYear(), cohortMonth.getMonth() + 1, 0);

			const cohortSignups = (allCompanies || []).filter(
				(c) =>
					new Date(c.created_at) >= cohortStart && new Date(c.created_at) <= cohortEnd,
			).length;

			const cohortActive = (allCompanies || []).filter(
				(c) =>
					new Date(c.created_at) >= cohortStart &&
					new Date(c.created_at) <= cohortEnd &&
					c.status === "active",
			).length;

			const retentionRate = cohortSignups > 0 ? (cohortActive / cohortSignups) * 100 : 0;

			cohorts.push({
				month: cohortMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
				signups: cohortSignups,
				retention_rate: Math.round(retentionRate * 100) / 100,
			});
		}

		return {
			data: {
				signups: {
					today: signupsToday,
					this_week: signupsThisWeek,
					this_month: signupsThisMonth,
					trend: signupChangePercent > 0 ? ("up" as const) : signupChangePercent < 0 ? ("down" as const) : ("stable" as const),
					change_percent: Math.round(signupChangePercent * 100) / 100,
				},
				activations: {
					total: activeCompanies,
					rate: totalCompanies > 0 ? (activeCompanies / totalCompanies) * 100 : 0,
					funnel: {
						signed_up: totalCompanies,
						completed_onboarding: Math.floor(totalCompanies * 0.8), // Estimated
						first_job_created: uniqueJobCompanies.size,
						first_invoice_sent: uniqueInvoiceCompanies.size,
						active_user: activeCompanies,
					},
				},
				feature_adoption: featureAdoption,
				churn: {
					this_month: churnedThisMonth,
					churn_rate: totalCompanies > 0 ? (churnedThisMonth / totalCompanies) * 100 : 0,
					reasons: [], // Would need actual churn reason tracking
				},
				retention: {
					cohorts,
				},
			},
		};
	} catch (error) {
		console.error("Failed to get growth metrics:", error);
		return { error: error instanceof Error ? error.message : "Failed to get growth metrics" };
	}
}



