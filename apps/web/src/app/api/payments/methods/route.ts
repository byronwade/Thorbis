import { type NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe-server";

/**
 * GET /api/payments/methods
 *
 * Fetch payment methods for a Stripe customer
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const customerId = searchParams.get("customerId");

		if (!customerId) {
			return NextResponse.json(
				{ error: "Customer ID is required" },
				{ status: 400 },
			);
		}

		if (!stripe) {
			return NextResponse.json(
				{ error: "Payment system not configured" },
				{ status: 500 },
			);
		}

		// Fetch payment methods from Stripe
		const paymentMethods = await stripe.paymentMethods.list({
			customer: customerId,
			type: "card",
		});

		// Format response
		const formattedMethods = paymentMethods.data.map((pm) => ({
			id: pm.id,
			brand: pm.card?.brand || "card",
			last4: pm.card?.last4 || "****",
			exp_month: pm.card?.exp_month || 0,
			exp_year: pm.card?.exp_year || 0,
		}));

		return NextResponse.json({ paymentMethods: formattedMethods });
	} catch (_error) {
		return NextResponse.json(
			{ error: "Failed to fetch payment methods" },
			{ status: 500 },
		);
	}
}
