/**
 * Google PageSpeed Insights Service
 *
 * Provides performance monitoring capabilities for Stratos platform:
 * - Monitor customer portal performance
 * - Track Core Web Vitals
 * - Get optimization recommendations
 * - Compare mobile vs desktop performance
 *
 * API Documentation: https://developers.google.com/speed/docs/insights/v5/get-started
 *
 * Features:
 * - Lighthouse performance audits
 * - Core Web Vitals (LCP, FID, CLS)
 * - Performance score tracking
 * - SEO and accessibility audits
 * - Best practices recommendations
 */

import { z } from "zod";

// ============================================================================
// Types and Schemas
// ============================================================================

/**
 * Strategy for analysis
 */
export type AnalysisStrategy = "mobile" | "desktop";

/**
 * Categories to analyze
 */
export type AuditCategory =
	| "performance"
	| "accessibility"
	| "best-practices"
	| "seo"
	| "pwa";

/**
 * Core Web Vitals metrics
 */
export interface CoreWebVitals {
	// Largest Contentful Paint (loading performance)
	lcp: {
		value: number; // milliseconds
		score: number; // 0-1
		rating: "good" | "needs-improvement" | "poor";
	};
	// First Input Delay (interactivity)
	fid: {
		value: number; // milliseconds
		score: number;
		rating: "good" | "needs-improvement" | "poor";
	};
	// Cumulative Layout Shift (visual stability)
	cls: {
		value: number;
		score: number;
		rating: "good" | "needs-improvement" | "poor";
	};
	// First Contentful Paint
	fcp: {
		value: number;
		score: number;
		rating: "good" | "needs-improvement" | "poor";
	};
	// Time to First Byte
	ttfb: {
		value: number;
		score: number;
		rating: "good" | "needs-improvement" | "poor";
	};
	// Interaction to Next Paint (replacing FID)
	inp?: {
		value: number;
		score: number;
		rating: "good" | "needs-improvement" | "poor";
	};
}

/**
 * Performance audit result
 */
export interface AuditResult {
	id: string;
	title: string;
	description: string;
	score: number | null;
	displayValue?: string;
	numericValue?: number;
	details?: {
		type: string;
		items?: Array<Record<string, unknown>>;
	};
}

/**
 * Category score
 */
export interface CategoryScore {
	id: string;
	title: string;
	score: number;
	description?: string;
}

/**
 * Lighthouse result summary
 */
export interface LighthouseResult {
	fetchTime: string;
	requestedUrl: string;
	finalUrl: string;
	lighthouseVersion: string;
	userAgent: string;
	categories: Record<string, CategoryScore>;
	audits: Record<string, AuditResult>;
}

/**
 * Simplified performance report
 */
export interface PerformanceReport {
	url: string;
	strategy: AnalysisStrategy;
	fetchTime: Date;
	overallScore: number;
	coreWebVitals: CoreWebVitals;
	categoryScores: {
		performance: number;
		accessibility: number;
		bestPractices: number;
		seo: number;
	};
	opportunities: Array<{
		id: string;
		title: string;
		description: string;
		savings?: string;
		priority: "high" | "medium" | "low";
	}>;
	diagnostics: Array<{
		id: string;
		title: string;
		description: string;
		displayValue?: string;
	}>;
	passedAudits: number;
	totalAudits: number;
}

// Zod schemas for validation
const AuditResultSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional().default(""),
	score: z.number().nullable(),
	displayValue: z.string().optional(),
	numericValue: z.number().optional(),
	details: z
		.object({
			type: z.string(),
			items: z.array(z.record(z.unknown())).optional(),
		})
		.optional(),
});

const CategoryScoreSchema = z.object({
	id: z.string(),
	title: z.string(),
	score: z
		.number()
		.nullable()
		.transform((val) => val ?? 0),
	description: z.string().optional(),
});

const LighthouseResultSchema = z.object({
	fetchTime: z.string(),
	requestedUrl: z.string(),
	finalUrl: z.string(),
	lighthouseVersion: z.string(),
	userAgent: z.string(),
	categories: z.record(CategoryScoreSchema),
	audits: z.record(AuditResultSchema),
});

const PageSpeedResponseSchema = z.object({
	captchaResult: z.string().optional(),
	id: z.string(),
	loadingExperience: z
		.object({
			id: z.string(),
			metrics: z.record(z.unknown()).optional(),
			overall_category: z.string().optional(),
		})
		.optional(),
	originLoadingExperience: z
		.object({
			id: z.string(),
			metrics: z.record(z.unknown()).optional(),
			overall_category: z.string().optional(),
		})
		.optional(),
	lighthouseResult: LighthouseResultSchema,
	analysisUTCTimestamp: z.string(),
});

// ============================================================================
// Service Class
// ============================================================================

/**
 * Google PageSpeed Insights Service
 *
 * Singleton service for performance monitoring operations.
 *
 * @example
 * ```typescript
 * const pagespeedService = GooglePageSpeedService.getInstance();
 *
 * // Get performance report for a URL
 * const report = await pagespeedService.analyzeUrl('https://example.com', 'mobile');
 *
 * console.log(`Performance score: ${report.overallScore}`);
 * console.log(`LCP: ${report.coreWebVitals.lcp.value}ms`);
 * ```
 */
class GooglePageSpeedService {
	private static instance: GooglePageSpeedService;
	private apiKey: string | undefined;
	private baseUrl =
		"https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

	// Cache for analysis results
	private cache: Map<string, { result: PerformanceReport; timestamp: number }> =
		new Map();
	private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

	private constructor() {
		// Use unified GOOGLE_API_KEY for all Google services
		this.apiKey =
			process.env.GOOGLE_API_KEY ||
			process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
			process.env.GOOGLE_MAPS_API_KEY;

		if (!this.apiKey) {
			console.warn(
				"GooglePageSpeedService: No API key found. Set GOOGLE_API_KEY environment variable.",
			);
		}
	}

	/**
	 * Get singleton instance
	 */
	public static getInstance(): GooglePageSpeedService {
		if (!GooglePageSpeedService.instance) {
			GooglePageSpeedService.instance = new GooglePageSpeedService();
		}
		return GooglePageSpeedService.instance;
	}

	/**
	 * Check if the service is configured
	 */
	public isConfigured(): boolean {
		return !!this.apiKey;
	}

	/**
	 * Generate cache key
	 */
	private getCacheKey(url: string, strategy: AnalysisStrategy): string {
		return `${url}_${strategy}`;
	}

	/**
	 * Clean expired cache entries
	 */
	private cleanCache(): void {
		const now = Date.now();
		for (const [key, value] of this.cache.entries()) {
			if (now - value.timestamp > this.CACHE_TTL) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Analyze a URL's performance
	 *
	 * @param url - URL to analyze
	 * @param strategy - Analysis strategy (mobile or desktop)
	 * @param categories - Categories to include in analysis
	 * @returns Performance report
	 */
	async analyzeUrl(
		url: string,
		strategy: AnalysisStrategy = "mobile",
		categories: AuditCategory[] = [
			"performance",
			"accessibility",
			"best-practices",
			"seo",
		],
	): Promise<PerformanceReport> {
		if (!this.apiKey) {
			throw new Error("PageSpeed API key not configured");
		}

		// Check cache
		const cacheKey = this.getCacheKey(url, strategy);
		this.cleanCache();
		const cached = this.cache.get(cacheKey);
		if (cached) {
			return cached.result;
		}

		// Build request URL
		const params = new URLSearchParams({
			url,
			key: this.apiKey,
			strategy,
		});

		// Add categories
		categories.forEach((cat) => {
			params.append("category", cat.toUpperCase());
		});

		const response = await fetch(`${this.baseUrl}?${params.toString()}`);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`PageSpeed API error: ${error.error?.message || response.statusText}`,
			);
		}

		const data = await response.json();
		const validated = PageSpeedResponseSchema.parse(data);

		// Convert to simplified report
		const report = this.convertToPerformanceReport(
			validated.lighthouseResult,
			url,
			strategy,
		);

		// Cache result
		this.cache.set(cacheKey, { result: report, timestamp: Date.now() });

		return report;
	}

	/**
	 * Analyze both mobile and desktop performance
	 *
	 * @param url - URL to analyze
	 * @returns Mobile and desktop reports
	 */
	async analyzeUrlBothStrategies(url: string): Promise<{
		mobile: PerformanceReport;
		desktop: PerformanceReport;
		comparison: {
			performanceDiff: number;
			mobileFaster: boolean;
			recommendations: string[];
		};
	}> {
		const [mobile, desktop] = await Promise.all([
			this.analyzeUrl(url, "mobile"),
			this.analyzeUrl(url, "desktop"),
		]);

		const performanceDiff = Math.abs(
			mobile.overallScore - desktop.overallScore,
		);
		const mobileFaster = mobile.overallScore > desktop.overallScore;

		const recommendations: string[] = [];

		// Generate recommendations based on differences
		if (performanceDiff > 20) {
			recommendations.push(
				mobileFaster
					? "Desktop experience needs significant optimization"
					: "Mobile experience needs significant optimization",
			);
		}

		if (mobile.coreWebVitals.lcp.rating === "poor") {
			recommendations.push("Optimize Largest Contentful Paint on mobile");
		}

		if (mobile.coreWebVitals.cls.rating === "poor") {
			recommendations.push("Fix layout shift issues on mobile");
		}

		if (mobile.categoryScores.accessibility < 80) {
			recommendations.push("Improve accessibility for mobile users");
		}

		return {
			mobile,
			desktop,
			comparison: {
				performanceDiff,
				mobileFaster,
				recommendations,
			},
		};
	}

	/**
	 * Get Core Web Vitals only (faster, lighter analysis)
	 *
	 * @param url - URL to analyze
	 * @param strategy - Analysis strategy
	 * @returns Core Web Vitals metrics
	 */
	async getCoreWebVitals(
		url: string,
		strategy: AnalysisStrategy = "mobile",
	): Promise<CoreWebVitals> {
		const report = await this.analyzeUrl(url, strategy, ["performance"]);
		return report.coreWebVitals;
	}

	/**
	 * Check if URL meets Core Web Vitals thresholds
	 *
	 * @param url - URL to check
	 * @returns Pass/fail status for each metric
	 */
	async checkCoreWebVitalsThresholds(url: string): Promise<{
		passesAll: boolean;
		lcp: { passes: boolean; value: number; threshold: number };
		fid: { passes: boolean; value: number; threshold: number };
		cls: { passes: boolean; value: number; threshold: number };
	}> {
		const vitals = await this.getCoreWebVitals(url);

		// Google's thresholds for "good"
		const thresholds = {
			lcp: 2500, // ms
			fid: 100, // ms
			cls: 0.1, // unitless
		};

		const lcpPasses = vitals.lcp.value <= thresholds.lcp;
		const fidPasses = vitals.fid.value <= thresholds.fid;
		const clsPasses = vitals.cls.value <= thresholds.cls;

		return {
			passesAll: lcpPasses && fidPasses && clsPasses,
			lcp: {
				passes: lcpPasses,
				value: vitals.lcp.value,
				threshold: thresholds.lcp,
			},
			fid: {
				passes: fidPasses,
				value: vitals.fid.value,
				threshold: thresholds.fid,
			},
			cls: {
				passes: clsPasses,
				value: vitals.cls.value,
				threshold: thresholds.cls,
			},
		};
	}

	/**
	 * Monitor multiple URLs for performance regression
	 *
	 * @param urls - URLs to monitor
	 * @param baseline - Baseline scores to compare against
	 * @returns Monitoring results
	 */
	async monitorUrls(
		urls: string[],
		baseline?: Record<string, number>,
	): Promise<
		Array<{
			url: string;
			score: number;
			baselineScore?: number;
			regression: boolean;
			regressionAmount?: number;
		}>
	> {
		const results = await Promise.all(
			urls.map(async (url) => {
				try {
					const report = await this.analyzeUrl(url, "mobile", ["performance"]);
					const baselineScore = baseline?.[url];

					return {
						url,
						score: report.overallScore,
						baselineScore,
						regression:
							baselineScore !== undefined &&
							report.overallScore < baselineScore - 5,
						regressionAmount:
							baselineScore !== undefined
								? baselineScore - report.overallScore
								: undefined,
					};
				} catch (error) {
					return {
						url,
						score: 0,
						regression: false,
						error: error instanceof Error ? error.message : "Analysis failed",
					};
				}
			}),
		);

		return results;
	}

	/**
	 * Get high-priority optimization opportunities
	 *
	 * @param url - URL to analyze
	 * @returns Top optimization opportunities
	 */
	async getTopOpportunities(
		url: string,
		limit: number = 5,
	): Promise<
		Array<{
			title: string;
			description: string;
			savings: string;
			priority: "high" | "medium" | "low";
		}>
	> {
		const report = await this.analyzeUrl(url, "mobile");
		return report.opportunities.slice(0, limit);
	}

	/**
	 * Convert Lighthouse result to simplified report
	 */
	private convertToPerformanceReport(
		result: LighthouseResult,
		url: string,
		strategy: AnalysisStrategy,
	): PerformanceReport {
		const audits = result.audits;
		const categories = result.categories;

		// Extract Core Web Vitals
		const coreWebVitals: CoreWebVitals = {
			lcp: this.extractMetric(audits["largest-contentful-paint"]),
			fid: this.extractMetric(audits["max-potential-fid"]) || {
				value: 0,
				score: 1,
				rating: "good",
			},
			cls: this.extractMetric(audits["cumulative-layout-shift"]),
			fcp: this.extractMetric(audits["first-contentful-paint"]),
			ttfb: this.extractMetric(audits["server-response-time"]) || {
				value: 0,
				score: 1,
				rating: "good",
			},
		};

		// Add INP if available
		if (audits["interaction-to-next-paint"]) {
			coreWebVitals.inp = this.extractMetric(
				audits["interaction-to-next-paint"],
			);
		}

		// Extract opportunities (audits with savings)
		const opportunities = Object.values(audits)
			.filter(
				(audit) =>
					audit.score !== null &&
					audit.score < 0.9 &&
					audit.details?.type === "opportunity",
			)
			.map((audit) => ({
				id: audit.id,
				title: audit.title,
				description: audit.description,
				savings: audit.displayValue,
				priority: this.getPriority(audit.score),
			}))
			.sort((a, b) => {
				const priorityOrder = { high: 0, medium: 1, low: 2 };
				return priorityOrder[a.priority] - priorityOrder[b.priority];
			});

		// Extract diagnostics
		const diagnostics = Object.values(audits)
			.filter(
				(audit) =>
					audit.score !== null &&
					audit.score < 0.9 &&
					audit.details?.type === "table",
			)
			.map((audit) => ({
				id: audit.id,
				title: audit.title,
				description: audit.description,
				displayValue: audit.displayValue,
			}));

		// Count passed audits
		const allAudits = Object.values(audits);
		const passedAudits = allAudits.filter((a) => a.score === 1).length;

		return {
			url,
			strategy,
			fetchTime: new Date(result.fetchTime),
			overallScore: Math.round((categories.performance?.score || 0) * 100),
			coreWebVitals,
			categoryScores: {
				performance: Math.round((categories.performance?.score || 0) * 100),
				accessibility: Math.round((categories.accessibility?.score || 0) * 100),
				bestPractices: Math.round(
					(categories["best-practices"]?.score || 0) * 100,
				),
				seo: Math.round((categories.seo?.score || 0) * 100),
			},
			opportunities,
			diagnostics,
			passedAudits,
			totalAudits: allAudits.length,
		};
	}

	/**
	 * Extract metric from audit result
	 */
	private extractMetric(audit: AuditResult | undefined): CoreWebVitals["lcp"] {
		if (!audit) {
			return { value: 0, score: 1, rating: "good" };
		}

		const value = audit.numericValue || 0;
		const score = audit.score || 0;

		return {
			value: Math.round(value),
			score,
			rating:
				score >= 0.9 ? "good" : score >= 0.5 ? "needs-improvement" : "poor",
		};
	}

	/**
	 * Get priority from score
	 */
	private getPriority(score: number | null): "high" | "medium" | "low" {
		if (score === null) return "low";
		if (score < 0.5) return "high";
		if (score < 0.9) return "medium";
		return "low";
	}

	/**
	 * Clear the analysis cache
	 */
	clearCache(): void {
		this.cache.clear();
	}
}

// ============================================================================
// Exports
// ============================================================================

export const googlePageSpeedService = GooglePageSpeedService.getInstance();
export default googlePageSpeedService;
