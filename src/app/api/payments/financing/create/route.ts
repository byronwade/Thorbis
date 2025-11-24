/**
 * Create Financing Offer API Route
 *
 * Creates a new financing offer and returns the application URL.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
	createFinancingOffer,
	type FinancingProvider,
} from "@/lib/payments/financing/financing-service";

interface CreateOfferRequest {
	companyId: string;
	customerId?: string;
	invoiceId?: string;
	jobId?: string;
	amount: number;
	provider: FinancingProvider;
	customerEmail?: string;
	customerPhone?: string;
	customerName?: string;
	returnUrl?: string;
	cancelUrl?: string;
}

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ success: false, error: "Database unavailable" },
				{ status: 503 }
			);
		}

		// Verify authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body: CreateOfferRequest = await request.json();

		// Validate required fields
		if (!body.companyId || !body.amount || !body.provider) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate provider
		const validProviders: FinancingProvider[] = ["affirm", "klarna", "wisetack"];
		if (!validProviders.includes(body.provider)) {
			return NextResponse.json(
				{ success: false, error: "Invalid financing provider" },
				{ status: 400 }
			);
		}

		// Verify user has access to this company
		const { data: membership } = await supabase
			.from("company_memberships")
			.select("role")
			.eq("user_id", user.id)
			.eq("company_id", body.companyId)
			.eq("status", "active")
			.single();

		if (!membership) {
			return NextResponse.json(
				{ success: false, error: "Access denied to this company" },
				{ status: 403 }
			);
		}

		// Create the financing offer
		const result = await createFinancingOffer({
			companyId: body.companyId,
			customerId: body.customerId,
			invoiceId: body.invoiceId,
			jobId: body.jobId,
			amount: body.amount,
			provider: body.provider,
			customerEmail: body.customerEmail,
			customerPhone: body.customerPhone,
			customerName: body.customerName,
			returnUrl: body.returnUrl,
			cancelUrl: body.cancelUrl,
		});

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.error },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			offerId: result.offerId,
			applicationUrl: result.applicationUrl,
			expiresAt: result.expiresAt,
			offers: result.offers,
		});
	} catch (error) {
		console.error("[Financing] Create offer error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Internal error",
			},
			{ status: 500 }
		);
	}
}
