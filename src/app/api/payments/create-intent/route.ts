/**
 * Create Payment Intent API Route - Server-side only
 *
 * Creates a Stripe PaymentIntent for processing payments
 * Supports:
 * - One-time payments
 * - Saving payment methods for future use
 * - Apple Pay and Google Pay
 */

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

const createIntentSchema = z.object({
	amount: z.number().int().positive(),
	currency: z.string().length(3).toLowerCase(),
	customerId: z.string().optional(),
	setupFutureUsage: z.enum(["on_session", "off_session"]).optional(),
	paymentMethodType: z.string().optional(),
});

export async function POST(request: NextRequest) {
	try {
		// Get authenticated user
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!stripe) {
			return NextResponse.json({ error: "Payment service unavailable" }, { status: 503 });
		}

		// Parse and validate request body
		const body = await request.json();
		const data = createIntentSchema.parse(body);

		// Get or create Stripe customer
		let stripeCustomerId = data.customerId;

		if (!stripeCustomerId) {
			// Check if user already has a Stripe customer ID
			const { data: userData } = await supabase
				.from("users")
				.select("stripe_customer_id, email, name")
				.eq("id", user.id)
				.single();

			if (userData?.stripe_customer_id) {
				stripeCustomerId = userData.stripe_customer_id;
			} else if (userData) {
				// Create new Stripe customer
				const customer = await stripe.customers.create({
					email: userData.email,
					name: userData.name,
					metadata: {
						supabase_user_id: user.id,
					},
				});

				stripeCustomerId = customer.id;

				// Save Stripe customer ID to database
				await supabase.from("users").update({ stripe_customer_id: customer.id }).eq("id", user.id);
			}
		}

		// Create PaymentIntent
		const paymentIntentParams: any = {
			amount: data.amount,
			currency: data.currency,
			customer: stripeCustomerId,
			automatic_payment_methods: {
				enabled: true,
				allow_redirects: "never", // For Express Checkout Element
			},
			metadata: {
				user_id: user.id,
				payment_method_type: data.paymentMethodType || "unknown",
			},
		};

		// If saving for future use, set setup_future_usage
		if (data.setupFutureUsage) {
			paymentIntentParams.setup_future_usage = data.setupFutureUsage;
		}

		const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.issues[0]?.message || "Validation error" }, { status: 400 });
		}

		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
