/**
 * Google Cloud Usage & Billing Client
 *
 * Fetches usage data from Google Cloud APIs
 * - Cloud Billing API for cost data
 * - Service Usage API for API call counts
 *
 * Docs:
 * - https://cloud.google.com/billing/docs/reference/rest
 * - https://cloud.google.com/service-usage/docs/reference/rest
 */

export interface GoogleCloudUsage {
	service_name: string;
	display_name: string;
	usage_amount: number;
	usage_unit: string;
	cost_usd: number;
	month: string;
}

export interface GoogleAIUsage {
	gemini_requests: number;
	gemini_tokens_input: number;
	gemini_tokens_output: number;
	document_ai_pages: number;
	vision_requests: number;
	speech_minutes: number;
	translation_characters: number;
	total_cost_cents: number;
}

interface ServiceUsageResponse {
	services: Array<{
		name: string;
		config: {
			name: string;
			title: string;
		};
	}>;
}

interface BillingReportResponse {
	rows?: Array<{
		service: { id: string; description: string };
		sku: { id: string; description: string };
		usage: { amount: string; unit: string };
		cost: { amount: string; currency: string };
	}>;
}

/**
 * Google Cloud Client
 *
 * Required environment variables:
 * - GOOGLE_CLOUD_PROJECT_ID
 * - GOOGLE_CLOUD_BILLING_ACCOUNT_ID
 * - GOOGLE_CLOUD_API_KEY or GOOGLE_APPLICATION_CREDENTIALS
 */
export class GoogleCloudClient {
	private projectId: string;
	private billingAccountId: string;
	private accessToken: string;

	constructor() {
		this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "";
		this.billingAccountId = process.env.GOOGLE_CLOUD_BILLING_ACCOUNT_ID || "";
		this.accessToken = process.env.GOOGLE_CLOUD_ACCESS_TOKEN || "";

		if (!this.projectId) {
			console.warn(
				"GOOGLE_CLOUD_PROJECT_ID not set - Google Cloud tracking disabled",
			);
		}
	}

	private async fetch<T>(url: string): Promise<T | null> {
		if (!this.accessToken) {
			return null;
		}

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				console.error(
					`Google Cloud API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			return (await response.json()) as T;
		} catch (error) {
			console.error("Google Cloud API fetch error:", error);
			return null;
		}
	}

	/**
	 * Get enabled services for the project
	 */
	async getEnabledServices(): Promise<string[] | null> {
		const response = await this.fetch<ServiceUsageResponse>(
			`https://serviceusage.googleapis.com/v1/projects/${this.projectId}/services?filter=state:ENABLED`,
		);

		if (!response?.services) {
			return null;
		}

		return response.services.map((s) => s.config.name);
	}

	/**
	 * Get AI-specific usage from the current month
	 * Note: This is a simplified implementation. In production, you'd use
	 * the Cloud Billing Export to BigQuery for detailed usage data.
	 */
	async getAIUsage(): Promise<GoogleAIUsage | null> {
		// For accurate Google AI usage, you typically need to:
		// 1. Enable Cloud Billing export to BigQuery
		// 2. Query the billing export table

		// As a fallback, we can estimate from the billing API
		// but it doesn't provide granular token/request counts

		// Return structure for manual tracking until BigQuery export is set up
		return {
			gemini_requests: 0,
			gemini_tokens_input: 0,
			gemini_tokens_output: 0,
			document_ai_pages: 0,
			vision_requests: 0,
			speech_minutes: 0,
			translation_characters: 0,
			total_cost_cents: 0,
		};
	}

	/**
	 * Get current month billing summary
	 * Requires Cloud Billing API access
	 */
	async getCurrentMonthBilling(): Promise<GoogleCloudUsage[] | null> {
		if (!this.billingAccountId) {
			return null;
		}

		// Note: The Cloud Billing API requires special permissions
		// For most use cases, you'd query BigQuery export instead
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		// This is a simplified example - actual implementation would use
		// the Cloud Billing Budget API or BigQuery export
		const budgetsUrl = `https://cloudbilling.googleapis.com/v1/billingAccounts/${this.billingAccountId}/budgets`;

		const response = await this.fetch<{
			budgets?: Array<{
				amount: { specifiedAmount: { currencyCode: string; units: string } };
				currentSpend?: { currencyCode: string; units: string };
			}>;
		}>(budgetsUrl);

		if (!response?.budgets) {
			return null;
		}

		// Transform budget data to usage format
		return response.budgets.map((budget) => ({
			service_name: "all_services",
			display_name: "All Google Cloud Services",
			usage_amount: 1,
			usage_unit: "budget",
			cost_usd: parseFloat(budget.currentSpend?.units || "0"),
			month: startOfMonth.toISOString().slice(0, 7),
		}));
	}

	/**
	 * Get Maps Platform usage
	 * Uses the Cloud Billing API to fetch Maps-specific costs
	 */
	async getMapsUsage(): Promise<{
		geocoding_requests: number;
		places_requests: number;
		directions_requests: number;
		static_maps_requests: number;
		total_cost_cents: number;
	} | null> {
		// Maps usage is typically tracked via:
		// 1. Cloud Console usage reports
		// 2. BigQuery billing export

		// For now, return structure for manual tracking
		return {
			geocoding_requests: 0,
			places_requests: 0,
			directions_requests: 0,
			static_maps_requests: 0,
			total_cost_cents: 0,
		};
	}

	/**
	 * Check if Google Cloud APIs are healthy
	 */
	async checkHealth(): Promise<{
		healthy: boolean;
		responseTimeMs: number;
		error?: string;
	}> {
		const startTime = Date.now();

		try {
			// Check Service Usage API availability
			const response = await fetch(
				`https://serviceusage.googleapis.com/v1/projects/${this.projectId}/services?pageSize=1`,
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`,
					},
				},
			);

			const responseTimeMs = Date.now() - startTime;

			if (response.ok) {
				return { healthy: true, responseTimeMs };
			}

			// Special case: 401/403 means API is up but we need auth
			if (response.status === 401 || response.status === 403) {
				return {
					healthy: true, // API is responding
					responseTimeMs,
					error: "Authentication required - API is available",
				};
			}

			return {
				healthy: false,
				responseTimeMs,
				error: `HTTP ${response.status}: ${response.statusText}`,
			};
		} catch (error) {
			return {
				healthy: false,
				responseTimeMs: Date.now() - startTime,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

// Export singleton instance
export const googleCloudClient = new GoogleCloudClient();

/**
 * Google AI Internal Tracker
 *
 * Since Google Cloud doesn't provide real-time token/request counts via API,
 * we need to track these internally in our application.
 *
 * This class provides utilities for internal tracking that syncs with our database.
 */
export class GoogleAITracker {
	/**
	 * Calculate cost for Gemini API usage
	 * Based on: https://ai.google.dev/pricing
	 */
	static calculateGeminiCost(
		inputTokens: number,
		outputTokens: number,
		model: "gemini-1.5-flash" | "gemini-1.5-pro" = "gemini-1.5-flash",
	): number {
		// Pricing as of 2024 (per million tokens)
		const pricing = {
			"gemini-1.5-flash": {
				input: 0.075, // $0.075 per 1M tokens
				output: 0.3, // $0.30 per 1M tokens
			},
			"gemini-1.5-pro": {
				input: 1.25, // $1.25 per 1M tokens
				output: 5.0, // $5.00 per 1M tokens
			},
		};

		const modelPricing = pricing[model];
		const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
		const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

		return Math.round((inputCost + outputCost) * 100); // Return cents
	}

	/**
	 * Calculate cost for Document AI
	 * First 1,000 pages/month are free
	 */
	static calculateDocumentAICost(pages: number): number {
		const FREE_TIER = 1000;
		const PRICE_PER_1000 = 1.5; // $1.50 per 1000 pages

		if (pages <= FREE_TIER) return 0;

		const billablePages = pages - FREE_TIER;
		return Math.round((billablePages / 1000) * PRICE_PER_1000 * 100);
	}

	/**
	 * Calculate cost for Vision AI
	 * First 1,000 units/month are free
	 */
	static calculateVisionCost(requests: number): number {
		const FREE_TIER = 1000;
		const PRICE_PER_1000 = 1.5; // $1.50 per 1000 requests

		if (requests <= FREE_TIER) return 0;

		const billableRequests = requests - FREE_TIER;
		return Math.round((billableRequests / 1000) * PRICE_PER_1000 * 100);
	}

	/**
	 * Calculate cost for Speech-to-Text
	 * First 60 minutes/month are free
	 */
	static calculateSpeechCost(minutes: number): number {
		const FREE_TIER = 60;
		const PRICE_PER_MINUTE = 0.024; // $0.024 per minute

		if (minutes <= FREE_TIER) return 0;

		const billableMinutes = minutes - FREE_TIER;
		return Math.round(billableMinutes * PRICE_PER_MINUTE * 100);
	}

	/**
	 * Calculate cost for Translation API
	 * First 500,000 characters/month are free
	 */
	static calculateTranslationCost(characters: number): number {
		const FREE_TIER = 500_000;
		const PRICE_PER_MILLION = 20; // $20 per million characters

		if (characters <= FREE_TIER) return 0;

		const billableChars = characters - FREE_TIER;
		return Math.round((billableChars / 1_000_000) * PRICE_PER_MILLION * 100);
	}

	/**
	 * Calculate total Google AI costs
	 */
	static calculateTotalCost(usage: {
		gemini_input_tokens?: number;
		gemini_output_tokens?: number;
		gemini_model?: "gemini-1.5-flash" | "gemini-1.5-pro";
		document_ai_pages?: number;
		vision_requests?: number;
		speech_minutes?: number;
		translation_characters?: number;
	}): number {
		let total = 0;

		if (usage.gemini_input_tokens || usage.gemini_output_tokens) {
			total += GoogleAITracker.calculateGeminiCost(
				usage.gemini_input_tokens || 0,
				usage.gemini_output_tokens || 0,
				usage.gemini_model || "gemini-1.5-flash",
			);
		}

		if (usage.document_ai_pages) {
			total += GoogleAITracker.calculateDocumentAICost(usage.document_ai_pages);
		}

		if (usage.vision_requests) {
			total += GoogleAITracker.calculateVisionCost(usage.vision_requests);
		}

		if (usage.speech_minutes) {
			total += GoogleAITracker.calculateSpeechCost(usage.speech_minutes);
		}

		if (usage.translation_characters) {
			total += GoogleAITracker.calculateTranslationCost(
				usage.translation_characters,
			);
		}

		return total;
	}
}
