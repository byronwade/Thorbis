/**
 * AI Proactive Analyzer Service - Background analysis and insights generation
 * Identifies patterns, anomalies, and opportunities proactively
 */

import crypto from "crypto";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export type InsightType =
	| "anomaly"
	| "trend"
	| "opportunity"
	| "risk"
	| "recommendation"
	| "reminder"
	| "milestone"
	| "alert";

export type InsightPriority = "low" | "medium" | "high" | "critical";

export type InsightStatus =
	| "new"
	| "acknowledged"
	| "in_progress"
	| "resolved"
	| "dismissed"
	| "expired";

export type InsightCategory =
	| "revenue"
	| "customer"
	| "operations"
	| "inventory"
	| "scheduling"
	| "performance"
	| "compliance"
	| "security";

export interface Insight {
	type: InsightType;
	priority: InsightPriority;
	category: InsightCategory;
	title: string;
	description: string;
	entityType?: string;
	entityId?: string;
	relatedEntities?: Array<{ type: string; id: string }>;
	dataPoints?: Record<string, unknown>;
	suggestedActions?: string[];
	expiresAt?: Date;
	metadata?: Record<string, unknown>;
}

export interface InsightResult {
	id: string;
	type: string;
	priority: string;
	category: string;
	title: string;
	description: string;
	status: string;
	createdAt: string;
	acknowledgedAt?: string;
}

/**
 * Create a new insight
 */
async function createInsight(
	companyId: string,
	insight: Insight,
	sourceAnalysis?: string,
): Promise<string> {
	const supabase = createServiceSupabaseClient();
	const insightId = crypto.randomUUID();

	// Calculate content hash to prevent duplicates
	const contentHash = crypto
		.createHash("sha256")
		.update(
			JSON.stringify({
				type: insight.type,
				title: insight.title,
				entityId: insight.entityId,
			}),
		)
		.digest("hex");

	// Check for recent duplicate
	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
	const { data: existing } = await supabase
		.from("ai_insights")
		.select("id")
		.eq("company_id", companyId)
		.eq("content_hash", contentHash)
		.gte("created_at", oneHourAgo.toISOString())
		.maybeSingle();

	if (existing) {
		return existing.id; // Return existing insight ID to avoid duplicates
	}

	const { error } = await supabase.from("ai_insights").insert({
		id: insightId,
		company_id: companyId,
		insight_type: insight.type,
		priority: insight.priority,
		category: insight.category,
		title: insight.title,
		description: insight.description,
		entity_type: insight.entityType,
		entity_id: insight.entityId,
		related_entities: insight.relatedEntities || [],
		data_points: insight.dataPoints || {},
		suggested_actions: insight.suggestedActions || [],
		source_analysis: sourceAnalysis,
		content_hash: contentHash,
		status: "new",
		expires_at: insight.expiresAt?.toISOString(),
		metadata: insight.metadata || {},
		created_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Failed to create insight:", error);
		throw error;
	}

	return insightId;
}

/**
 * Get active insights for a company
 */
async function getActiveInsights(
	companyId: string,
	options?: {
		priority?: InsightPriority[];
		category?: InsightCategory[];
		type?: InsightType[];
		limit?: number;
		entityType?: string;
		entityId?: string;
	},
): Promise<InsightResult[]> {
	const supabase = createServiceSupabaseClient();
	const limit = options?.limit || 20;

	let query = supabase
		.from("ai_insights")
		.select("*")
		.eq("company_id", companyId)
		.in("status", ["new", "acknowledged", "in_progress"])
		.order("priority", { ascending: false })
		.order("created_at", { ascending: false })
		.limit(limit);

	if (options?.priority && options.priority.length > 0) {
		query = query.in("priority", options.priority);
	}

	if (options?.category && options.category.length > 0) {
		query = query.in("category", options.category);
	}

	if (options?.type && options.type.length > 0) {
		query = query.in("insight_type", options.type);
	}

	if (options?.entityType) {
		query = query.eq("entity_type", options.entityType);
	}

	if (options?.entityId) {
		query = query.eq("entity_id", options.entityId);
	}

	// Filter out expired insights
	query = query.or(
		`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`,
	);

	const { data, error } = await query;

	if (error) {
		console.error("Failed to get active insights:", error);
		return [];
	}

	return (data || []).map((i) => ({
		id: i.id,
		type: i.insight_type,
		priority: i.priority,
		category: i.category,
		title: i.title,
		description: i.description,
		status: i.status,
		createdAt: i.created_at as string,
		acknowledgedAt: i.acknowledged_at as string | undefined,
	}));
}

/**
 * Acknowledge an insight
 */
async function acknowledgeInsight(
	companyId: string,
	insightId: string,
	userId: string,
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_insights")
		.update({
			status: "acknowledged",
			acknowledged_by: userId,
			acknowledged_at: new Date().toISOString(),
		})
		.eq("id", insightId)
		.eq("company_id", companyId)
		.eq("status", "new");

	if (error) {
		console.error("Failed to acknowledge insight:", error);
		return false;
	}

	return true;
}

/**
 * Dismiss an insight
 */
async function dismissInsight(
	companyId: string,
	insightId: string,
	userId: string,
	reason?: string,
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_insights")
		.update({
			status: "dismissed",
			dismissed_by: userId,
			dismissed_at: new Date().toISOString(),
			dismissal_reason: reason,
		})
		.eq("id", insightId)
		.eq("company_id", companyId);

	if (error) {
		console.error("Failed to dismiss insight:", error);
		return false;
	}

	return true;
}

/**
 * Mark insight as resolved
 */
async function resolveInsight(
	companyId: string,
	insightId: string,
	userId: string,
	resolution?: string,
): Promise<boolean> {
	const supabase = createServiceSupabaseClient();

	const { error } = await supabase
		.from("ai_insights")
		.update({
			status: "resolved",
			resolved_by: userId,
			resolved_at: new Date().toISOString(),
			resolution_notes: resolution,
		})
		.eq("id", insightId)
		.eq("company_id", companyId);

	if (error) {
		console.error("Failed to resolve insight:", error);
		return false;
	}

	return true;
}

/**
 * Run revenue analysis to detect anomalies and opportunities
 */
async function analyzeRevenue(companyId: string): Promise<Insight[]> {
	const supabase = createServiceSupabaseClient();
	const insights: Insight[] = [];

	// Get revenue data for analysis
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

	// Get recent invoices
	const { data: recentInvoices } = await supabase
		.from("invoices")
		.select("total_amount, created_at, status")
		.eq("company_id", companyId)
		.gte("created_at", thirtyDaysAgo.toISOString());

	// Get previous period invoices for comparison
	const { data: previousInvoices } = await supabase
		.from("invoices")
		.select("total_amount")
		.eq("company_id", companyId)
		.gte("created_at", sixtyDaysAgo.toISOString())
		.lt("created_at", thirtyDaysAgo.toISOString());

	if (recentInvoices && previousInvoices) {
		const recentTotal = recentInvoices.reduce(
			(sum, i) => sum + ((i.total_amount as number) || 0),
			0,
		);
		const previousTotal = previousInvoices.reduce(
			(sum, i) => sum + ((i.total_amount as number) || 0),
			0,
		);

		if (previousTotal > 0) {
			const changePercent =
				((recentTotal - previousTotal) / previousTotal) * 100;

			if (changePercent < -20) {
				insights.push({
					type: "anomaly",
					priority: "high",
					category: "revenue",
					title: "Significant Revenue Decline Detected",
					description: `Revenue has decreased by ${Math.abs(changePercent).toFixed(1)}% compared to the previous 30-day period.`,
					dataPoints: {
						currentPeriodTotal: recentTotal,
						previousPeriodTotal: previousTotal,
						changePercent,
					},
					suggestedActions: [
						"Review recent job completions and invoicing",
						"Check for outstanding unpaid invoices",
						"Analyze customer acquisition and retention",
					],
				});
			} else if (changePercent > 30) {
				insights.push({
					type: "trend",
					priority: "medium",
					category: "revenue",
					title: "Strong Revenue Growth",
					description: `Revenue has increased by ${changePercent.toFixed(1)}% compared to the previous 30-day period.`,
					dataPoints: {
						currentPeriodTotal: recentTotal,
						previousPeriodTotal: previousTotal,
						changePercent,
					},
					suggestedActions: [
						"Consider expanding capacity to maintain growth",
						"Review top-performing services",
					],
				});
			}
		}

		// Check for overdue invoices
		const overdueInvoices = recentInvoices.filter(
			(i) => i.status === "overdue" || i.status === "unpaid",
		);
		if (overdueInvoices.length > 5) {
			const overdueTotal = overdueInvoices.reduce(
				(sum, i) => sum + ((i.total_amount as number) || 0),
				0,
			);
			insights.push({
				type: "risk",
				priority: "high",
				category: "revenue",
				title: "High Number of Overdue Invoices",
				description: `${overdueInvoices.length} invoices totaling $${overdueTotal.toFixed(2)} are overdue or unpaid.`,
				dataPoints: {
					overdueCount: overdueInvoices.length,
					overdueTotal,
				},
				suggestedActions: [
					"Send payment reminders to customers",
					"Review payment terms with frequent late payers",
					"Consider offering payment plans",
				],
			});
		}
	}

	return insights;
}

/**
 * Run customer analysis to identify at-risk customers and opportunities
 */
async function analyzeCustomers(companyId: string): Promise<Insight[]> {
	const supabase = createServiceSupabaseClient();
	const insights: Insight[] = [];

	// Find customers with no recent activity
	const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

	const { data: inactiveCustomers } = await supabase
		.from("customers")
		.select("id, first_name, last_name, email, last_service_date")
		.eq("company_id", companyId)
		.lt("last_service_date", ninetyDaysAgo.toISOString())
		.is("deleted_at", null)
		.limit(20);

	if (inactiveCustomers && inactiveCustomers.length > 0) {
		insights.push({
			type: "opportunity",
			priority: "medium",
			category: "customer",
			title: "Inactive Customers Identified",
			description: `${inactiveCustomers.length} customers haven't had service in over 90 days.`,
			dataPoints: {
				inactiveCount: inactiveCustomers.length,
				customerIds: inactiveCustomers.map((c) => c.id),
			},
			relatedEntities: inactiveCustomers.slice(0, 5).map((c) => ({
				type: "customer",
				id: c.id,
			})),
			suggestedActions: [
				"Send re-engagement emails",
				"Offer special promotions for returning customers",
				"Schedule follow-up calls",
			],
		});
	}

	return insights;
}

/**
 * Run scheduling analysis to identify capacity issues
 */
async function analyzeScheduling(companyId: string): Promise<Insight[]> {
	const supabase = createServiceSupabaseClient();
	const insights: Insight[] = [];

	// Check for overbooking
	const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const { data: upcomingJobs } = await supabase
		.from("jobs")
		.select("id, scheduled_start, scheduled_end, status")
		.eq("company_id", companyId)
		.gte("scheduled_start", new Date().toISOString())
		.lte("scheduled_start", nextWeek.toISOString())
		.in("status", ["scheduled", "pending"]);

	if (upcomingJobs && upcomingJobs.length > 0) {
		// Group by day
		const jobsByDay: Record<string, number> = {};
		for (const job of upcomingJobs) {
			const day = new Date(job.scheduled_start as string)
				.toISOString()
				.split("T")[0];
			jobsByDay[day] = (jobsByDay[day] || 0) + 1;
		}

		// Check for days with high job counts
		const highVolumeDays = Object.entries(jobsByDay).filter(
			([, count]) => count > 10,
		);
		if (highVolumeDays.length > 0) {
			insights.push({
				type: "risk",
				priority: "medium",
				category: "scheduling",
				title: "High Job Volume Days Detected",
				description: `${highVolumeDays.length} days in the next week have more than 10 scheduled jobs.`,
				dataPoints: {
					highVolumeDays: highVolumeDays.map(([day, count]) => ({
						day,
						count,
					})),
				},
				suggestedActions: [
					"Review team availability for high-volume days",
					"Consider rescheduling non-urgent jobs",
					"Assign additional technicians if available",
				],
			});
		}
	}

	return insights;
}

/**
 * Run full proactive analysis (call all analyzers)
 */
async function runFullAnalysis(companyId: string): Promise<{
	totalInsights: number;
	byCategory: Record<string, number>;
	byPriority: Record<string, number>;
}> {
	const allInsights: Insight[] = [];

	// Run all analyzers
	const [revenueInsights, customerInsights, schedulingInsights] =
		await Promise.all([
			analyzeRevenue(companyId),
			analyzeCustomers(companyId),
			analyzeScheduling(companyId),
		]);

	allInsights.push(
		...revenueInsights,
		...customerInsights,
		...schedulingInsights,
	);

	// Store insights
	for (const insight of allInsights) {
		try {
			await createInsight(companyId, insight, "proactive_analysis");
		} catch (error) {
			console.error("Failed to store insight:", error);
		}
	}

	// Calculate statistics
	const byCategory: Record<string, number> = {};
	const byPriority: Record<string, number> = {};

	for (const insight of allInsights) {
		byCategory[insight.category] = (byCategory[insight.category] || 0) + 1;
		byPriority[insight.priority] = (byPriority[insight.priority] || 0) + 1;
	}

	return {
		totalInsights: allInsights.length,
		byCategory,
		byPriority,
	};
}

/**
 * Get insight statistics for monitoring dashboard
 */
async function getInsightStatistics(
	companyId: string,
	dateRange: { start: Date; end: Date },
): Promise<{
	totalInsights: number;
	byStatus: Record<string, number>;
	byPriority: Record<string, number>;
	byCategory: Record<string, number>;
	avgTimeToAcknowledge: number;
	avgTimeToResolve: number;
	dismissalRate: number;
}> {
	const supabase = createServiceSupabaseClient();

	const { data, error } = await supabase
		.from("ai_insights")
		.select("*")
		.eq("company_id", companyId)
		.gte("created_at", dateRange.start.toISOString())
		.lte("created_at", dateRange.end.toISOString());

	if (error || !data) {
		return {
			totalInsights: 0,
			byStatus: {},
			byPriority: {},
			byCategory: {},
			avgTimeToAcknowledge: 0,
			avgTimeToResolve: 0,
			dismissalRate: 0,
		};
	}

	const byStatus: Record<string, number> = {};
	const byPriority: Record<string, number> = {};
	const byCategory: Record<string, number> = {};
	const acknowledgeTimes: number[] = [];
	const resolveTimes: number[] = [];
	let dismissedCount = 0;

	for (const insight of data) {
		byStatus[insight.status] = (byStatus[insight.status] || 0) + 1;
		byPriority[insight.priority] = (byPriority[insight.priority] || 0) + 1;
		byCategory[insight.category] = (byCategory[insight.category] || 0) + 1;

		if (insight.status === "dismissed") {
			dismissedCount++;
		}

		if (insight.acknowledged_at) {
			const ackTime =
				new Date(insight.acknowledged_at as string).getTime() -
				new Date(insight.created_at as string).getTime();
			acknowledgeTimes.push(ackTime);
		}

		if (insight.resolved_at) {
			const resolveTime =
				new Date(insight.resolved_at as string).getTime() -
				new Date(insight.created_at as string).getTime();
			resolveTimes.push(resolveTime);
		}
	}

	return {
		totalInsights: data.length,
		byStatus,
		byPriority,
		byCategory,
		avgTimeToAcknowledge:
			acknowledgeTimes.length > 0
				? Math.round(
						acknowledgeTimes.reduce((a, b) => a + b, 0) /
							acknowledgeTimes.length /
							60000,
					)
				: 0, // in minutes
		avgTimeToResolve:
			resolveTimes.length > 0
				? Math.round(
						resolveTimes.reduce((a, b) => a + b, 0) /
							resolveTimes.length /
							60000,
					)
				: 0, // in minutes
		dismissalRate: data.length > 0 ? (dismissedCount / data.length) * 100 : 0,
	};
}
