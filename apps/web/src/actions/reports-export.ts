"use server";

import { z } from "zod";
import { getActiveCompanyId, getCurrentUserId } from "@/lib/auth/company-context";
import {
	getCustomerAnalytics,
	getFinancialReport,
	getJobPerformanceReport,
	getRevenueReport,
	getTeamLeaderboard,
} from "@/lib/queries/analytics";
import { sendEmail } from "@/lib/email/email-sender";
import { createClient } from "@/lib/supabase/server";

type ReportType = "revenue" | "jobs" | "financial" | "team" | "customers";

/**
 * Generate CSV data for a report
 */
export async function exportReportToCSV(
	reportType: ReportType,
	days: number = 90,
): Promise<{
	success: boolean;
	data?: string;
	filename?: string;
	error?: string;
}> {
	try {
		const companyId = await getActiveCompanyId();
		if (!companyId) {
			return { success: false, error: "No active company found" };
		}

		let csvData: string;
		let filename: string;

		switch (reportType) {
			case "revenue": {
				const data = await getRevenueReport(companyId, days);
				csvData = generateRevenueCSV(data);
				filename = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`;
				break;
			}
			case "jobs": {
				const data = await getJobPerformanceReport(companyId, days);
				csvData = generateJobsCSV(data);
				filename = `jobs-report-${new Date().toISOString().split("T")[0]}.csv`;
				break;
			}
			case "financial": {
				const data = await getFinancialReport(companyId, days);
				csvData = generateFinancialCSV(data);
				filename = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
				break;
			}
			case "team": {
				const data = await getTeamLeaderboard(companyId, days);
				csvData = generateTeamCSV(data);
				filename = `team-report-${new Date().toISOString().split("T")[0]}.csv`;
				break;
			}
			case "customers": {
				const data = await getCustomerAnalytics(companyId, days);
				csvData = generateCustomersCSV(data);
				filename = `customers-report-${new Date().toISOString().split("T")[0]}.csv`;
				break;
			}
			default:
				return { success: false, error: "Invalid report type" };
		}

		return { success: true, data: csvData, filename };
	} catch (error) {
		console.error("Error exporting report:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to export report",
		};
	}
}

// Helper to escape CSV values
function escapeCSV(value: unknown): string {
	const str = String(value ?? "");
	if (str.includes(",") || str.includes('"') || str.includes("\n")) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

// Helper to format currency
function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

// Helper to format percent
function formatPercent(value: number): string {
	return `${value.toFixed(1)}%`;
}

// Generate Revenue Report CSV
function generateRevenueCSV(
	data: Awaited<ReturnType<typeof getRevenueReport>>,
): string {
	const lines: string[] = [];

	// Summary section
	lines.push("REVENUE REPORT SUMMARY");
	lines.push("Metric,Value");
	lines.push(
		`Total Revenue,${escapeCSV(formatCurrency(data.summary.totalRevenue))}`,
	);
	lines.push(
		`Previous Period Revenue,${escapeCSV(formatCurrency(data.summary.previousPeriodRevenue))}`,
	);
	lines.push(
		`Growth %,${escapeCSV(formatPercent(data.summary.growthPercent))}`,
	);
	lines.push(
		`Average Ticket,${escapeCSV(formatCurrency(data.summary.averageTicket))}`,
	);
	lines.push(`Total Jobs,${data.summary.totalJobs}`);
	lines.push(`Total Payments,${data.summary.totalPayments}`);
	lines.push("");

	// Monthly breakdown
	lines.push("REVENUE BY MONTH");
	lines.push("Month,Revenue,Job Count,Avg Ticket");
	for (const month of data.byMonth) {
		lines.push(
			`${escapeCSV(month.month)},${escapeCSV(formatCurrency(month.revenue))},${month.jobCount},${escapeCSV(formatCurrency(month.avgTicket))}`,
		);
	}
	lines.push("");

	// By job type
	lines.push("REVENUE BY JOB TYPE");
	lines.push("Job Type,Revenue,Percentage,Count");
	for (const type of data.byJobType) {
		lines.push(
			`${escapeCSV(type.jobType)},${escapeCSV(formatCurrency(type.revenue))},${escapeCSV(formatPercent(type.percentage))},${type.count}`,
		);
	}
	lines.push("");

	// Top customers
	lines.push("TOP CUSTOMERS");
	lines.push("Name,Revenue,Job Count");
	for (const customer of data.topCustomers) {
		lines.push(
			`${escapeCSV(customer.name)},${escapeCSV(formatCurrency(customer.revenue))},${customer.jobCount}`,
		);
	}

	return lines.join("\n");
}

// Generate Jobs Report CSV
function generateJobsCSV(
	data: Awaited<ReturnType<typeof getJobPerformanceReport>>,
): string {
	const lines: string[] = [];

	// Summary
	lines.push("JOBS PERFORMANCE REPORT SUMMARY");
	lines.push("Metric,Value");
	lines.push(`Total Jobs,${data.summary.totalJobs}`);
	lines.push(`Completed Jobs,${data.summary.completedJobs}`);
	lines.push(
		`Completion Rate,${escapeCSV(formatPercent(data.summary.completionRate))}`,
	);
	lines.push(
		`First Time Fix Rate,${escapeCSV(formatPercent(data.summary.firstTimeFixRate))}`,
	);
	lines.push(
		`Callback Rate,${escapeCSV(formatPercent(data.summary.callbackRate))}`,
	);
	lines.push(
		`Average Duration (mins),${data.summary.averageDuration.toFixed(0)}`,
	);
	lines.push("");

	// By status
	lines.push("JOBS BY STATUS");
	lines.push("Status,Count,Percentage");
	for (const status of data.byStatus) {
		lines.push(
			`${escapeCSV(status.status)},${status.count},${escapeCSV(formatPercent(status.percentage))}`,
		);
	}
	lines.push("");

	// By technician
	lines.push("JOBS BY TECHNICIAN");
	lines.push(
		"Technician,Jobs Completed,Avg Duration (mins),First Time Fix Rate",
	);
	for (const tech of data.byTechnician) {
		lines.push(
			`${escapeCSV(tech.name)},${tech.jobsCompleted},${tech.avgDuration.toFixed(0)},${escapeCSV(formatPercent(tech.firstTimeFixRate))}`,
		);
	}
	lines.push("");

	// By job type
	lines.push("JOBS BY TYPE");
	lines.push("Job Type,Count,Avg Revenue,Completion Rate");
	for (const type of data.byJobType) {
		lines.push(
			`${escapeCSV(type.jobType)},${type.count},${escapeCSV(formatCurrency(type.avgRevenue))},${escapeCSV(formatPercent(type.completionRate))}`,
		);
	}
	lines.push("");

	// Weekly trends
	lines.push("WEEKLY TRENDS");
	lines.push("Week,Completed,Scheduled,Cancelled");
	for (const week of data.trendsWeekly) {
		lines.push(
			`${escapeCSV(week.week)},${week.completed},${week.scheduled},${week.cancelled}`,
		);
	}

	return lines.join("\n");
}

// Generate Financial Report CSV
function generateFinancialCSV(
	data: Awaited<ReturnType<typeof getFinancialReport>>,
): string {
	const lines: string[] = [];

	// Summary
	lines.push("FINANCIAL REPORT SUMMARY");
	lines.push("Metric,Value");
	lines.push(
		`Total Revenue,${escapeCSV(formatCurrency(data.summary.totalRevenue))}`,
	);
	lines.push(`Total Cost,${escapeCSV(formatCurrency(data.summary.totalCost))}`);
	lines.push(
		`Gross Profit,${escapeCSV(formatCurrency(data.summary.grossProfit))}`,
	);
	lines.push(
		`Gross Margin,${escapeCSV(formatPercent(data.summary.grossMargin))}`,
	);
	lines.push(
		`Outstanding AR,${escapeCSV(formatCurrency(data.summary.outstandingAR))}`,
	);
	lines.push(`Overdue AR,${escapeCSV(formatCurrency(data.summary.overdueAR))}`);
	lines.push("");

	// AR Aging
	lines.push("ACCOUNTS RECEIVABLE AGING");
	lines.push("Aging Bucket,Count,Amount");
	lines.push(
		`Current,${data.arAging.current.count},${escapeCSV(formatCurrency(data.arAging.current.amount))}`,
	);
	lines.push(
		`1-30 Days,${data.arAging.days1_30.count},${escapeCSV(formatCurrency(data.arAging.days1_30.amount))}`,
	);
	lines.push(
		`31-60 Days,${data.arAging.days31_60.count},${escapeCSV(formatCurrency(data.arAging.days31_60.amount))}`,
	);
	lines.push(
		`61-90 Days,${data.arAging.days61_90.count},${escapeCSV(formatCurrency(data.arAging.days61_90.amount))}`,
	);
	lines.push(
		`Over 90 Days,${data.arAging.over90.count},${escapeCSV(formatCurrency(data.arAging.over90.amount))}`,
	);
	lines.push("");

	// Monthly P&L
	lines.push("MONTHLY PROFIT & LOSS");
	lines.push("Month,Revenue,Cost,Profit,Margin");
	for (const month of data.monthlyPL) {
		lines.push(
			`${escapeCSV(month.month)},${escapeCSV(formatCurrency(month.revenue))},${escapeCSV(formatCurrency(month.cost))},${escapeCSV(formatCurrency(month.profit))},${escapeCSV(formatPercent(month.margin))}`,
		);
	}
	lines.push("");

	// Cash Flow
	lines.push("CASH FLOW");
	lines.push("Month,Inflows,Outflows,Net");
	for (const month of data.cashFlow) {
		lines.push(
			`${escapeCSV(month.month)},${escapeCSV(formatCurrency(month.inflows))},${escapeCSV(formatCurrency(month.outflows))},${escapeCSV(formatCurrency(month.net))}`,
		);
	}

	return lines.join("\n");
}

// Generate Team Leaderboard CSV
function generateTeamCSV(
	data: Awaited<ReturnType<typeof getTeamLeaderboard>>,
): string {
	const lines: string[] = [];

	// Summary
	lines.push("TEAM LEADERBOARD REPORT");
	lines.push("Metric,Value");
	lines.push(`Avg Jobs per Tech,${data.teamAverages.jobsPerTech.toFixed(1)}`);
	lines.push(
		`Avg Revenue per Tech,${escapeCSV(formatCurrency(data.teamAverages.revenuePerTech))}`,
	);
	lines.push(`Team Avg Rating,${data.teamAverages.avgRating.toFixed(1)}`);
	lines.push(
		`Team First Time Fix Rate,${escapeCSV(formatPercent(data.teamAverages.firstTimeFixRate))}`,
	);
	lines.push("");

	// Top performer
	if (data.topPerformer) {
		lines.push("TOP PERFORMER");
		lines.push(`Name,${escapeCSV(data.topPerformer.name)}`);
		lines.push(`Highlight,${escapeCSV(data.topPerformer.highlight)}`);
		lines.push("");
	}

	// All technicians
	lines.push("TECHNICIAN RANKINGS");
	lines.push(
		"Rank,Name,Jobs Completed,Revenue,Avg Job Duration (mins),First Time Fix Rate,Rating",
	);
	for (const tech of data.technicians) {
		lines.push(
			`${tech.rank},${escapeCSV(tech.name)},${tech.jobsCompleted},${escapeCSV(formatCurrency(tech.revenue))},${tech.avgJobDuration.toFixed(0)},${escapeCSV(formatPercent(tech.firstTimeFixRate))},${tech.avgRating.toFixed(1)}`,
		);
	}

	return lines.join("\n");
}

// Generate Customer Analytics CSV
function generateCustomersCSV(
	data: Awaited<ReturnType<typeof getCustomerAnalytics>>,
): string {
	const lines: string[] = [];

	// Summary
	lines.push("CUSTOMER ANALYTICS REPORT");
	lines.push("Metric,Value");
	lines.push(`Total Customers,${data.summary.totalCustomers}`);
	lines.push(`New Customers (30 days),${data.summary.newCustomers}`);
	lines.push(`Repeat Customers,${data.summary.repeatCustomers}`);
	lines.push(`Churned Customers,${data.summary.churnedCustomers}`);
	lines.push(
		`Retention Rate,${escapeCSV(formatPercent(data.summary.retentionRate))}`,
	);
	lines.push(
		`Avg Lifetime Value,${escapeCSV(formatCurrency(data.summary.avgLifetimeValue))}`,
	);
	lines.push("");

	// Churn risk distribution
	lines.push("CHURN RISK DISTRIBUTION");
	lines.push("Risk Level,Count");
	lines.push(`Low Risk,${data.riskDistribution.low}`);
	lines.push(`Medium Risk,${data.riskDistribution.medium}`);
	lines.push(`High Risk,${data.riskDistribution.high}`);
	lines.push("");

	// By segment
	lines.push("REVENUE BY SEGMENT");
	lines.push("Segment,Count,Revenue,Avg Ticket");
	for (const segment of data.bySegment) {
		lines.push(
			`${escapeCSV(segment.segment)},${segment.count},${escapeCSV(formatCurrency(segment.revenue))},${escapeCSV(formatCurrency(segment.avgTicket))}`,
		);
	}
	lines.push("");

	// Top customers
	lines.push("TOP CUSTOMERS");
	lines.push("Name,Total Revenue,Job Count,Lifetime Value,Last Service Date");
	for (const customer of data.topCustomers) {
		lines.push(
			`${escapeCSV(customer.name)},${escapeCSV(formatCurrency(customer.totalRevenue))},${customer.jobCount},${escapeCSV(formatCurrency(customer.lifetimeValue))},${escapeCSV(customer.lastServiceDate || "Never")}`,
		);
	}
	lines.push("");

	// Acquisition trends
	lines.push("ACQUISITION TRENDS");
	lines.push("Month,New Customers,Churned,Net");
	for (const month of data.acquisitionTrend) {
		lines.push(
			`${escapeCSV(month.month)},${month.newCustomers},${month.churned},${month.net}`,
		);
	}

	return lines.join("\n");
}

// Email report schema
const emailReportSchema = z.object({
	reportType: z.enum(["revenue", "jobs", "financial", "team", "customers"]),
	reportTitle: z.string(),
	emailTo: z.string().email("Invalid email address"),
	format: z.enum(["csv", "excel", "pdf"]),
	days: z.number().optional().default(90),
});

export type EmailReportInput = z.infer<typeof emailReportSchema>;

/**
 * Send a report via email
 */
export async function emailReport(
	input: EmailReportInput
): Promise<{ success: boolean; error?: string }> {
	try {
		const companyId = await getActiveCompanyId();
		const userId = await getCurrentUserId();

		if (!companyId || !userId) {
			return { success: false, error: "Authentication required" };
		}

		const validated = emailReportSchema.parse(input);

		// Generate the report data
		const exportResult = await exportReportToCSV(validated.reportType, validated.days);

		if (!exportResult.success || !exportResult.data) {
			return { success: false, error: exportResult.error || "Failed to generate report" };
		}

		// Get user and company info for the email
		const supabase = await createClient();
		const { data: profile } = await supabase
			.from("profiles")
			.select("full_name, email")
			.eq("id", userId)
			.single();

		const { data: company } = await supabase
			.from("companies")
			.select("name")
			.eq("id", companyId)
			.single();

		const senderName = profile?.full_name || "Stratos User";
		const companyName = company?.name || "Your Company";

		// Create email content
		const emailSubject = `${validated.reportTitle} - ${companyName}`;
		const emailBody = `
Hello,

Please find the attached ${validated.reportTitle} report from ${companyName}.

Report Details:
- Type: ${validated.reportTitle}
- Period: Last ${validated.days} days
- Generated: ${new Date().toLocaleDateString()}
- Generated by: ${senderName}

Best regards,
${companyName} via Stratos
		`.trim();

		// Send email with attachment
		const emailResult = await sendEmail({
			to: validated.emailTo,
			subject: emailSubject,
			text: emailBody,
			attachments: [
				{
					filename: exportResult.filename || `${validated.reportType}-report.csv`,
					content: exportResult.data,
					contentType: "text/csv",
				},
			],
		});

		if (!emailResult.success) {
			return { success: false, error: emailResult.error || "Failed to send email" };
		}

		// Log the export for auditing
		await supabase.from("audit_logs").insert({
			company_id: companyId,
			user_id: userId,
			action: "report_emailed",
			resource_type: "report",
			resource_id: validated.reportType,
			details: {
				report_type: validated.reportType,
				report_title: validated.reportTitle,
				sent_to: validated.emailTo,
				format: validated.format,
				days: validated.days,
			},
		});

		return { success: true };
	} catch (error) {
		console.error("Error emailing report:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Invalid input data" };
		}
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to email report",
		};
	}
}
