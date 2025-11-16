/**
 * Enrichment Usage API Route
 *
 * GET /api/enrichment/usage - Get enrichment usage statistics
 */

import { type NextRequest, NextResponse } from "next/server";
import {
	checkEnrichmentQuota,
	getEnrichmentUsageStats,
} from "@/actions/customer-enrichment";
import { createClient } from "@/lib/supabase/server";

/**
 * GET - Retrieve enrichment usage statistics
 */
export async function GET(request: NextRequest) {
	try {
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

		// Get query parameter to determine what data to return
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type") || "stats";

		if (type === "quota") {
			const result = await checkEnrichmentQuota();
			if (!result.success) {
				return NextResponse.json({ error: result.error }, { status: 500 });
			}
			return NextResponse.json({ data: result.data });
		}

		// Default: return stats
		const result = await getEnrichmentUsageStats();

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json({ data: result.data });
	} catch (_error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
