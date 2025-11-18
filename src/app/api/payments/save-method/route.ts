/**
 * Save Payment Method API Route - Server-side only
 *
 * Saves a payment method after successful payment
 * Called from the client after Express Checkout Element confirms payment
 */

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

const saveMethodSchema = z.object({
	paymentMethodId: z.string().min(1),
	customerId: z.string().optional(),
	isDefault: z.boolean().optional().default(false),
	isDefaultForSubscription: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
	try {
		// Get authenticated user
		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Service unavailable" },
				{ status: 503 },
			);
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		if (!stripe) {
			return NextResponse.json(
				{ error: "Payment service unavailable" },
				{ status: 503 },
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const data = saveMethodSchema.parse(body);

		// Get payment method from Stripe
		const paymentMethod = await stripe.paymentMethods.retrieve(
			data.paymentMethodId,
		);

		// Extract payment method details
		const type = paymentMethod.type;
		let brand: string | undefined;
		let last4: string | undefined;
		let expMonth: number | undefined;
		let expYear: number | undefined;
		let walletType: string | undefined;
		let displayName: string;

		if (paymentMethod.card) {
			brand = paymentMethod.card.brand;
			last4 = paymentMethod.card.last4;
			expMonth = paymentMethod.card.exp_month;
			expYear = paymentMethod.card.exp_year;
			displayName = `${brand?.toUpperCase()} •••• ${last4}`;

			// Check if card came from a wallet
			if (paymentMethod.card.wallet) {
				walletType = paymentMethod.card.wallet.type;
				if (walletType === "apple_pay") {
					displayName = `Apple Pay (${brand?.toUpperCase()} •••• ${last4})`;
				} else if (walletType === "google_pay") {
					displayName = `Google Pay (${brand?.toUpperCase()} •••• ${last4})`;
				}
			}
		} else {
			displayName = type
				.replace("_", " ")
				.replace(/\b\w/g, (l) => l.toUpperCase());
		}

		// Check if payment method already exists
		const { data: existingMethod } = await supabase
			.from("payment_methods")
			.select("id")
			.eq("user_id", user.id)
			.eq("stripe_payment_method_id", data.paymentMethodId)
			.single();

		if (existingMethod) {
			return NextResponse.json({
				success: true,
				message: "Payment method already saved",
			});
		}

		// Save to database
		const { error: insertError } = await supabase
			.from("payment_methods")
			.insert({
				user_id: user.id,
				stripe_payment_method_id: data.paymentMethodId,
				type: walletType || type,
				brand,
				last4,
				exp_month: expMonth,
				exp_year: expYear,
				wallet_type: walletType,
				display_name: displayName,
				is_default: data.isDefault,
				is_default_for_subscription: data.isDefaultForSubscription,
				billing_details: paymentMethod.billing_details,
				allow_redisplay: "always",
			});

		if (insertError) {
			return NextResponse.json(
				{ error: "Failed to save payment method" },
				{ status: 500 },
			);
		}

		// Attach payment method to Stripe customer if provided
		if (data.customerId) {
			try {
				await stripe.paymentMethods.attach(data.paymentMethodId, {
					customer: data.customerId,
				});

				// If this is the default, update Stripe customer
				if (data.isDefault) {
					await stripe.customers.update(data.customerId, {
						invoice_settings: {
							default_payment_method: data.paymentMethodId,
						},
					});
				}
			} catch (_stripeError) {
				// Don't fail - payment method is saved in our DB
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: error.issues[0]?.message || "Validation error" },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
