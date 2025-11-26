/**
 * Supabase Management API Usage Client
 *
 * Fetches real usage data from Supabase Management API
 * Docs: https://supabase.com/docs/reference/api/introduction
 */

export interface SupabaseUsageStats {
	total_auth_requests: number;
	total_realtime_requests: number;
	total_rest_requests: number;
	total_storage_requests: number;
	timestamp: string;
}

export interface SupabaseProjectStats {
	database_size_bytes: number;
	storage_size_bytes: number;
	egress_bytes: number;
	mau: number;
	edge_function_invocations: number;
}

interface ApiCountsResponse {
	data: Array<{
		total_auth_requests: number;
		total_realtime_requests: number;
		total_rest_requests: number;
		total_storage_requests: number;
		timestamp: string;
	}>;
}

/**
 * Supabase Usage Client
 * Requires SUPABASE_MANAGEMENT_PAT environment variable
 */
export class SupabaseUsageClient {
	private baseUrl = "https://api.supabase.com/v1";
	private accessToken: string;
	private projectRef: string;

	constructor() {
		const token = process.env.SUPABASE_MANAGEMENT_PAT;
		const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
			/https:\/\/([^.]+)\.supabase\.co/,
		)?.[1];

		if (!token) {
			console.warn(
				"SUPABASE_MANAGEMENT_PAT not set - Supabase usage tracking disabled",
			);
		}

		this.accessToken = token || "";
		this.projectRef = projectRef || "";
	}

	private async fetch<T>(
		endpoint: string,
		params?: Record<string, string>,
	): Promise<T | null> {
		if (!this.accessToken || !this.projectRef) {
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
					Authorization: `Bearer ${this.accessToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				console.error(
					`Supabase API error: ${response.status} ${response.statusText}`,
				);
				return null;
			}

			return (await response.json()) as T;
		} catch (error) {
			console.error("Supabase API fetch error:", error);
			return null;
		}
	}

	/**
	 * Get API request counts for the project
	 * Returns auth, realtime, rest, and storage request counts
	 */
	async getApiCounts(
		interval: "hourly" | "daily" = "daily",
	): Promise<SupabaseUsageStats[] | null> {
		const response = await this.fetch<ApiCountsResponse>(
			`/projects/${this.projectRef}/analytics/endpoints/usage.api-counts`,
			{
				interval,
			},
		);

		return response?.data || null;
	}

	/**
	 * Get total API request count for the project
	 */
	async getTotalApiRequestCount(): Promise<number | null> {
		const response = await this.fetch<{ count: number }>(
			`/projects/${this.projectRef}/analytics/endpoints/usage.api-requests-count`,
		);

		return response?.count || null;
	}

	/**
	 * Get project database size
	 */
	async getDatabaseSize(): Promise<number | null> {
		// This would require querying the database directly
		// The Management API doesn't expose database size directly
		// We can get this from pg_database_size() if needed
		return null;
	}

	/**
	 * Get aggregated usage for the current billing period
	 */
	async getCurrentPeriodUsage(): Promise<{
		auth_requests: number;
		rest_requests: number;
		realtime_requests: number;
		storage_requests: number;
		total_requests: number;
	} | null> {
		const stats = await this.getApiCounts("daily");
		if (!stats || stats.length === 0) {
			return null;
		}

		// Aggregate all stats for the current period
		const aggregated = stats.reduce(
			(acc, stat) => ({
				auth_requests: acc.auth_requests + stat.total_auth_requests,
				rest_requests: acc.rest_requests + stat.total_rest_requests,
				realtime_requests: acc.realtime_requests + stat.total_realtime_requests,
				storage_requests: acc.storage_requests + stat.total_storage_requests,
				total_requests:
					acc.total_requests +
					stat.total_auth_requests +
					stat.total_rest_requests +
					stat.total_realtime_requests +
					stat.total_storage_requests,
			}),
			{
				auth_requests: 0,
				rest_requests: 0,
				realtime_requests: 0,
				storage_requests: 0,
				total_requests: 0,
			},
		);

		return aggregated;
	}

	/**
	 * Check if the Supabase API is healthy
	 */
	async checkHealth(): Promise<{
		healthy: boolean;
		responseTimeMs: number;
		error?: string;
	}> {
		const startTime = Date.now();

		try {
			const response = await fetch(`${this.baseUrl}/projects`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
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
export const supabaseUsageClient = new SupabaseUsageClient();
