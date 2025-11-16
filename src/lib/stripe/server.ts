/**
 * Stripe Server - Server-side Stripe utilities
 *
 * Features:
 * - Secure Stripe API client initialization
 * - Multi-organization subscription management
 * - Billing portal session creation
 * - Subscription lifecycle management
 *
 * Performance optimizations:
 * - Server-side only (uses secret key)
 * - Type-safe with TypeScript
 * - Proper error handling
 */

import Stripe from "stripe";

/**
 * Initialize Stripe server client
 *
 * SECURITY: This uses the secret key and must only be called server-side
 */
function getStripeServer(): Stripe | null {
	const secretKey = process.env.STRIPE_SECRET_KEY;

	if (!secretKey) {
		return null;
	}

	return new Stripe(secretKey, {
		apiVersion: "2025-10-29.clover",
		typescript: true,
	});
}

// Export singleton instance
export const stripe = getStripeServer();

/**
 * Create or retrieve Stripe customer for a user
 *
 * Creates a customer in Stripe if they don't have one yet
 * Links customer to user via metadata
 */
export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string): Promise<string | null> {
	if (!stripe) {
		return null;
	}

	try {
		// Check if customer already exists
		const customers = await stripe.customers.list({
			email,
			limit: 1,
		});

		if (customers.data.length > 0) {
			return customers.data[0].id;
		}

		// Create new customer
		const customer = await stripe.customers.create({
			email,
			name,
			metadata: {
				user_id: userId,
			},
		});

		return customer.id;
	} catch (_error) {
    console.error("Error:", _error);
		return null;
	}
}

/**
 * Create checkout session for new subscription
 *
 * For first organization: Base plan
 * For additional organizations: Base plan + Additional org addon
 */
export async function createCheckoutSession({
	customerId,
	companyId,
	isAdditionalOrg,
	successUrl,
	cancelUrl,
	phoneNumber,
}: {
	customerId: string;
	companyId: string;
	isAdditionalOrg: boolean;
	successUrl: string;
	cancelUrl: string;
	phoneNumber?: string;
}): Promise<string | null> {
	if (!stripe) {
		return null;
	}

	try {
		const basePriceId = process.env.STRIPE_PRICE_ID_BASE_PLAN;
		const additionalOrgPriceId = process.env.STRIPE_PRICE_ID_ADDITIONAL_ORG;

		if (!basePriceId) {
			return null;
		}

		// Build line items
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				price: basePriceId,
				quantity: 1,
			},
		];

		// Add additional organization fee if this is not the first org
		if (isAdditionalOrg && additionalOrgPriceId) {
			lineItems.push({
				price: additionalOrgPriceId,
				quantity: 1,
			});
		}

		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			mode: "subscription",
			line_items: lineItems,
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				company_id: companyId,
				is_additional_org: isAdditionalOrg.toString(),
				...(phoneNumber && { phone_number: phoneNumber }),
			},
			subscription_data: {
				metadata: {
					company_id: companyId,
				},
			},
		});

		return session.url;
	} catch (_error) {
    console.error("Error:", _error);
		return null;
	}
}

/**
 * Create billing portal session
 *
 * Allows users to manage their subscription, payment methods, and billing history
 */
export async function createBillingPortalSession(customerId: string, returnUrl: string): Promise<string | null> {
	if (!stripe) {
		return null;
	}

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: returnUrl,
		});

		return session.url;
	} catch (_error) {
    console.error("Error:", _error);
		return null;
	}
}

/**
 * Cancel subscription
 *
 * Cancels subscription at the end of the current billing period
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
	if (!stripe) {
		return false;
	}

	try {
		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: true,
		});

		return true;
	} catch (_error) {
    console.error("Error:", _error);
		return false;
	}
}

/**
 * Reactivate subscription
 *
 * Removes the cancellation flag from a subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<boolean> {
	if (!stripe) {
		return false;
	}

	try {
		await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: false,
		});

		return true;
	} catch (_error) {
    console.error("Error:", _error);
		return false;
	}
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
	if (!stripe) {
		return null;
	}

	try {
		const subscription = await stripe.subscriptions.retrieve(subscriptionId);
		return subscription;
	} catch (_error) {
    console.error("Error:", _error);
		return null;
	}
}

/**
 * List all subscriptions for a customer
 */
export async function listCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
	if (!stripe) {
		return [];
	}

	try {
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
			status: "all",
		});

		return subscriptions.data;
	} catch (_error) {
    console.error("Error:", _error);
		return [];
	}
}

/**
 * Attach payment method to customer
 *
 * Attaches a payment method collected via Stripe Elements to a customer
 * and sets it as the default payment method
 */
export async function attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Promise<boolean> {
	if (!stripe) {
		return false;
	}

	try {
		// Attach payment method to customer
		await stripe.paymentMethods.attach(paymentMethodId, {
			customer: customerId,
		});

		// Set as default payment method
		await stripe.customers.update(customerId, {
			invoice_settings: {
				default_payment_method: paymentMethodId,
			},
		});

		return true;
	} catch (_error) {
    console.error("Error:", _error);
		return false;
	}
}
