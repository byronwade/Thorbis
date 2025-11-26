/**
 * Google Analytics Data API Service
 *
 * Provides website analytics and reporting.
 * - Real-time analytics
 * - Custom reports
 * - Audience insights
 * - Conversion tracking
 *
 * NOTE: Requires service account or OAuth 2.0 authentication.
 * Set GOOGLE_ANALYTICS_PROPERTY_ID and provide access token.
 *
 * API: Google Analytics Data API v1
 * Docs: https://developers.google.com/analytics/devguides/reporting/data/v1
 */

import { z } from "zod";

const USER_AGENT = "Stratos-FMS/1.0 (support@stratos.app)";

/**
 * Date range for reports
 */
export interface DateRange {
	startDate: string; // Format: YYYY-MM-DD or relative like "7daysAgo", "today", "yesterday"
	endDate: string;
	name?: string;
}

/**
 * Dimension for reports
 */
export interface Dimension {
	name: string;
}

/**
 * Metric for reports
 */
export interface Metric {
	name: string;
	expression?: string;
}

/**
 * Filter expression
 */
export interface FilterExpression {
	andGroup?: { expressions: FilterExpression[] };
	orGroup?: { expressions: FilterExpression[] };
	notExpression?: FilterExpression;
	filter?: {
		fieldName: string;
		stringFilter?: {
			matchType:
				| "EXACT"
				| "BEGINS_WITH"
				| "ENDS_WITH"
				| "CONTAINS"
				| "FULL_REGEXP"
				| "PARTIAL_REGEXP";
			value: string;
			caseSensitive?: boolean;
		};
		inListFilter?: {
			values: string[];
			caseSensitive?: boolean;
		};
		numericFilter?: {
			operation:
				| "EQUAL"
				| "LESS_THAN"
				| "LESS_THAN_OR_EQUAL"
				| "GREATER_THAN"
				| "GREATER_THAN_OR_EQUAL";
			value: { int64Value?: string; doubleValue?: number };
		};
		betweenFilter?: {
			fromValue: { int64Value?: string; doubleValue?: number };
			toValue: { int64Value?: string; doubleValue?: number };
		};
	};
}

/**
 * Order by specification
 */
export interface OrderBy {
	metric?: { metricName: string };
	dimension?: {
		dimensionName: string;
		orderType?: "ALPHANUMERIC" | "CASE_INSENSITIVE_ALPHANUMERIC" | "NUMERIC";
	};
	desc?: boolean;
}

/**
 * Report request
 */
export interface ReportRequest {
	dateRanges: DateRange[];
	dimensions?: Dimension[];
	metrics: Metric[];
	dimensionFilter?: FilterExpression;
	metricFilter?: FilterExpression;
	orderBys?: OrderBy[];
	limit?: number;
	offset?: number;
	keepEmptyRows?: boolean;
}

/**
 * Report row
 */
export interface ReportRow {
	dimensionValues: { value: string }[];
	metricValues: { value: string }[];
}

/**
 * Report response
 */
export interface ReportResponse {
	dimensionHeaders: { name: string }[];
	metricHeaders: { name: string; type: string }[];
	rows: ReportRow[];
	rowCount: number;
	metadata?: {
		currencyCode?: string;
		timeZone?: string;
	};
}

/**
 * Real-time report response
 */
export interface RealTimeResponse {
	dimensionHeaders: { name: string }[];
	metricHeaders: { name: string; type: string }[];
	rows: ReportRow[];
	rowCount: number;
}

/**
 * Parsed analytics data (more user-friendly)
 */
export interface AnalyticsData {
	metrics: Record<string, number>;
	dimensions: Record<string, string>[];
	dateRange: DateRange;
}

/**
 * Website overview data
 */
export interface WebsiteOverview {
	activeUsers: number;
	newUsers: number;
	sessions: number;
	pageViews: number;
	bounceRate: number;
	avgSessionDuration: number;
	dateRange: DateRange;
}

/**
 * Traffic source data
 */
export interface TrafficSource {
	source: string;
	medium: string;
	sessions: number;
	users: number;
	bounceRate: number;
	conversionRate?: number;
}

/**
 * Page performance data
 */
export interface PagePerformance {
	pagePath: string;
	pageTitle: string;
	pageViews: number;
	uniquePageViews: number;
	avgTimeOnPage: number;
	bounceRate: number;
	exitRate: number;
}

/**
 * Real-time data
 */
export interface RealTimeData {
	activeUsers: number;
	pageViews: number;
	topPages: { path: string; activeUsers: number }[];
	topCountries: { country: string; activeUsers: number }[];
	topDevices: { device: string; activeUsers: number }[];
}

// biome-ignore lint/suspicious/noConsole: Backend service logging is acceptable
class GoogleAnalyticsService {
	private readonly propertyId: string | undefined;
	private readonly baseUrl = "https://analyticsdata.googleapis.com/v1beta";

	constructor() {
		this.propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
	}

	/**
	 * Get headers for authenticated requests
	 */
	private getHeaders(accessToken: string): Record<string, string> {
		return {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			"User-Agent": USER_AGENT,
		};
	}

	/**
	 * Get property path
	 */
	private getPropertyPath(): string {
		return `properties/${this.propertyId}`;
	}

	/**
	 * Run a report
	 */
	async runReport(
		accessToken: string,
		request: ReportRequest,
	): Promise<ReportResponse | null> {
		if (!this.propertyId) {
			console.warn("Google Analytics property ID not configured");
			return null;
		}

		try {
			const url = `${this.baseUrl}/${this.getPropertyPath()}:runReport`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Analytics report error:", response.status, error);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Analytics report error:", error);
			return null;
		}
	}

	/**
	 * Run a real-time report
	 */
	async runRealtimeReport(
		accessToken: string,
		request: {
			dimensions?: Dimension[];
			metrics: Metric[];
			dimensionFilter?: FilterExpression;
			metricFilter?: FilterExpression;
			limit?: number;
		},
	): Promise<RealTimeResponse | null> {
		if (!this.propertyId) {
			console.warn("Google Analytics property ID not configured");
			return null;
		}

		try {
			const url = `${this.baseUrl}/${this.getPropertyPath()}:runRealtimeReport`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify(request),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Analytics realtime error:", response.status, error);
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Analytics realtime error:", error);
			return null;
		}
	}

	/**
	 * Batch run multiple reports
	 */
	async batchRunReports(
		accessToken: string,
		requests: ReportRequest[],
	): Promise<ReportResponse[] | null> {
		if (!this.propertyId) {
			console.warn("Google Analytics property ID not configured");
			return null;
		}

		try {
			const url = `${this.baseUrl}/${this.getPropertyPath()}:batchRunReports`;
			const response = await fetch(url, {
				method: "POST",
				headers: this.getHeaders(accessToken),
				body: JSON.stringify({ requests }),
			});

			if (!response.ok) {
				const error = await response.text();
				console.error("Analytics batch report error:", response.status, error);
				return null;
			}

			const data = await response.json();
			return data.reports || [];
		} catch (error) {
			console.error("Analytics batch report error:", error);
			return null;
		}
	}

	// ============================================
	// Pre-built Reports
	// ============================================

	/**
	 * Get website overview metrics
	 */
	async getWebsiteOverview(
		accessToken: string,
		dateRange: DateRange = { startDate: "7daysAgo", endDate: "today" },
	): Promise<WebsiteOverview | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			metrics: [
				{ name: "activeUsers" },
				{ name: "newUsers" },
				{ name: "sessions" },
				{ name: "screenPageViews" },
				{ name: "bounceRate" },
				{ name: "averageSessionDuration" },
			],
		});

		if (!report || !report.rows || report.rows.length === 0) {
			return null;
		}

		const values = report.rows[0].metricValues;
		return {
			activeUsers: Number.parseInt(values[0]?.value || "0", 10),
			newUsers: Number.parseInt(values[1]?.value || "0", 10),
			sessions: Number.parseInt(values[2]?.value || "0", 10),
			pageViews: Number.parseInt(values[3]?.value || "0", 10),
			bounceRate: Number.parseFloat(values[4]?.value || "0"),
			avgSessionDuration: Number.parseFloat(values[5]?.value || "0"),
			dateRange,
		};
	}

	/**
	 * Get traffic sources
	 */
	async getTrafficSources(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
		limit = 10,
	): Promise<TrafficSource[] | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
			metrics: [
				{ name: "sessions" },
				{ name: "totalUsers" },
				{ name: "bounceRate" },
			],
			orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
			limit,
		});

		if (!report || !report.rows) {
			return null;
		}

		return report.rows.map((row) => ({
			source: row.dimensionValues[0]?.value || "(not set)",
			medium: row.dimensionValues[1]?.value || "(not set)",
			sessions: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			users: Number.parseInt(row.metricValues[1]?.value || "0", 10),
			bounceRate: Number.parseFloat(row.metricValues[2]?.value || "0"),
		}));
	}

	/**
	 * Get top pages
	 */
	async getTopPages(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
		limit = 10,
	): Promise<PagePerformance[] | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
			metrics: [
				{ name: "screenPageViews" },
				{ name: "averageSessionDuration" },
				{ name: "bounceRate" },
			],
			orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
			limit,
		});

		if (!report || !report.rows) {
			return null;
		}

		return report.rows.map((row) => ({
			pagePath: row.dimensionValues[0]?.value || "",
			pageTitle: row.dimensionValues[1]?.value || "",
			pageViews: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			uniquePageViews: 0, // Not available in GA4 directly
			avgTimeOnPage: Number.parseFloat(row.metricValues[1]?.value || "0"),
			bounceRate: Number.parseFloat(row.metricValues[2]?.value || "0"),
			exitRate: 0, // Would need separate calculation
		}));
	}

	/**
	 * Get user demographics by country
	 */
	async getUsersByCountry(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
		limit = 10,
	): Promise<{ country: string; users: number; sessions: number }[] | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: "country" }],
			metrics: [{ name: "totalUsers" }, { name: "sessions" }],
			orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
			limit,
		});

		if (!report || !report.rows) {
			return null;
		}

		return report.rows.map((row) => ({
			country: row.dimensionValues[0]?.value || "(not set)",
			users: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			sessions: Number.parseInt(row.metricValues[1]?.value || "0", 10),
		}));
	}

	/**
	 * Get device breakdown
	 */
	async getDeviceBreakdown(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
	): Promise<
		| { device: string; users: number; sessions: number; percentage: number }[]
		| null
	> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: "deviceCategory" }],
			metrics: [{ name: "totalUsers" }, { name: "sessions" }],
			orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
		});

		if (!report || !report.rows) {
			return null;
		}

		const totalUsers = report.rows.reduce(
			(sum, row) =>
				sum + Number.parseInt(row.metricValues[0]?.value || "0", 10),
			0,
		);

		return report.rows.map((row) => {
			const users = Number.parseInt(row.metricValues[0]?.value || "0", 10);
			return {
				device: row.dimensionValues[0]?.value || "(not set)",
				users,
				sessions: Number.parseInt(row.metricValues[1]?.value || "0", 10),
				percentage: totalUsers > 0 ? (users / totalUsers) * 100 : 0,
			};
		});
	}

	/**
	 * Get real-time data
	 */
	async getRealTimeData(accessToken: string): Promise<RealTimeData | null> {
		// Get active users
		const activeUsersReport = await this.runRealtimeReport(accessToken, {
			metrics: [{ name: "activeUsers" }],
		});

		// Get top pages
		const topPagesReport = await this.runRealtimeReport(accessToken, {
			dimensions: [{ name: "pagePath" }],
			metrics: [{ name: "activeUsers" }],
			limit: 10,
		});

		// Get top countries
		const topCountriesReport = await this.runRealtimeReport(accessToken, {
			dimensions: [{ name: "country" }],
			metrics: [{ name: "activeUsers" }],
			limit: 5,
		});

		// Get devices
		const devicesReport = await this.runRealtimeReport(accessToken, {
			dimensions: [{ name: "deviceCategory" }],
			metrics: [{ name: "activeUsers" }],
		});

		const activeUsers =
			activeUsersReport?.rows?.[0]?.metricValues?.[0]?.value || "0";

		return {
			activeUsers: Number.parseInt(activeUsers, 10),
			pageViews: 0, // Would need separate query
			topPages: (topPagesReport?.rows || []).map((row) => ({
				path: row.dimensionValues[0]?.value || "",
				activeUsers: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			})),
			topCountries: (topCountriesReport?.rows || []).map((row) => ({
				country: row.dimensionValues[0]?.value || "",
				activeUsers: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			})),
			topDevices: (devicesReport?.rows || []).map((row) => ({
				device: row.dimensionValues[0]?.value || "",
				activeUsers: Number.parseInt(row.metricValues[0]?.value || "0", 10),
			})),
		};
	}

	/**
	 * Get user acquisition data
	 */
	async getUserAcquisition(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
	): Promise<{
		organic: number;
		direct: number;
		referral: number;
		social: number;
		paid: number;
		email: number;
		other: number;
	} | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: "sessionDefaultChannelGroup" }],
			metrics: [{ name: "totalUsers" }],
		});

		if (!report || !report.rows) {
			return null;
		}

		const result = {
			organic: 0,
			direct: 0,
			referral: 0,
			social: 0,
			paid: 0,
			email: 0,
			other: 0,
		};

		for (const row of report.rows) {
			const channel = row.dimensionValues[0]?.value?.toLowerCase() || "";
			const users = Number.parseInt(row.metricValues[0]?.value || "0", 10);

			if (channel.includes("organic")) {
				result.organic += users;
			} else if (channel.includes("direct")) {
				result.direct += users;
			} else if (channel.includes("referral")) {
				result.referral += users;
			} else if (channel.includes("social")) {
				result.social += users;
			} else if (channel.includes("paid") || channel.includes("cpc")) {
				result.paid += users;
			} else if (channel.includes("email")) {
				result.email += users;
			} else {
				result.other += users;
			}
		}

		return result;
	}

	/**
	 * Get conversion metrics (e-commerce or goals)
	 */
	async getConversions(
		accessToken: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
	): Promise<{
		conversions: number;
		conversionRate: number;
		revenue: number;
		transactions: number;
	} | null> {
		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			metrics: [
				{ name: "conversions" },
				{ name: "sessionConversionRate" },
				{ name: "totalRevenue" },
				{ name: "ecommercePurchases" },
			],
		});

		if (!report || !report.rows || report.rows.length === 0) {
			return null;
		}

		const values = report.rows[0].metricValues;
		return {
			conversions: Number.parseInt(values[0]?.value || "0", 10),
			conversionRate: Number.parseFloat(values[1]?.value || "0"),
			revenue: Number.parseFloat(values[2]?.value || "0"),
			transactions: Number.parseInt(values[3]?.value || "0", 10),
		};
	}

	/**
	 * Get metrics over time (for charts)
	 */
	async getMetricsOverTime(
		accessToken: string,
		metricName: string,
		dateRange: DateRange = { startDate: "30daysAgo", endDate: "today" },
		granularity: "date" | "week" | "month" = "date",
	): Promise<{ date: string; value: number }[] | null> {
		const dimensionName =
			granularity === "date"
				? "date"
				: granularity === "week"
					? "isoWeek"
					: "month";

		const report = await this.runReport(accessToken, {
			dateRanges: [dateRange],
			dimensions: [{ name: dimensionName }],
			metrics: [{ name: metricName }],
			orderBys: [{ dimension: { dimensionName }, desc: false }],
		});

		if (!report || !report.rows) {
			return null;
		}

		return report.rows.map((row) => ({
			date: row.dimensionValues[0]?.value || "",
			value: Number.parseFloat(row.metricValues[0]?.value || "0"),
		}));
	}

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return !!this.propertyId;
	}
}

export const googleAnalyticsService = new GoogleAnalyticsService();
