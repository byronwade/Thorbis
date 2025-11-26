/**
 * Cron Job: Sync API Usage Data
 *
 * Fetches real usage data from all external API providers and syncs to database.
 * Runs hourly to keep usage data current.
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-api-usage",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */

import { NextResponse } from "next/server";
import {
	getServicesApproachingLimits,
	syncAllUsage,
} from "@/lib/api/usage-sync-service";

export const maxDuration = 120; // 2 minutes max

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	const cronSecret = process.env.CRON_SECRET;

	if (!cronSecret) {
		return NextResponse.json(
			{ error: "Cron secret not configured" },
			{ status: 500 },
		);
	}

	if (authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		// Sync all provider usage data
		const syncResult = await syncAllUsage();

		// Get services approaching limits for alerting
		const approachingLimits = await getServicesApproachingLimits();

		// Log warnings for services near limits
		for (const service of approachingLimits) {
			if (service.alert_level === "critical") {
				console.error(
					`CRITICAL: ${service.display_name} at ${service.percentage_used}% of free tier (${service.usage_count}/${service.free_tier_limit})`,
				);
			} else if (service.alert_level === "warning") {
				console.warn(
					`WARNING: ${service.display_name} at ${service.percentage_used}% of free tier (${service.usage_count}/${service.free_tier_limit})`,
				);
			}
		}

		return NextResponse.json({
			success: true,
			job_id: syncResult.job_id,
			started_at: syncResult.started_at,
			completed_at: syncResult.completed_at,
			summary: {
				total_services: syncResult.total_services,
				successful: syncResult.successful,
				failed: syncResult.failed,
			},
			services_approaching_limits: approachingLimits.length,
			approaching_limits: approachingLimits,
			results: syncResult.results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("API usage sync failed:", message);
		return NextResponse.json(
			{ error: "Sync failed", details: message },
			{ status: 500 },
		);
	}
}
