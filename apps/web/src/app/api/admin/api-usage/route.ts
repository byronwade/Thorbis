/**
 * Admin API: Get API Usage Data
 *
 * Returns current usage, costs, and free tier status for all APIs.
 * Used by the admin dashboard to display real-time cost tracking.
 */

import { NextResponse } from "next/server";
import { getSystemHealthSummary } from "@/lib/api/health-check-service";
import {
	getServicesApproachingLimits,
	getUsageSummary,
} from "@/lib/api/usage-sync-service";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		// Verify admin access
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user is admin (you may want to add proper admin check here)
		const { data: userData } = await supabase
			.from("users")
			.select("role")
			.eq("id", user.id)
			.single();

		if (userData?.role !== "admin" && userData?.role !== "super_admin") {
			return NextResponse.json(
				{ error: "Admin access required" },
				{ status: 403 },
			);
		}

		// Get usage summary
		const usageSummary = await getUsageSummary();

		// Get services approaching limits
		const approachingLimits = await getServicesApproachingLimits();

		// Get health summary
		const healthSummary = await getSystemHealthSummary();

		// Calculate monthly cost estimate
		const currentDay = new Date().getDate();
		const daysInMonth = new Date(
			new Date().getFullYear(),
			new Date().getMonth() + 1,
			0,
		).getDate();
		const projectedMonthlyCost = usageSummary
			? Math.round((usageSummary.total_cost_cents / currentDay) * daysInMonth)
			: 0;

		return NextResponse.json({
			success: true,
			data: {
				usage: usageSummary,
				approaching_limits: approachingLimits,
				health: healthSummary,
				projections: {
					current_cost_cents: usageSummary?.total_cost_cents || 0,
					projected_monthly_cost_cents: projectedMonthlyCost,
					days_remaining: daysInMonth - currentDay,
				},
			},
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("Failed to fetch API usage:", message);
		return NextResponse.json(
			{ error: "Failed to fetch usage data", details: message },
			{ status: 500 },
		);
	}
}
