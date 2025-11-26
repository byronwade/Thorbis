/**
 * Telnyx Usage Reports API Client
 *
 * Fetches real voice and SMS usage data from Telnyx
 * Docs: https://developers.telnyx.com/docs/reporting/usage-reports
 */

export interface TelnyxVoiceUsage {
	total_minutes: number;
	inbound_minutes: number;
	outbound_minutes: number;
	total_calls: number;
	total_cost_cents: number;
}

export interface TelnyxSmsUsage {
	total_messages: number;
	outbound_messages: number;
	inbound_messages: number;
	total_cost_cents: number;
}

interface CdrUsageReportResponse {
	data: {
		aggregations: {
			total_cost: number;
			total_duration: number;
			record_count: number;
		};
		records?: Array<{
			direction: string;
			duration: number;
			cost: number;
		}>;
	};
}

interface MessagingReportResponse {
	data: Array<{
		direction: "outbound" | "inbound";
		parts: number;
		cost: {
			amount: string;
			currency: string;
		};
	}>;
	meta: {
		total_results: number;
	};
}

/**
 * Telnyx Usage Client
 * Requires TELNYX_API_KEY environment variable
 */
export class TelnyxUsageClient {
	private baseUrl = "https://api.telnyx.com/v2";
	private apiKey: string;

	constructor() {
		const apiKey = process.env.TELNYX_API_KEY;

		if (!apiKey) {
			console.warn("TELNYX_API_KEY not set - Telnyx usage tracking disabled");
		}

		this.apiKey = apiKey || "";
	}

	private async fetch<T>(
		endpoint: string,
		params?: Record<string, string>,
	): Promise<T | null> {
		if (!this.apiKey) {
			return null;
		}

		const url = new URL(`${this.baseUrl}${endpoint}`);
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value);
			});
		}

		try {
			const response = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				console.error(
					`Telnyx API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			return (await response.json()) as T;
		} catch (error) {
			console.error("Telnyx API fetch error:", error);
			return null;
		}
	}

	/**
	 * Get the current month's date range
	 */
	private getCurrentMonthRange(): { startDate: string; endDate: string } {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const endOfMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
		);

		return {
			startDate: startOfMonth.toISOString(),
			endDate: endOfMonth.toISOString(),
		};
	}

	/**
	 * Get voice CDR usage report
	 * Synchronous endpoint - may take up to a couple minutes
	 */
	async getVoiceUsage(
		startDate?: string,
		endDate?: string,
	): Promise<TelnyxVoiceUsage | null> {
		const dateRange =
			startDate && endDate
				? { startDate, endDate }
				: this.getCurrentMonthRange();

		const response = await this.fetch<CdrUsageReportResponse>(
			"/reports/cdr_usage_reports/sync",
			{
				start_date: dateRange.startDate,
				end_date: dateRange.endDate,
			},
		);

		if (!response?.data) {
			return null;
		}

		const { aggregations, records } = response.data;

		// Calculate inbound vs outbound from records if available
		let inboundMinutes = 0;
		let outboundMinutes = 0;

		if (records) {
			for (const record of records) {
				const minutes = record.duration / 60; // Convert seconds to minutes
				if (record.direction === "inbound") {
					inboundMinutes += minutes;
				} else {
					outboundMinutes += minutes;
				}
			}
		}

		return {
			total_minutes: aggregations.total_duration / 60, // Convert seconds to minutes
			inbound_minutes: inboundMinutes,
			outbound_minutes: outboundMinutes,
			total_calls: aggregations.record_count,
			total_cost_cents: Math.round(aggregations.total_cost * 100), // Convert to cents
		};
	}

	/**
	 * Get SMS/MMS messaging usage
	 * Note: API can only retrieve messages from the last 10 days
	 * For older messages, use MDR reports
	 */
	async getSmsUsage(
		startDate?: string,
		endDate?: string,
	): Promise<TelnyxSmsUsage | null> {
		// For current month, we may need to use MDR reports for full data
		// The messages endpoint is limited to 10 days
		const now = new Date();
		const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

		const response = await this.fetch<MessagingReportResponse>("/messages", {
			"page[size]": "250",
			"filter[created_at][gte]": tenDaysAgo.toISOString(),
			"filter[created_at][lte]": now.toISOString(),
		});

		if (!response?.data) {
			return null;
		}

		let outboundMessages = 0;
		let inboundMessages = 0;
		let totalCostCents = 0;

		for (const message of response.data) {
			if (message.direction === "outbound") {
				outboundMessages += message.parts;
			} else {
				inboundMessages += message.parts;
			}
			totalCostCents += Math.round(parseFloat(message.cost.amount) * 100);
		}

		return {
			total_messages: outboundMessages + inboundMessages,
			outbound_messages: outboundMessages,
			inbound_messages: inboundMessages,
			total_cost_cents: totalCostCents,
		};
	}

	/**
	 * Get combined voice and SMS usage for current month
	 */
	async getCurrentMonthUsage(): Promise<{
		voice: TelnyxVoiceUsage | null;
		sms: TelnyxSmsUsage | null;
		total_cost_cents: number;
	}> {
		const [voice, sms] = await Promise.all([
			this.getVoiceUsage(),
			this.getSmsUsage(),
		]);

		return {
			voice,
			sms,
			total_cost_cents:
				(voice?.total_cost_cents || 0) + (sms?.total_cost_cents || 0),
		};
	}

	/**
	 * Check if the Telnyx API is healthy
	 */
	async checkHealth(): Promise<{
		healthy: boolean;
		responseTimeMs: number;
		error?: string;
	}> {
		const startTime = Date.now();

		try {
			const response = await fetch(`${this.baseUrl}/connections`, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			});

			const responseTimeMs = Date.now() - startTime;

			if (response.ok) {
				return { healthy: true, responseTimeMs };
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
export const telnyxUsageClient = new TelnyxUsageClient();
