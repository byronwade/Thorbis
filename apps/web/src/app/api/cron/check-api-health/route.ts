/**
 * Cron Job: Check API Health
 *
 * Monitors availability and response times for all external APIs.
 * Runs every 5 minutes to track uptime percentages.
 *
 * Configure in vercel.json with schedule: "every 5 minutes"
 * or use cron expression: 0,5,10,15,20,25,30,35,40,45,50,55 * * * *
 */

import { NextResponse } from "next/server";
import {
	getSystemHealthSummary,
	runHealthChecks,
} from "@/lib/api/health-check-service";

export const maxDuration = 60; // 1 minute max

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
		// Run health checks on all services
		const healthResult = await runHealthChecks();

		// Get overall system health
		const systemHealth = await getSystemHealthSummary();

		// Log critical issues
		const downServices = healthResult.results.filter((r) => !r.healthy);
		for (const service of downServices) {
			console.error(
				`SERVICE DOWN: ${service.service_id} - ${service.error || "Unknown error"}`,
			);
		}

		// Alert if overall system is degraded or critical
		if (systemHealth.overall_status === "critical") {
			console.error(
				`CRITICAL: System health is critical. ${systemHealth.down_services} services are down.`,
			);
		} else if (systemHealth.overall_status === "degraded") {
			console.warn(
				`WARNING: System health is degraded. ${systemHealth.degraded_services} services are degraded.`,
			);
		}

		return NextResponse.json({
			success: true,
			job_id: healthResult.job_id,
			started_at: healthResult.started_at,
			completed_at: healthResult.completed_at,
			summary: {
				total_services: healthResult.total_services,
				healthy: healthResult.healthy,
				unhealthy: healthResult.unhealthy,
			},
			system_health: {
				overall_status: systemHealth.overall_status,
				healthy_services: systemHealth.healthy_services,
				degraded_services: systemHealth.degraded_services,
				down_services: systemHealth.down_services,
				average_uptime_24h: systemHealth.average_uptime_24h,
			},
			results: healthResult.results,
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("API health check failed:", message);
		return NextResponse.json(
			{ error: "Health check failed", details: message },
			{ status: 500 },
		);
	}
}
