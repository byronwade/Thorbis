"use server";

/**
 * Onboarding Billing Actions
 *
 * Server actions for Stripe payment collection during onboarding.
 * Handles checkout session creation and post-checkout processing.
 */

import Stripe from "stripe";
import {
	buildOneTimeChargesLineItems,
	buildStripeSubscriptionItems,
	type OnboardingBillingSelections,
	STRIPE_PRICE_IDS,
	validateStripePriceIds,
} from "@/lib/onboarding/onboarding-fees";
import { createClient } from "@/lib/supabase/server";

// Lazily initialize Stripe client to avoid build-time errors
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
	if (!_stripe) {
		if (!process.env.STRIPE_SECRET_KEY) {
			throw new Error("STRIPE_SECRET_KEY is not configured");
		}
		_stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: "2024-11-20.acacia",
		});
	}
	return _stripe;
}

interface CheckoutSessionParams {
	companyId: string;
	teamMemberId: string;
	selections: OnboardingBillingSelections;
	successUrl: string;
	cancelUrl: string;
}

interface CheckoutSessionResult {
	success: boolean;
	checkoutUrl?: string;
	sessionId?: string;
	error?: string;
}

/**
 * Create Stripe Checkout session for onboarding payment collection
 *
 * Features:
 * - 14-day free trial
 * - Subscription with multiple line items
 * - One-time charges for setup fees
 * - Support for card and ACH payments
 * - Metadata for tracking
 *
 * @param params - Checkout session parameters
 * @returns Checkout URL or error
 */
export async function createOnboardingCheckoutSession(
	params: CheckoutSessionParams,
): Promise<CheckoutSessionResult> {
	try {
		// Validate Stripe price IDs are configured
		const validation = validateStripePriceIds();
		if (!validation.isValid) {
			return {
				success: false,
				error: `Missing Stripe configuration: ${validation.missing.join(", ")}`,
			};
		}

		const supabase = await createClient();

		// Get company and team member info
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("id, name, email")
			.eq("id", params.companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: "Company not found",
			};
		}

		// Check if company already has a Stripe customer ID
		let customerId = company.stripe_customer_id;

		// Create Stripe customer if needed
		if (!customerId) {
			const customer = await getStripe().customers.create({
				email: company.email || undefined,
				name: company.name,
				metadata: {
					company_id: params.companyId,
					team_member_id: params.teamMemberId,
					source: "onboarding",
				},
			});

			customerId = customer.id;

			// Save customer ID to database
			await supabase
				.from("companies")
				.update({ stripe_customer_id: customerId })
				.eq("id", params.companyId);
		}

		// Build subscription items (recurring charges)
		const subscriptionItems = buildStripeSubscriptionItems(params.selections);

		// Build one-time charges (porting + setup fees)
		const oneTimeCharges = buildOneTimeChargesLineItems(params.selections);

		// Calculate trial end date (14 days from now)
		const trialEnd = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60;

		// Combine subscription items and one-time charges
		const allLineItems = [
			...subscriptionItems.map((item) => ({
				price: item.price,
				quantity: item.quantity || 1,
			})),
			...oneTimeCharges.map((item) => ({
				price: item.price,
				quantity: item.quantity || 1,
			})),
		];

		// Create Stripe Checkout session
		const session = await getStripe().checkout.sessions.create({
			customer: customerId,
			mode: "subscription",
			payment_method_types: ["card", "us_bank_account"],

			// All line items (recurring + one-time)
			line_items: allLineItems,

			subscription_data: {
				trial_end: trialEnd,
				metadata: {
					company_id: params.companyId,
					team_member_id: params.teamMemberId,
					phone_porting_count: params.selections.phonePortingCount.toString(),
					new_phone_count: params.selections.newPhoneNumberCount.toString(),
					gmail_users: params.selections.gmailWorkspaceUsers.toString(),
					profit_rhino: params.selections.profitRhinoEnabled.toString(),
				},
			},

			metadata: {
				company_id: params.companyId,
				team_member_id: params.teamMemberId,
				source: "onboarding",
			},

			success_url: params.successUrl,
			cancel_url: params.cancelUrl,

			// Collect billing address
			billing_address_collection: "required",

			// Allow promotion codes
			allow_promotion_codes: true,
		});

		return {
			success: true,
			checkoutUrl: session.url || undefined,
			sessionId: session.id,
		};
	} catch (error) {
		console.error("Error creating checkout session:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to create checkout session",
		};
	}
}

interface CheckoutSuccessParams {
	sessionId: string;
	companyId: string;
}

interface CheckoutSuccessResult {
	success: boolean;
	subscriptionId?: string;
	customerId?: string;
	error?: string;
}

/**
 * Handle successful checkout - save payment details to database
 *
 * Called after Stripe Checkout completes successfully.
 * Updates company record with subscription and payment info.
 *
 * @param params - Session ID and company ID
 * @returns Success status with subscription details
 */
export async function handleCheckoutSuccess(
	params: CheckoutSuccessParams,
): Promise<CheckoutSuccessResult> {
	try {
		const supabase = await createClient();

		// Retrieve checkout session from Stripe
		const session = await getStripe().checkout.sessions.retrieve(params.sessionId, {
			expand: ["subscription", "customer"],
		});

		if (!session.subscription) {
			return {
				success: false,
				error: "No subscription found in checkout session",
			};
		}

		const subscription =
			typeof session.subscription === "string"
				? await getStripe().subscriptions.retrieve(session.subscription)
				: session.subscription;

		const customerId =
			typeof session.customer === "string"
				? session.customer
				: session.customer?.id;

		// Calculate trial end date
		const trialEnd = subscription.trial_end
			? new Date(subscription.trial_end * 1000).toISOString()
			: null;

		// Update company with subscription details
		const { error: updateError } = await supabase
			.from("companies")
			.update({
				stripe_customer_id: customerId,
				stripe_subscription_id: subscription.id,
				stripe_subscription_status: subscription.status,
				trial_ends_at: trialEnd,
				payment_method_collected: true,
				updated_at: new Date().toISOString(),
			})
			.eq("id", params.companyId);

		if (updateError) {
			console.error("Error updating company:", updateError);
			return {
				success: false,
				error: "Failed to save subscription details",
			};
		}

		return {
			success: true,
			subscriptionId: subscription.id,
			customerId: customerId || undefined,
		};
	} catch (error) {
		console.error("Error handling checkout success:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to process checkout success",
		};
	}
}

/**
 * Get checkout session status
 *
 * Checks if a checkout session was completed successfully.
 * Used on the success page to verify payment.
 *
 * @param sessionId - Stripe checkout session ID
 * @returns Session status and details
 */
export async function getCheckoutSessionStatus(sessionId: string) {
	try {
		const session = await getStripe().checkout.sessions.retrieve(sessionId);

		return {
			success: true,
			status: session.payment_status,
			completed: session.payment_status === "paid",
			subscriptionId:
				typeof session.subscription === "string"
					? session.subscription
					: session.subscription?.id,
		};
	} catch (error) {
		console.error("Error retrieving session status:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to retrieve session status",
		};
	}
}

/**
 * Retry a failed subscription payment
 *
 * Attempts to pay the latest unpaid invoice for the company's subscription.
 * Used in payment recovery flow when a payment has failed.
 *
 * @param companyId - The company ID to retry payment for
 * @returns Success status
 */
export async function retrySubscriptionPayment(
	companyId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = await createClient();

		// Get company's subscription details
		const { data: company, error: companyError } = await supabase
			.from("companies")
			.select("stripe_subscription_id, stripe_customer_id")
			.eq("id", companyId)
			.single();

		if (companyError || !company) {
			return {
				success: false,
				error: "Company not found",
			};
		}

		if (!company.stripe_subscription_id) {
			return {
				success: false,
				error: "No subscription found for this company",
			};
		}

		const stripe = getStripe();

		// Get the latest invoice for this subscription
		const invoices = await stripe.invoices.list({
			subscription: company.stripe_subscription_id,
			status: "open",
			limit: 1,
		});

		if (invoices.data.length === 0) {
			// No open invoices - try to find draft invoices
			const draftInvoices = await stripe.invoices.list({
				subscription: company.stripe_subscription_id,
				status: "draft",
				limit: 1,
			});

			if (draftInvoices.data.length === 0) {
				return {
					success: false,
					error: "No unpaid invoices found",
				};
			}

			// Finalize the draft invoice first
			const finalizedInvoice = await stripe.invoices.finalizeInvoice(
				draftInvoices.data[0].id,
			);

			// Then pay it
			const paidInvoice = await stripe.invoices.pay(finalizedInvoice.id);

			if (paidInvoice.status === "paid") {
				// Update company status
				await supabase
					.from("companies")
					.update({
						stripe_subscription_status: "active",
						payment_failed_at: null,
						updated_at: new Date().toISOString(),
					})
					.eq("id", companyId);

				return { success: true };
			}

			return {
				success: false,
				error: "Payment attempt failed",
			};
		}

		// Try to pay the open invoice
		const paidInvoice = await stripe.invoices.pay(invoices.data[0].id);

		if (paidInvoice.status === "paid") {
			// Update company status
			await supabase
				.from("companies")
				.update({
					stripe_subscription_status: "active",
					payment_failed_at: null,
					updated_at: new Date().toISOString(),
				})
				.eq("id", companyId);

			return { success: true };
		}

		return {
			success: false,
			error: "Payment attempt failed",
		};
	} catch (error) {
		console.error("Error retrying subscription payment:", error);

		// Check if it's a card declined error
		if (error instanceof Stripe.errors.StripeCardError) {
			return {
				success: false,
				error: error.message || "Your card was declined",
			};
		}

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to process payment retry",
		};
	}
}
