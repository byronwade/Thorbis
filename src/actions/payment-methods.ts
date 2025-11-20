"use server";

/**
 * Payment Methods Server Actions
 *
 * Handles payment method management:
 * - Save payment methods
 * - Set default payment methods
 * - Remove payment methods
 * - List payment methods
 *
 * Security:
 * - All actions verify user authentication
 * - All actions use RLS policies
 * - Stripe API calls are server-side only
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

// Validation schemas
const savePaymentMethodSchema = z.object({
	paymentMethodId: z.string().min(1),
	isDefault: z.boolean().optional().default(false),
	isDefaultForSubscription: z.boolean().optional().default(false),
});

const setDefaultSchema = z.object({
	paymentMethodId: z.string().uuid(),
	forSubscription: z.boolean().optional().default(false),
});

const removePaymentMethodSchema = z.object({
	paymentMethodId: z.string().uuid(),
});

/**
 * Save a payment method to the database
 * Called after Stripe payment is complete
 */
export async function savePaymentMethod(formData: FormData) {
	try {
		// Get authenticated user
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "Unauthorized" };
		}

		if (!stripe) {
			return { success: false, error: "Payment service unavailable" };
		}

		// Validate input
		const data = savePaymentMethodSchema.parse({
			paymentMethodId: formData.get("paymentMethodId"),
			isDefault: formData.get("isDefault") === "true",
			isDefaultForSubscription:
				formData.get("isDefaultForSubscription") === "true",
		});

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
				allow_redisplay: "always", // Allow prefilling for future purchases
			});

		if (insertError) {
			return { success: false, error: "Failed to save payment method" };
		}

		// Attach payment method to Stripe customer if not already attached
		const { data: userData } = await supabase
			.from("profiles")
			.select("stripe_customer_id")
			.eq("id", user.id)
			.single();

		if (userData?.stripe_customer_id) {
			try {
				await stripe.paymentMethods.attach(data.paymentMethodId, {
					customer: userData.stripe_customer_id,
				});

				// If this is the default, update Stripe customer default payment method
				if (data.isDefault) {
					await stripe.customers.update(userData.stripe_customer_id, {
						invoice_settings: {
							default_payment_method: data.paymentMethodId,
						},
					});
				}
			} catch (_stripeError) {
				// Don't fail - payment method is saved in our DB
			}
		}

		revalidatePath("/dashboard/settings/billing");
		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Validation error",
			};
		}

		return { success: false, error: "An error occurred" };
	}
}

/**
 * Set a payment method as default
 */
export async function setDefaultPaymentMethod(formData: FormData) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "Unauthorized" };
		}

		if (!stripe) {
			return { success: false, error: "Payment service unavailable" };
		}

		const data = setDefaultSchema.parse({
			paymentMethodId: formData.get("paymentMethodId"),
			forSubscription: formData.get("forSubscription") === "true",
		});

		// Update database - the trigger will automatically unset others
		const updateField = data.forSubscription
			? "is_default_for_subscription"
			: "is_default";

		const { error: updateError } = await supabase
			.from("payment_methods")
			.update({ [updateField]: true })
			.eq("id", data.paymentMethodId)
			.eq("user_id", user.id);

		if (updateError) {
			return { success: false, error: "Failed to set default payment method" };
		}

		// Update Stripe customer default payment method
		const { data: paymentMethodData } = await supabase
			.from("payment_methods")
			.select("stripe_payment_method_id")
			.eq("id", data.paymentMethodId)
			.single();

		const { data: userData } = await supabase
			.from("profiles")
			.select("stripe_customer_id")
			.eq("id", user.id)
			.single();

		if (
			userData?.stripe_customer_id &&
			paymentMethodData?.stripe_payment_method_id
		) {
			try {
				await stripe.customers.update(userData.stripe_customer_id, {
					invoice_settings: {
						default_payment_method: paymentMethodData.stripe_payment_method_id,
					},
				});
			} catch (_stripeError) {
				// Don't fail - default is set in our DB
			}
		}

		revalidatePath("/dashboard/settings/billing");
		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Validation error",
			};
		}

		return { success: false, error: "An error occurred" };
	}
}

/**
 * Remove a payment method
 */
export async function removePaymentMethod(formData: FormData) {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return { success: false, error: "Service unavailable" };
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "Unauthorized" };
		}

		if (!stripe) {
			return { success: false, error: "Payment service unavailable" };
		}

		const data = removePaymentMethodSchema.parse({
			paymentMethodId: formData.get("paymentMethodId"),
		});

		// Get payment method details before deleting
		const { data: paymentMethodData } = await supabase
			.from("payment_methods")
			.select(
				"stripe_payment_method_id, is_default, is_default_for_subscription",
			)
			.eq("id", data.paymentMethodId)
			.eq("user_id", user.id)
			.single();

		if (!paymentMethodData) {
			return { success: false, error: "Payment method not found" };
		}

		// Check if this is the only payment method
		const { count } = await supabase
			.from("payment_methods")
			.select("*", { count: "exact", head: true })
			.eq("user_id", user.id);

		if (
			count === 1 &&
			(paymentMethodData.is_default ||
				paymentMethodData.is_default_for_subscription)
		) {
			return {
				success: false,
				error: "Cannot remove your only payment method. Add another one first.",
			};
		}

		// Delete from database
		const { error: deleteError } = await supabase
			.from("payment_methods")
			.delete()
			.eq("id", data.paymentMethodId)
			.eq("user_id", user.id);

		if (deleteError) {
			return { success: false, error: "Failed to remove payment method" };
		}

		// Detach from Stripe customer
		try {
			await stripe.paymentMethods.detach(
				paymentMethodData.stripe_payment_method_id,
			);
		} catch (_stripeError) {
			// Don't fail - payment method is already removed from our DB
		}

		revalidatePath("/dashboard/settings/billing");
		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0]?.message || "Validation error",
			};
		}

		return { success: false, error: "An error occurred" };
	}
}

/**
 * Get all payment methods for the current user
 */
export async function getPaymentMethods() {
	try {
		const supabase = await createClient();
		if (!supabase) {
			return {
				success: false,
				error: "Service unavailable",
				paymentMethods: [],
			};
		}
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "Unauthorized", paymentMethods: [] };
		}

		const { data: paymentMethods, error } = await supabase
			.from("payment_methods")
			.select("*")
			.eq("user_id", user.id)
			.order("is_default", { ascending: false })
			.order("created_at", { ascending: false });

		if (error) {
			return {
				success: false,
				error: "Failed to fetch payment methods",
				paymentMethods: [],
			};
		}

		return { success: true, paymentMethods: paymentMethods || [] };
	} catch (_error) {
		return { success: false, error: "An error occurred", paymentMethods: [] };
	}
}
