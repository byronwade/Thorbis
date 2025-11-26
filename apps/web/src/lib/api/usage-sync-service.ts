/**
 * API Usage Sync Service
 *
 * Aggregates usage data from all provider APIs and syncs to database
 * Designed to run on a schedule (cron) or on-demand
 */

import { createServiceSupabaseClient } from "@/lib/supabase/service-client";
import {
	API_SERVICES,
	calculateFreeTierPercentage,
	getAlertLevel,
} from "./api-service-config";
import {
	GoogleAITracker,
	googleCloudClient,
} from "./providers/google-cloud-client";
import { stripeBillingClient } from "./providers/stripe-billing-client";
import { supabaseUsageClient } from "./providers/supabase-usage-client";
import { telnyxUsageClient } from "./providers/telnyx-usage-client";

export interface SyncResult {
	service_id: string;
	success: boolean;
	usage_count?: number;
	cost_cents?: number;
	free_tier_percentage?: number;
	alert_level?: "normal" | "warning" | "critical";
	error?: string;
	synced_at: string;
}

export interface SyncJobResult {
	job_id: string;
	started_at: string;
	completed_at: string;
	total_services: number;
	successful: number;
	failed: number;
	results: SyncResult[];
}

/**
 * Sync all provider usage data to database
 */
export async function syncAllUsage(): Promise<SyncJobResult> {
	const supabase = createServiceSupabaseClient();
	const jobId = crypto.randomUUID();
	const startedAt = new Date().toISOString();
	const results: SyncResult[] = [];

	// Create sync job record
	await supabase.from("api_sync_jobs").insert({
		id: jobId,
		status: "running",
		started_at: startedAt,
	});

	// Sync each provider in parallel
	const syncPromises = [
		syncTelnyxUsage(),
		syncSupabaseUsage(),
		syncGoogleUsage(),
		syncStripeUsage(),
	];

	const syncResults = await Promise.allSettled(syncPromises);

	for (const result of syncResults) {
		if (result.status === "fulfilled") {
			results.push(...result.value);
		} else {
			results.push({
				service_id: "unknown",
				success: false,
				error: result.reason?.message || "Unknown error",
				synced_at: new Date().toISOString(),
			});
		}
	}

	// Save usage data to database
	for (const result of results) {
		if (result.success && result.usage_count !== undefined) {
			const service = API_SERVICES[result.service_id];
			if (service) {
				// Update or insert realtime usage
				await supabase.from("api_usage_realtime").upsert(
					{
						service_id: result.service_id,
						usage_count: result.usage_count,
						cost_cents: result.cost_cents || 0,
						free_tier_remaining: service.free_tier
							? Math.max(
									0,
									service.free_tier.monthly_limit - result.usage_count,
								)
							: null,
						last_synced: result.synced_at,
						month: new Date().toISOString().slice(0, 7),
					},
					{
						onConflict: "service_id,month",
					},
				);

				// Update service config with current usage
				await supabase
					.from("api_service_config")
					.update({
						current_usage: result.usage_count,
						last_checked: result.synced_at,
					})
					.eq("service_id", result.service_id);
			}
		}
	}

	const completedAt = new Date().toISOString();
	const successful = results.filter((r) => r.success).length;
	const failed = results.filter((r) => !r.success).length;

	// Update sync job status
	await supabase
		.from("api_sync_jobs")
		.update({
			status: failed === 0 ? "completed" : "partial",
			completed_at: completedAt,
			results_summary: {
				total: results.length,
				successful,
				failed,
			},
		})
		.eq("id", jobId);

	return {
		job_id: jobId,
		started_at: startedAt,
		completed_at: completedAt,
		total_services: results.length,
		successful,
		failed,
		results,
	};
}

/**
 * Sync Telnyx voice and SMS usage
 */
async function syncTelnyxUsage(): Promise<SyncResult[]> {
	const results: SyncResult[] = [];
	const now = new Date().toISOString();

	try {
		const usage = await telnyxUsageClient.getCurrentMonthUsage();

		// Voice usage
		if (usage.voice) {
			const voiceService = API_SERVICES["telnyx_voice"];
			const usageCount = usage.voice.total_minutes;
			const freeTierPct = voiceService?.free_tier
				? calculateFreeTierPercentage(usageCount, voiceService.free_tier)
				: 0;

			results.push({
				service_id: "telnyx_voice",
				success: true,
				usage_count: usageCount,
				cost_cents: usage.voice.total_cost_cents,
				free_tier_percentage: freeTierPct,
				alert_level: getAlertLevel(freeTierPct),
				synced_at: now,
			});
		} else {
			results.push({
				service_id: "telnyx_voice",
				success: false,
				error: "No voice data returned",
				synced_at: now,
			});
		}

		// SMS usage
		if (usage.sms) {
			const smsService = API_SERVICES["telnyx_sms"];
			const usageCount = usage.sms.total_messages;
			const freeTierPct = smsService?.free_tier
				? calculateFreeTierPercentage(usageCount, smsService.free_tier)
				: 0;

			results.push({
				service_id: "telnyx_sms",
				success: true,
				usage_count: usageCount,
				cost_cents: usage.sms.total_cost_cents,
				free_tier_percentage: freeTierPct,
				alert_level: getAlertLevel(freeTierPct),
				synced_at: now,
			});
		} else {
			results.push({
				service_id: "telnyx_sms",
				success: false,
				error: "No SMS data returned",
				synced_at: now,
			});
		}
	} catch (error) {
		results.push({
			service_id: "telnyx_voice",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			synced_at: now,
		});
		results.push({
			service_id: "telnyx_sms",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			synced_at: now,
		});
	}

	return results;
}

/**
 * Sync Supabase API usage
 */
async function syncSupabaseUsage(): Promise<SyncResult[]> {
	const results: SyncResult[] = [];
	const now = new Date().toISOString();

	try {
		const usage = await supabaseUsageClient.getCurrentPeriodUsage();

		if (usage) {
			// Auth requests
			const authService = API_SERVICES["supabase_auth"];
			const authFreeTierPct = authService?.free_tier
				? calculateFreeTierPercentage(
						usage.auth_requests,
						authService.free_tier,
					)
				: 0;

			results.push({
				service_id: "supabase_auth",
				success: true,
				usage_count: usage.auth_requests,
				cost_cents: 0, // Free tier
				free_tier_percentage: authFreeTierPct,
				alert_level: getAlertLevel(authFreeTierPct),
				synced_at: now,
			});

			// Database requests (REST API)
			const dbService = API_SERVICES["supabase_database"];
			const dbFreeTierPct = dbService?.free_tier
				? calculateFreeTierPercentage(usage.rest_requests, dbService.free_tier)
				: 0;

			results.push({
				service_id: "supabase_database",
				success: true,
				usage_count: usage.rest_requests,
				cost_cents: 0,
				free_tier_percentage: dbFreeTierPct,
				alert_level: getAlertLevel(dbFreeTierPct),
				synced_at: now,
			});

			// Realtime requests
			const realtimeService = API_SERVICES["supabase_realtime"];
			const realtimeFreeTierPct = realtimeService?.free_tier
				? calculateFreeTierPercentage(
						usage.realtime_requests,
						realtimeService.free_tier,
					)
				: 0;

			results.push({
				service_id: "supabase_realtime",
				success: true,
				usage_count: usage.realtime_requests,
				cost_cents: 0,
				free_tier_percentage: realtimeFreeTierPct,
				alert_level: getAlertLevel(realtimeFreeTierPct),
				synced_at: now,
			});

			// Storage requests
			const storageService = API_SERVICES["supabase_storage"];
			const storageFreeTierPct = storageService?.free_tier
				? calculateFreeTierPercentage(
						usage.storage_requests,
						storageService.free_tier,
					)
				: 0;

			results.push({
				service_id: "supabase_storage",
				success: true,
				usage_count: usage.storage_requests,
				cost_cents: 0,
				free_tier_percentage: storageFreeTierPct,
				alert_level: getAlertLevel(storageFreeTierPct),
				synced_at: now,
			});
		} else {
			results.push({
				service_id: "supabase_database",
				success: false,
				error: "No usage data returned",
				synced_at: now,
			});
		}
	} catch (error) {
		results.push({
			service_id: "supabase_database",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			synced_at: now,
		});
	}

	return results;
}

/**
 * Sync Google Cloud/AI usage
 * Note: For accurate Google AI usage, internal tracking is required
 */
async function syncGoogleUsage(): Promise<SyncResult[]> {
	const results: SyncResult[] = [];
	const now = new Date().toISOString();

	try {
		const aiUsage = await googleCloudClient.getAIUsage();
		const mapsUsage = await googleCloudClient.getMapsUsage();

		// Gemini AI
		if (aiUsage) {
			const geminiService = API_SERVICES["google_gemini"];
			// For Gemini, we track requests/tokens - need internal tracking
			results.push({
				service_id: "google_gemini",
				success: true,
				usage_count: aiUsage.gemini_requests,
				cost_cents: aiUsage.total_cost_cents,
				free_tier_percentage: 0, // Calculated internally
				alert_level: "normal",
				synced_at: now,
			});
		}

		// Google Maps
		if (mapsUsage) {
			const mapsService = API_SERVICES["google_maps_geocoding"];
			const usageCount = mapsUsage.geocoding_requests;
			const freeTierPct = mapsService?.free_tier
				? calculateFreeTierPercentage(usageCount, mapsService.free_tier)
				: 0;

			results.push({
				service_id: "google_maps_geocoding",
				success: true,
				usage_count: usageCount,
				cost_cents: mapsUsage.total_cost_cents,
				free_tier_percentage: freeTierPct,
				alert_level: getAlertLevel(freeTierPct),
				synced_at: now,
			});
		}
	} catch (error) {
		results.push({
			service_id: "google_gemini",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			synced_at: now,
		});
	}

	return results;
}

/**
 * Sync Stripe billing/fees
 */
async function syncStripeUsage(): Promise<SyncResult[]> {
	const results: SyncResult[] = [];
	const now = new Date().toISOString();

	try {
		const stats = await stripeBillingClient.getCurrentMonthStats();

		if (stats) {
			results.push({
				service_id: "stripe_payments",
				success: true,
				usage_count: stats.transaction_count,
				cost_cents: stats.fees_cents,
				free_tier_percentage: 0, // Stripe has no free tier
				alert_level: "normal",
				synced_at: now,
			});
		} else {
			results.push({
				service_id: "stripe_payments",
				success: false,
				error: "No billing data returned",
				synced_at: now,
			});
		}
	} catch (error) {
		results.push({
			service_id: "stripe_payments",
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			synced_at: now,
		});
	}

	return results;
}

/**
 * Get current usage summary from database
 */
export async function getUsageSummary(): Promise<{
	services: Array<{
		service_id: string;
		display_name: string;
		category: string;
		usage_count: number;
		cost_cents: number;
		free_tier_remaining: number | null;
		free_tier_percentage: number;
		alert_level: string;
		last_synced: string | null;
	}>;
	total_cost_cents: number;
	services_at_risk: number;
} | null> {
	const supabase = createServiceSupabaseClient();

	// Get current month's usage
	const currentMonth = new Date().toISOString().slice(0, 7);

	const { data: usageData, error: usageError } = await supabase
		.from("api_usage_realtime")
		.select("*")
		.eq("month", currentMonth);

	if (usageError) {
		console.error("Error fetching usage:", usageError);
		return null;
	}

	// Build summary from config + usage data
	const services = Object.entries(API_SERVICES).map(([serviceId, config]) => {
		const usage = usageData?.find((u) => u.service_id === serviceId);
		const usageCount = usage?.usage_count || 0;
		const costCents = usage?.cost_cents || 0;
		const freeTierRemaining = usage?.free_tier_remaining;
		const freeTierPct = config.free_tier
			? calculateFreeTierPercentage(usageCount, config.free_tier)
			: 0;

		return {
			service_id: serviceId,
			display_name: config.display_name,
			category: config.category,
			usage_count: usageCount,
			cost_cents: costCents,
			free_tier_remaining: freeTierRemaining,
			free_tier_percentage: freeTierPct,
			alert_level: getAlertLevel(freeTierPct),
			last_synced: usage?.last_synced || null,
		};
	});

	const totalCostCents = services.reduce((sum, s) => sum + s.cost_cents, 0);
	const servicesAtRisk = services.filter(
		(s) => s.alert_level === "warning" || s.alert_level === "critical",
	).length;

	return {
		services,
		total_cost_cents: totalCostCents,
		services_at_risk: servicesAtRisk,
	};
}

/**
 * Get services approaching their free tier limits
 */
export async function getServicesApproachingLimits(): Promise<
	Array<{
		service_id: string;
		display_name: string;
		usage_count: number;
		free_tier_limit: number;
		percentage_used: number;
		alert_level: string;
	}>
> {
	const summary = await getUsageSummary();
	if (!summary) return [];

	return summary.services
		.filter((s) => s.alert_level === "warning" || s.alert_level === "critical")
		.map((s) => {
			const config = API_SERVICES[s.service_id];
			return {
				service_id: s.service_id,
				display_name: s.display_name,
				usage_count: s.usage_count,
				free_tier_limit: config?.free_tier?.monthly_limit || 0,
				percentage_used: s.free_tier_percentage,
				alert_level: s.alert_level,
			};
		})
		.sort((a, b) => b.percentage_used - a.percentage_used);
}

/**
 * Track internal API usage (for APIs without external tracking)
 */
export async function trackInternalUsage(
	serviceId: string,
	incrementBy: number = 1,
	costCents: number = 0,
): Promise<void> {
	const supabase = createServiceSupabaseClient();
	const currentMonth = new Date().toISOString().slice(0, 7);

	// Upsert usage record
	const { data: existing } = await supabase
		.from("api_usage_realtime")
		.select("usage_count, cost_cents")
		.eq("service_id", serviceId)
		.eq("month", currentMonth)
		.single();

	const newUsageCount = (existing?.usage_count || 0) + incrementBy;
	const newCostCents = (existing?.cost_cents || 0) + costCents;

	const service = API_SERVICES[serviceId];
	const freeTierRemaining = service?.free_tier
		? Math.max(0, service.free_tier.monthly_limit - newUsageCount)
		: null;

	await supabase.from("api_usage_realtime").upsert(
		{
			service_id: serviceId,
			month: currentMonth,
			usage_count: newUsageCount,
			cost_cents: newCostCents,
			free_tier_remaining: freeTierRemaining,
			last_synced: new Date().toISOString(),
		},
		{
			onConflict: "service_id,month",
		},
	);
}
