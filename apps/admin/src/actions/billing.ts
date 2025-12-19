"use server";

/**
 * Billing Management Actions
 *
 * Server actions for managing billing, subscriptions, and payments.
 * Uses Stripe as the payment processor.
 */

import Stripe from "stripe";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { logAdminAction } from "@/lib/admin/audit";

// Initialize Stripe client
function getStripeClient(): Stripe | null {
	const secretKey = process.env.STRIPE_SECRET_KEY;
	if (!secretKey) {
		console.warn("[Billing] Stripe secret key not configured");
		return null;
	}
	return new Stripe(secretKey, {
		apiVersion: "2025-10-29.clover",
		typescript: true,
	});
}

export interface SubscriptionDetails {
	id: string;
	company_id: string;
	company_name: string;
	stripe_subscription_id?: string;
	stripe_customer_id?: string;
	plan: string;
	status: string;
	amount?: number;
	interval?: "monthly" | "yearly";
	current_period_start?: string;
	current_period_end?: string;
	trial_ends_at?: string;
	cancel_at_period_end?: boolean;
	created_at: string;
}

/**
 * Get all subscriptions from database
 */
export async function getSubscriptions(limit: number = 100) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();

	// Get companies with subscription info
	const { data: companies, error } = await webDb
		.from("companies")
		.select("id, name, stripe_subscription_id, stripe_customer_id, subscription_tier, stripe_subscription_status, subscription_current_period_start, subscription_current_period_end, trial_ends_at, subscription_cancel_at_period_end, created_at")
		.not("stripe_subscription_id", "is", null)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		return { error: "Failed to fetch subscriptions" };
	}

	const subscriptions: SubscriptionDetails[] = (companies || []).map((company) => ({
		id: company.stripe_subscription_id || company.id,
		company_id: company.id,
		company_name: company.name,
		stripe_subscription_id: company.stripe_subscription_id,
		stripe_customer_id: company.stripe_customer_id,
		plan: company.subscription_tier || "free",
		status: company.stripe_subscription_status || "active",
		current_period_start: company.subscription_current_period_start,
		current_period_end: company.subscription_current_period_end,
		trial_ends_at: company.trial_ends_at,
		cancel_at_period_end: company.subscription_cancel_at_period_end || false,
		created_at: company.created_at,
	}));

	return { data: subscriptions };
}

/**
 * Get subscription by ID with full Stripe details
 */
export async function getSubscriptionById(subscriptionId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();
	const stripe = getStripeClient();

	// Find company by subscription ID
	const { data: company, error } = await webDb
		.from("companies")
		.select("*")
		.eq("stripe_subscription_id", subscriptionId)
		.single();

	if (error || !company) {
		return { error: "Subscription not found" };
	}

	// Fetch additional details from Stripe API
	let stripeSubscription: Stripe.Subscription | null = null;
	let stripeCustomer: Stripe.Customer | null = null;
	let invoices: Stripe.Invoice[] = [];
	let upcomingInvoice: Stripe.UpcomingInvoice | null = null;

	if (stripe && company.stripe_subscription_id) {
		try {
			// Get subscription details
			stripeSubscription = await stripe.subscriptions.retrieve(
				company.stripe_subscription_id,
				{ expand: ["default_payment_method", "latest_invoice"] }
			);

			// Get customer details
			if (company.stripe_customer_id) {
				const customer = await stripe.customers.retrieve(company.stripe_customer_id);
				if (!customer.deleted) {
					stripeCustomer = customer as Stripe.Customer;
				}
			}

			// Get recent invoices
			const invoiceList = await stripe.invoices.list({
				subscription: company.stripe_subscription_id,
				limit: 10,
			});
			invoices = invoiceList.data;

			// Get upcoming invoice
			try {
				upcomingInvoice = await stripe.invoices.retrieveUpcoming({
					subscription: company.stripe_subscription_id,
				});
			} catch {
				// No upcoming invoice (subscription cancelled or no future billing)
			}
		} catch (stripeError) {
			console.error("[Billing] Error fetching Stripe data:", stripeError);
		}
	}

	return {
		data: {
			id: company.stripe_subscription_id || company.id,
			company_id: company.id,
			company_name: company.name,
			stripe_subscription_id: company.stripe_subscription_id,
			stripe_customer_id: company.stripe_customer_id,
			plan: company.subscription_tier || "free",
			status: stripeSubscription?.status || company.stripe_subscription_status || "active",
			current_period_start: stripeSubscription?.current_period_start
				? new Date(stripeSubscription.current_period_start * 1000).toISOString()
				: company.subscription_current_period_start,
			current_period_end: stripeSubscription?.current_period_end
				? new Date(stripeSubscription.current_period_end * 1000).toISOString()
				: company.subscription_current_period_end,
			trial_ends_at: stripeSubscription?.trial_end
				? new Date(stripeSubscription.trial_end * 1000).toISOString()
				: company.trial_ends_at,
			cancel_at_period_end: stripeSubscription?.cancel_at_period_end ?? company.subscription_cancel_at_period_end ?? false,
			cancel_at: stripeSubscription?.cancel_at
				? new Date(stripeSubscription.cancel_at * 1000).toISOString()
				: null,
			created_at: company.created_at,
			// Additional Stripe details
			stripe_details: stripeSubscription ? {
				amount: stripeSubscription.items.data[0]?.price?.unit_amount || 0,
				currency: stripeSubscription.currency,
				interval: stripeSubscription.items.data[0]?.price?.recurring?.interval || "month",
				default_payment_method: stripeSubscription.default_payment_method,
				latest_invoice: stripeSubscription.latest_invoice,
			} : null,
			customer_details: stripeCustomer ? {
				email: stripeCustomer.email,
				name: stripeCustomer.name,
				balance: stripeCustomer.balance,
				delinquent: stripeCustomer.delinquent,
			} : null,
			recent_invoices: invoices.map(inv => ({
				id: inv.id,
				amount_due: inv.amount_due,
				amount_paid: inv.amount_paid,
				status: inv.status,
				created: new Date(inv.created * 1000).toISOString(),
				hosted_invoice_url: inv.hosted_invoice_url,
			})),
			upcoming_invoice: upcomingInvoice ? {
				amount_due: upcomingInvoice.amount_due,
				next_payment_attempt: upcomingInvoice.next_payment_attempt
					? new Date(upcomingInvoice.next_payment_attempt * 1000).toISOString()
					: null,
			} : null,
		},
	};
}

/**
 * Get billing dashboard stats with real Stripe MRR data
 */
export async function getBillingDashboardStats() {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const webDb = createWebClient();
	const stripe = getStripeClient();

	// Get all companies with subscriptions
	const { data: companies } = await webDb
		.from("companies")
		.select("stripe_subscription_id, stripe_subscription_status, subscription_tier, created_at, updated_at")
		.not("stripe_subscription_id", "is", null);

	if (!companies) {
		return {
			data: {
				total_mrr: 0,
				active_count: 0,
				trial_count: 0,
				past_due_count: 0,
				churned_this_month: 0,
				canceled_count: 0,
			},
		};
	}

	const active = companies.filter((c) => c.stripe_subscription_status === "active").length;
	const trialing = companies.filter((c) => c.stripe_subscription_status === "trialing").length;
	const pastDue = companies.filter((c) => c.stripe_subscription_status === "past_due").length;
	const canceled = companies.filter((c) => c.stripe_subscription_status === "canceled").length;

	// Calculate MRR from Stripe
	let totalMrr = 0;
	let churnedThisMonth = 0;

	if (stripe) {
		try {
			// Get active subscriptions from Stripe for accurate MRR
			const subscriptions = await stripe.subscriptions.list({
				status: "active",
				limit: 100,
			});

			for (const sub of subscriptions.data) {
				// Calculate MRR for each subscription
				const item = sub.items.data[0];
				if (item?.price?.unit_amount && item?.price?.recurring) {
					const amount = item.price.unit_amount;
					const interval = item.price.recurring.interval;
					const intervalCount = item.price.recurring.interval_count || 1;

					// Normalize to monthly
					if (interval === "year") {
						totalMrr += amount / (12 * intervalCount);
					} else if (interval === "month") {
						totalMrr += amount / intervalCount;
					} else if (interval === "week") {
						totalMrr += (amount * 52) / (12 * intervalCount);
					} else if (interval === "day") {
						totalMrr += (amount * 365) / (12 * intervalCount);
					}
				}
			}

			// Calculate churned this month
			const startOfMonth = new Date();
			startOfMonth.setDate(1);
			startOfMonth.setHours(0, 0, 0, 0);

			const canceledSubs = await stripe.subscriptions.list({
				status: "canceled",
				created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
				limit: 100,
			});

			churnedThisMonth = canceledSubs.data.length;
		} catch (stripeError) {
			console.error("[Billing] Error calculating MRR from Stripe:", stripeError);
			// Fallback to estimate
			totalMrr = active * 10000; // $100/month estimate in cents
		}
	} else {
		// Fallback estimate when Stripe is not configured
		totalMrr = active * 10000; // $100/month estimate in cents
	}

	return {
		data: {
			total_mrr: Math.round(totalMrr), // In cents
			active_count: active,
			trial_count: trialing,
			past_due_count: pastDue,
			canceled_count: canceled,
			churned_this_month: churnedThisMonth,
		},
	};
}

/**
 * Cancel subscription via Stripe
 *
 * Cancels at period end by default, or immediately if specified.
 */
export async function cancelSubscription(
	subscriptionId: string,
	options: { immediately?: boolean; reason?: string } = {}
) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const stripe = getStripeClient();
	if (!stripe) {
		return { error: "Stripe is not configured" };
	}

	const webDb = createWebClient();

	try {
		// Find company by subscription ID
		const { data: company } = await webDb
			.from("companies")
			.select("id, name, stripe_subscription_id")
			.eq("stripe_subscription_id", subscriptionId)
			.single();

		if (!company) {
			return { error: "Subscription not found" };
		}

		let canceledSubscription: Stripe.Subscription;

		if (options.immediately) {
			// Cancel immediately
			canceledSubscription = await stripe.subscriptions.cancel(subscriptionId, {
				cancellation_details: {
					comment: options.reason || `Canceled by admin: ${session.email}`,
				},
			});
		} else {
			// Cancel at period end (more common)
			canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
				cancel_at_period_end: true,
				cancellation_details: {
					comment: options.reason || `Set to cancel by admin: ${session.email}`,
				},
			});
		}

		// Update local database
		await webDb
			.from("companies")
			.update({
				stripe_subscription_status: canceledSubscription.status,
				subscription_cancel_at_period_end: canceledSubscription.cancel_at_period_end,
				updated_at: new Date().toISOString(),
			})
			.eq("id", company.id);

		// Log the admin action
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: options.immediately ? "subscription_canceled_immediately" : "subscription_set_to_cancel",
			resourceType: "subscription",
			resourceId: subscriptionId,
			details: {
				company_id: company.id,
				company_name: company.name,
				reason: options.reason,
				cancel_at_period_end: canceledSubscription.cancel_at_period_end,
				current_period_end: canceledSubscription.current_period_end
					? new Date(canceledSubscription.current_period_end * 1000).toISOString()
					: null,
			},
		});

		return {
			success: true,
			data: {
				status: canceledSubscription.status,
				cancel_at_period_end: canceledSubscription.cancel_at_period_end,
				current_period_end: canceledSubscription.current_period_end
					? new Date(canceledSubscription.current_period_end * 1000).toISOString()
					: null,
			},
		};
	} catch (error: any) {
		console.error("[Billing] Error canceling subscription:", error);
		return { error: error.message || "Failed to cancel subscription" };
	}
}

/**
 * Reactivate subscription via Stripe
 *
 * Removes the cancellation flag from a subscription that was set to cancel at period end.
 */
export async function reactivateSubscription(subscriptionId: string) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const stripe = getStripeClient();
	if (!stripe) {
		return { error: "Stripe is not configured" };
	}

	const webDb = createWebClient();

	try {
		// Find company by subscription ID
		const { data: company } = await webDb
			.from("companies")
			.select("id, name, stripe_subscription_id")
			.eq("stripe_subscription_id", subscriptionId)
			.single();

		if (!company) {
			return { error: "Subscription not found" };
		}

		// Check current subscription status
		const currentSub = await stripe.subscriptions.retrieve(subscriptionId);

		if (currentSub.status === "canceled") {
			return { error: "Cannot reactivate a fully canceled subscription. Create a new subscription instead." };
		}

		if (!currentSub.cancel_at_period_end) {
			return { error: "Subscription is not set to cancel" };
		}

		// Reactivate by removing cancel_at_period_end
		const reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
			cancel_at_period_end: false,
		});

		// Update local database
		await webDb
			.from("companies")
			.update({
				stripe_subscription_status: reactivatedSubscription.status,
				subscription_cancel_at_period_end: false,
				updated_at: new Date().toISOString(),
			})
			.eq("id", company.id);

		// Log the admin action
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "subscription_reactivated",
			resourceType: "subscription",
			resourceId: subscriptionId,
			details: {
				company_id: company.id,
				company_name: company.name,
				new_status: reactivatedSubscription.status,
			},
		});

		return {
			success: true,
			data: {
				status: reactivatedSubscription.status,
				cancel_at_period_end: reactivatedSubscription.cancel_at_period_end,
			},
		};
	} catch (error: any) {
		console.error("[Billing] Error reactivating subscription:", error);
		return { error: error.message || "Failed to reactivate subscription" };
	}
}

/**
 * Update subscription plan
 *
 * Changes the subscription to a different price/plan.
 */
export async function updateSubscriptionPlan(
	subscriptionId: string,
	newPriceId: string,
	options: { prorate?: boolean } = { prorate: true }
) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const stripe = getStripeClient();
	if (!stripe) {
		return { error: "Stripe is not configured" };
	}

	const webDb = createWebClient();

	try {
		// Find company by subscription ID
		const { data: company } = await webDb
			.from("companies")
			.select("id, name, stripe_subscription_id, subscription_tier")
			.eq("stripe_subscription_id", subscriptionId)
			.single();

		if (!company) {
			return { error: "Subscription not found" };
		}

		// Get current subscription
		const currentSub = await stripe.subscriptions.retrieve(subscriptionId);
		const currentItemId = currentSub.items.data[0]?.id;

		if (!currentItemId) {
			return { error: "No subscription items found" };
		}

		// Update the subscription
		const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
			items: [
				{
					id: currentItemId,
					price: newPriceId,
				},
			],
			proration_behavior: options.prorate ? "create_prorations" : "none",
		});

		// Get the new plan details
		const newPrice = await stripe.prices.retrieve(newPriceId, {
			expand: ["product"],
		});

		const newPlanName = typeof newPrice.product === "object" && "name" in newPrice.product
			? newPrice.product.name
			: "Unknown Plan";

		// Update local database
		await webDb
			.from("companies")
			.update({
				subscription_tier: newPlanName.toLowerCase().replace(/\s+/g, "_"),
				updated_at: new Date().toISOString(),
			})
			.eq("id", company.id);

		// Log the admin action
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "subscription_plan_updated",
			resourceType: "subscription",
			resourceId: subscriptionId,
			details: {
				company_id: company.id,
				company_name: company.name,
				old_tier: company.subscription_tier,
				new_tier: newPlanName,
				new_price_id: newPriceId,
				prorated: options.prorate,
			},
		});

		return {
			success: true,
			data: {
				status: updatedSubscription.status,
				new_plan: newPlanName,
				amount: updatedSubscription.items.data[0]?.price?.unit_amount || 0,
			},
		};
	} catch (error: any) {
		console.error("[Billing] Error updating subscription plan:", error);
		return { error: error.message || "Failed to update subscription plan" };
	}
}

/**
 * Issue credit to customer's Stripe account
 */
export async function issueCustomerCredit(
	companyId: string,
	amountCents: number,
	reason: string
) {
	const session = await getAdminSession();
	if (!session) {
		return { error: "Unauthorized" };
	}

	const stripe = getStripeClient();
	if (!stripe) {
		return { error: "Stripe is not configured" };
	}

	const webDb = createWebClient();

	try {
		// Find company
		const { data: company } = await webDb
			.from("companies")
			.select("id, name, stripe_customer_id")
			.eq("id", companyId)
			.single();

		if (!company || !company.stripe_customer_id) {
			return { error: "Company or Stripe customer not found" };
		}

		// Add credit to customer balance (negative amount = credit)
		const balanceTransaction = await stripe.customers.createBalanceTransaction(
			company.stripe_customer_id,
			{
				amount: -Math.abs(amountCents), // Negative = credit
				currency: "usd",
				description: reason,
			}
		);

		// Log the admin action
		await logAdminAction({
			adminUserId: session.userId,
			adminEmail: session.email || "",
			action: "customer_credit_issued",
			resourceType: "company",
			resourceId: companyId,
			details: {
				company_name: company.name,
				amount_cents: amountCents,
				reason,
				balance_transaction_id: balanceTransaction.id,
			},
		});

		return {
			success: true,
			data: {
				transaction_id: balanceTransaction.id,
				new_balance: balanceTransaction.ending_balance,
			},
		};
	} catch (error: any) {
		console.error("[Billing] Error issuing credit:", error);
		return { error: error.message || "Failed to issue credit" };
	}
}



