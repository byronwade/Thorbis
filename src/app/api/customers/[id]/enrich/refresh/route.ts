/**
 * Customer Enrichment Refresh API Route
 *
 * POST /api/customers/[id]/enrich/refresh - Force refresh enrichment data
 */

import { type NextRequest, NextResponse } from "next/server";
import { refreshEnrichment } from "@/actions/customer-enrichment";
import { createClient } from "@/lib/supabase/server";

/**
 * POST - Force refresh enrichment data
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const supabase = await createClient();

		if (!supabase) {
			return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await refreshEnrichment(id);

		if (!result.success) {
			const statusCode =
				result.error === "Customer not found" ? 404 : result.error?.includes("limit reached") ? 429 : 500;

			return NextResponse.json({ error: result.error }, { status: statusCode });
		}

		return NextResponse.json({ data: result.data }, { status: 200 });
	} catch (_error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
