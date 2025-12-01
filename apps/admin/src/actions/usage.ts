"use server";

/**
 * Usage Analytics Actions
 *
 * Server actions for tracking platform usage metrics.
 */

import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";

export interface UsageMetrics {
	api_usage: {
		total_calls: number;
		by_company: Array<{
			company_id: string;
			company_name: string;
			calls: number;
		}>;
		peak_hours: Array<{
			hour: number;
			calls: number;
		}>;
	};
	feature_usage: Array<{
		feature: string;
		companies_count: number;
		usage_count: number;
		avg_per_company: number;
	}>;
	resource_consumption: {
		storage_gb: number;
		bandwidth_gb: number;
		api_calls: number;
	};
	cost_analysis: Array<{
		service: string;
		cost_usd: number;
		usage: number;
		unit: string;
	}>;
}

/**
 * Get usage metrics
 */
export async function getUsageMetrics() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	try {
		const webDb = createWebClient();

		// Get API usage by company (simplified)
		const { data: companies } = await webDb
			.from("companies")
			.select("id, name")
			.limit(100);

		// Get feature usage stats
		const [jobsData, invoicesData, paymentsData, customersData] = await Promise.all([
			webDb.from("jobs").select("company_id").limit(1000),
			webDb.from("invoices").select("company_id").limit(1000),
			webDb.from("payments").select("company_id").limit(1000),
			webDb.from("customers").select("company_id").limit(1000),
		]);

		// Count usage per company
		const usageByCompany: Record<string, { name: string; calls: number }> = {};
		for (const company of companies || []) {
			usageByCompany[company.id] = {
				name: company.name,
				calls: 0,
			};
		}

		// Estimate API calls based on data volume (simplified)
		const jobs = jobsData.data || [];
		const invoices = invoicesData.data || [];
		const payments = paymentsData.data || [];
		const customers = customersData.data || [];

		for (const job of jobs) {
			if (usageByCompany[job.company_id]) {
				usageByCompany[job.company_id].calls += 10; // Estimate
			}
		}
		for (const invoice of invoices) {
			if (usageByCompany[invoice.company_id]) {
				usageByCompany[invoice.company_id].calls += 5;
			}
		}
		for (const payment of payments) {
			if (usageByCompany[payment.company_id]) {
				usageByCompany[payment.company_id].calls += 3;
			}
		}

		const apiUsageByCompany = Object.entries(usageByCompany)
			.map(([company_id, data]) => ({
				company_id,
				company_name: data.name,
				calls: data.calls,
			}))
			.sort((a, b) => b.calls - a.calls)
			.slice(0, 10);

		// Peak hours (simplified - would need actual timestamp data)
		const peakHours: Array<{ hour: number; calls: number }> = [];
		for (let hour = 0; hour < 24; hour++) {
			// Simulated peak at 9am, 1pm, 3pm
			const baseCalls = hour >= 9 && hour <= 17 ? 1000 : 200;
			const peakMultiplier = hour === 9 || hour === 13 || hour === 15 ? 2 : 1;
			peakHours.push({
				hour,
				calls: baseCalls * peakMultiplier,
			});
		}

		// Feature usage
		const jobCompanies = new Set(jobs.map((j) => j.company_id));
		const invoiceCompanies = new Set(invoices.map((i) => i.company_id));
		const paymentCompanies = new Set(payments.map((p) => p.company_id));
		const customerCompanies = new Set(customers.map((c) => c.company_id));

		const featureUsage = [
			{
				feature: "Jobs",
				companies_count: jobCompanies.size,
				usage_count: jobs.length,
				avg_per_company: jobCompanies.size > 0 ? jobs.length / jobCompanies.size : 0,
			},
			{
				feature: "Invoices",
				companies_count: invoiceCompanies.size,
				usage_count: invoices.length,
				avg_per_company: invoiceCompanies.size > 0 ? invoices.length / invoiceCompanies.size : 0,
			},
			{
				feature: "Payments",
				companies_count: paymentCompanies.size,
				usage_count: payments.length,
				avg_per_company: paymentCompanies.size > 0 ? payments.length / paymentCompanies.size : 0,
			},
			{
				feature: "Customers",
				companies_count: customerCompanies.size,
				usage_count: customers.length,
				avg_per_company: customerCompanies.size > 0 ? customers.length / customerCompanies.size : 0,
			},
		];

		const totalCalls = apiUsageByCompany.reduce((sum, c) => sum + c.calls, 0);

		return {
			data: {
				api_usage: {
					total_calls: totalCalls,
					by_company: apiUsageByCompany,
					peak_hours: peakHours,
				},
				feature_usage: featureUsage,
				resource_consumption: {
					storage_gb: 0, // Would need actual storage data
					bandwidth_gb: 0, // Would need actual bandwidth data
					api_calls: totalCalls,
				},
				cost_analysis: [
					{
						service: "API Calls",
						cost_usd: totalCalls * 0.0001, // Estimated
						usage: totalCalls,
						unit: "calls",
					},
					{
						service: "Storage",
						cost_usd: 0,
						usage: 0,
						unit: "GB",
					},
				],
			},
		};
	} catch (error) {
		console.error("Failed to get usage metrics:", error);
		return { error: error instanceof Error ? error.message : "Failed to get usage metrics" };
	}
}



