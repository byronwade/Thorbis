import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/payments/primary-customer
 *
 * Fetch the Stripe customer ID for the user's primary (first) organization
 * This is used when creating additional organizations to show existing payment methods
 */
export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Service unavailable" },
				{ status: 503 },
			);
		}
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database not configured" },
				{ status: 500 },
			);
		}

		// Get user's Stripe customer ID
		const { data: userData } = await supabase
			.from("users")
			.select("stripe_customer_id")
			.eq("id", user.id)
			.single();

		if (!userData?.stripe_customer_id) {
			return NextResponse.json({ customerId: null });
		}

		return NextResponse.json({ customerId: userData.stripe_customer_id });
	} catch (_error) {
		return NextResponse.json(
			{ error: "Failed to fetch customer information" },
			{ status: 500 },
		);
	}
}
