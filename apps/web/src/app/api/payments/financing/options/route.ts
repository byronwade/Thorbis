/**
 * Financing Options API Route
 *
 * Returns available financing options for a given amount and company.
 */

import { type NextRequest, NextResponse } from "next/server";
import {
	type FinancingProvider,
	getFinancingOptions,
	isFinancingEnabled,
} from "@/lib/payments/financing/financing-service";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ success: false, error: "Database unavailable" },
				{ status: 503 },
			);
		}

		// Verify authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const searchParams = request.nextUrl.searchParams;
		const companyId = searchParams.get("companyId");
		const amount = parseFloat(searchParams.get("amount") || "0");

		if (!companyId) {
			return NextResponse.json(
				{ success: false, error: "Company ID required" },
				{ status: 400 },
			);
		}

		if (amount <= 0) {
			return NextResponse.json(
				{ success: false, error: "Valid amount required" },
				{ status: 400 },
			);
		}

		// Check if financing is enabled
		const { enabled, providers } = await isFinancingEnabled(companyId);

		if (!enabled) {
			return NextResponse.json({
				success: true,
				options: {
					affirm: [],
					klarna: [],
					wisetack: [],
				},
				message: "Financing not configured for this company",
			});
		}

		// Get options from each enabled provider
		const options: Record<
			FinancingProvider,
			Awaited<ReturnType<typeof getFinancingOptions>>
		> = {
			affirm: [],
			klarna: [],
			wisetack: [],
		};

		await Promise.all(
			providers.map(async (provider) => {
				try {
					options[provider] = await getFinancingOptions(
						companyId,
						amount,
						provider,
					);
				} catch (error) {
					console.error(
						`[Financing] Error getting ${provider} options:`,
						error,
					);
				}
			}),
		);

		return NextResponse.json({
			success: true,
			options,
			providers,
		});
	} catch (error) {
		console.error("[Financing] Options error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal error",
			},
			{ status: 500 },
		);
	}
}
