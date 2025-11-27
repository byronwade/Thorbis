/**
 * API Health Check Service
 *
 * Monitors availability and response times for all external APIs
 * Calculates uptime percentages and tracks service health history
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import { API_SERVICES } from "./api-service-config";
import { googleCloudClient } from "./providers/google-cloud-client";
import { stripeBillingClient } from "./providers/stripe-billing-client";
import { supabaseUsageClient } from "./providers/supabase-usage-client";
// Twilio health checks are done via simple HTTP endpoint check

export interface HealthCheckResult {
	service_id: string;
	healthy: boolean;
	response_time_ms: number;
	error?: string;
	checked_at: string;
}

export interface ServiceHealthStatus {
	service_id: string;
	display_name: string;
	category: string;
	current_status: "healthy" | "degraded" | "down";
	uptime_24h: number;
	uptime_7d: number;
	uptime_30d: number;
	average_response_ms: number;
	last_checked: string | null;
	last_error: string | null;
	consecutive_failures: number;
}

export interface HealthCheckJobResult {
	job_id: string;
	started_at: string;
	completed_at: string;
	total_services: number;
	healthy: number;
	unhealthy: number;
	results: HealthCheckResult[];
}

/**
 * Health check endpoints for each service
 */
const HEALTH_ENDPOINTS: Record<
	string,
	{
		check: () => Promise<{
			healthy: boolean;
			responseTimeMs: number;
			error?: string;
		}>;
	}
> = {
	// Twilio
	twilio_voice: {
		check: () => checkHttpEndpoint("https://api.twilio.com/2010-04-01", "Twilio"),
	},
	twilio_sms: {
		check: () => checkHttpEndpoint("https://api.twilio.com/2010-04-01", "Twilio"),
	},

	// Supabase
	supabase_database: { check: () => supabaseUsageClient.checkHealth() },
	supabase_auth: { check: () => supabaseUsageClient.checkHealth() },
	supabase_storage: { check: () => supabaseUsageClient.checkHealth() },
	supabase_realtime: { check: () => supabaseUsageClient.checkHealth() },

	// Google Cloud
	google_gemini: { check: () => googleCloudClient.checkHealth() },
	google_maps_geocoding: { check: () => checkGoogleMapsHealth() },

	// Stripe
	stripe_payments: { check: () => stripeBillingClient.checkHealth() },

	// External APIs - simple HTTP checks
	sendgrid: {
		check: () => checkHttpEndpoint("https://api.sendgrid.com/v3/mail/send", "SendGrid"),
	},
	assembly_ai: {
		check: () =>
			checkHttpEndpoint(
				"https://api.assemblyai.com/v2/transcript",
				"AssemblyAI",
			),
	},
	walkscore: {
		check: () =>
			checkHttpEndpoint("https://api.walkscore.com/score", "WalkScore"),
	},
	census_bureau: {
		check: () =>
			checkHttpEndpoint("https://api.census.gov/data.json", "Census Bureau"),
	},

	// Vercel
	vercel_hosting: { check: () => checkVercelHealth() },
};

/**
 * Run health checks on all configured services
 */
export async function runHealthChecks(): Promise<HealthCheckJobResult> {
	const supabase = createServiceSupabaseClient();
	const jobId = crypto.randomUUID();
	const startedAt = new Date().toISOString();
	const results: HealthCheckResult[] = [];

	// Run all health checks in parallel
	const checkPromises = Object.entries(HEALTH_ENDPOINTS).map(
		async ([serviceId, { check }]) => {
			try {
				const result = await check();
				return {
					service_id: serviceId,
					healthy: result.healthy,
					response_time_ms: result.responseTimeMs,
					error: result.error,
					checked_at: new Date().toISOString(),
				};
			} catch (error) {
				return {
					service_id: serviceId,
					healthy: false,
					response_time_ms: 0,
					error: error instanceof Error ? error.message : "Health check failed",
					checked_at: new Date().toISOString(),
				};
			}
		},
	);

	const checkResults = await Promise.allSettled(checkPromises);

	for (const result of checkResults) {
		if (result.status === "fulfilled") {
			results.push(result.value);
		}
	}

	// Save health check results to database
	for (const result of results) {
		// Insert health log entry
		await supabase.from("api_health_log").insert({
			service_id: result.service_id,
			is_healthy: result.healthy,
			response_time_ms: result.response_time_ms,
			error_message: result.error || null,
			checked_at: result.checked_at,
		});

		// Update service config with health status
		await supabase
			.from("api_service_config")
			.update({
				is_healthy: result.healthy,
				last_checked: result.checked_at,
				last_response_time_ms: result.response_time_ms,
			})
			.eq("service_id", result.service_id);
	}

	const completedAt = new Date().toISOString();
	const healthy = results.filter((r) => r.healthy).length;
	const unhealthy = results.filter((r) => !r.healthy).length;

	return {
		job_id: jobId,
		started_at: startedAt,
		completed_at: completedAt,
		total_services: results.length,
		healthy,
		unhealthy,
		results,
	};
}

/**
 * Get current health status for all services
 */
export async function getServiceHealthStatus(): Promise<ServiceHealthStatus[]> {
	const supabase = createServiceSupabaseClient();

	// Get recent health logs
	const now = new Date();
	const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

	const results: ServiceHealthStatus[] = [];

	for (const [serviceId, config] of Object.entries(API_SERVICES)) {
		// Skip services without health checks
		if (!HEALTH_ENDPOINTS[serviceId]) {
			continue;
		}

		// Get health logs for different time periods
		const { data: logs24h } = await supabase
			.from("api_health_log")
			.select("is_healthy, response_time_ms")
			.eq("service_id", serviceId)
			.gte("checked_at", twentyFourHoursAgo.toISOString());

		const { data: logs7d } = await supabase
			.from("api_health_log")
			.select("is_healthy")
			.eq("service_id", serviceId)
			.gte("checked_at", sevenDaysAgo.toISOString());

		const { data: logs30d } = await supabase
			.from("api_health_log")
			.select("is_healthy")
			.eq("service_id", serviceId)
			.gte("checked_at", thirtyDaysAgo.toISOString());

		// Get most recent log
		const { data: latestLog } = await supabase
			.from("api_health_log")
			.select("*")
			.eq("service_id", serviceId)
			.order("checked_at", { ascending: false })
			.limit(1)
			.single();

		// Calculate uptimes
		const calculateUptime = (
			logs: Array<{ is_healthy: boolean }> | null,
		): number => {
			if (!logs || logs.length === 0) return 100;
			const healthy = logs.filter((l) => l.is_healthy).length;
			return Math.round((healthy / logs.length) * 10000) / 100;
		};

		// Calculate average response time
		const calculateAvgResponseTime = (
			logs: Array<{ response_time_ms: number }> | null,
		): number => {
			if (!logs || logs.length === 0) return 0;
			const total = logs.reduce((sum, l) => sum + (l.response_time_ms || 0), 0);
			return Math.round(total / logs.length);
		};

		// Count consecutive failures
		const { data: recentLogs } = await supabase
			.from("api_health_log")
			.select("is_healthy")
			.eq("service_id", serviceId)
			.order("checked_at", { ascending: false })
			.limit(10);

		let consecutiveFailures = 0;
		if (recentLogs) {
			for (const log of recentLogs) {
				if (!log.is_healthy) {
					consecutiveFailures++;
				} else {
					break;
				}
			}
		}

		// Determine current status
		let currentStatus: "healthy" | "degraded" | "down" = "healthy";
		const uptime24h = calculateUptime(logs24h);

		if (consecutiveFailures >= 3 || uptime24h < 50) {
			currentStatus = "down";
		} else if (consecutiveFailures >= 1 || uptime24h < 95) {
			currentStatus = "degraded";
		}

		results.push({
			service_id: serviceId,
			display_name: config.display_name,
			category: config.category,
			current_status: currentStatus,
			uptime_24h: uptime24h,
			uptime_7d: calculateUptime(logs7d),
			uptime_30d: calculateUptime(logs30d),
			average_response_ms: calculateAvgResponseTime(logs24h),
			last_checked: latestLog?.checked_at || null,
			last_error: latestLog?.error_message || null,
			consecutive_failures: consecutiveFailures,
		});
	}

	return results;
}

/**
 * Get overall system health summary
 */
export async function getSystemHealthSummary(): Promise<{
	overall_status: "healthy" | "degraded" | "critical";
	healthy_services: number;
	degraded_services: number;
	down_services: number;
	average_uptime_24h: number;
	services: ServiceHealthStatus[];
}> {
	const services = await getServiceHealthStatus();

	const healthy = services.filter((s) => s.current_status === "healthy").length;
	const degraded = services.filter(
		(s) => s.current_status === "degraded",
	).length;
	const down = services.filter((s) => s.current_status === "down").length;

	// Calculate average 24h uptime
	const avgUptime =
		services.length > 0
			? services.reduce((sum, s) => sum + s.uptime_24h, 0) / services.length
			: 100;

	// Determine overall status
	let overallStatus: "healthy" | "degraded" | "critical" = "healthy";
	if (down > 0 || avgUptime < 90) {
		overallStatus = "critical";
	} else if (degraded > 0 || avgUptime < 99) {
		overallStatus = "degraded";
	}

	return {
		overall_status: overallStatus,
		healthy_services: healthy,
		degraded_services: degraded,
		down_services: down,
		average_uptime_24h: Math.round(avgUptime * 100) / 100,
		services,
	};
}

/**
 * Helper: Check a simple HTTP endpoint
 */
async function checkHttpEndpoint(
	url: string,
	serviceName: string,
): Promise<{ healthy: boolean; responseTimeMs: number; error?: string }> {
	const startTime = Date.now();

	try {
		const response = await fetch(url, {
			method: "HEAD",
			signal: AbortSignal.timeout(10000), // 10 second timeout
		});

		const responseTimeMs = Date.now() - startTime;

		// Consider 2xx-4xx as healthy (API is responding)
		// 5xx indicates server issues
		if (response.status < 500) {
			return { healthy: true, responseTimeMs };
		}

		return {
			healthy: false,
			responseTimeMs,
			error: `HTTP ${response.status}`,
		};
	} catch (error) {
		return {
			healthy: false,
			responseTimeMs: Date.now() - startTime,
			error: error instanceof Error ? error.message : "Connection failed",
		};
	}
}

/**
 * Helper: Check Google Maps API health
 */
async function checkGoogleMapsHealth(): Promise<{
	healthy: boolean;
	responseTimeMs: number;
	error?: string;
}> {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	if (!apiKey) {
		return {
			healthy: true,
			responseTimeMs: 0,
			error: "API key not configured",
		};
	}

	return checkHttpEndpoint(
		`https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`,
		"Google Maps",
	);
}

/**
 * Helper: Check Vercel hosting health
 */
async function checkVercelHealth(): Promise<{
	healthy: boolean;
	responseTimeMs: number;
	error?: string;
}> {
	const projectUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;

	if (!projectUrl) {
		return { healthy: true, responseTimeMs: 0, error: "URL not configured" };
	}

	const url = projectUrl.startsWith("http")
		? projectUrl
		: `https://${projectUrl}`;
	return checkHttpEndpoint(`${url}/api/health`, "Vercel");
}

/**
 * Get service health history for charting
 */
export async function getServiceHealthHistory(
	serviceId: string,
	hours: number = 24,
): Promise<
	Array<{
		timestamp: string;
		is_healthy: boolean;
		response_time_ms: number;
	}>
> {
	const supabase = createServiceSupabaseClient();
	const since = new Date(Date.now() - hours * 60 * 60 * 1000);

	const { data, error } = await supabase
		.from("api_health_log")
		.select("checked_at, is_healthy, response_time_ms")
		.eq("service_id", serviceId)
		.gte("checked_at", since.toISOString())
		.order("checked_at", { ascending: true });

	if (error) {
		console.error("Error fetching health history:", error);
		return [];
	}

	return (
		data?.map((log) => ({
			timestamp: log.checked_at,
			is_healthy: log.is_healthy,
			response_time_ms: log.response_time_ms,
		})) || []
	);
}
